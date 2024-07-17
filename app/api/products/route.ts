import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from  "uuid";
const db = require('@/db');

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    let offset = '0';
    const updatedOffset = searchParams.get('page');
    if(updatedOffset){
        offset = updatedOffset;
    }
    const category = searchParams.get('c');
    const specie = searchParams.get('specie')
    const colors = searchParams.get('colors');

    const connection = await db.getConnection();
    console.log('USING connection in GET products threadId:', connection.threadId);
    // console.log(colors, categories)

    try {
        await connection.beginTransaction();

        const values: string[] = [];
        let query = `
            SELECT 
                c.category_id,
                c.name as category_name,
                c.description as category_description,
                co.color_id,
                co.color_label,
                ps.id as stock_id,
                ps.stock,
                ps.updated_at as stock_updated,
                p.product_id,
                p.name as product_name,
                p.description,
                p.price,
                p.specie_name,
                p.breed_name,
                p.discount,
                p.image_url,
                p.created_at,
                p.updated_at
            from products p 
            inner join categories c
            on p.category_id = c.category_id
            inner join product_stock ps
            on p.product_id = ps.product_id
            left join colors co
            on ps.color_id = co.color_id
        `;

        // console.log(category, specie)
        if(colors){ 
            const colorsArray = colors.split(',');
            let colorFilter = `WHERE (` + colorsArray.map(() => `co.color_id = ?`).join(' OR ') + `)`;
            query += colorFilter;
            values.push(...colorsArray);
        }
        if(category && category !== 'null'){ 
            const categoriesArray = category.split(',');
            let categoryFilter = ` ${colors ? 'AND' : 'WHERE'} (` + categoriesArray.map(() => `c.category_id = ?`).join(' OR ') + `)`;
            query += categoryFilter;
            values.push(...categoriesArray);
        }
        if(specie){ 
            let specieFilter = ` ${specie ? 'AND' : 'WHERE'} (p.specie_name = ?)`;
            query += specieFilter;
            values.push(specie);
        }

        const limit = 10;
        query += ` LIMIT ${limit} OFFSET ${offset};`;
        // console.log(query, values)
        const [productsResult] = await connection.query(query, values)

        // console.log(productsResult)
        await connection.commit();
        return new NextResponse(JSON.stringify({ success: true, products: productsResult}), { status: 200 });

    } catch (error: any) {
        await connection.rollback();
        return new NextResponse(JSON.stringify({ success: false, error: error.message}), { status: 500 });

    } finally {
        console.log('RELEASING connection in GET products threadId:', connection.threadId);
        connection.release();
    }
}

export async function POST(req: NextRequest) {
    const connection = await db.getConnection();
    console.log('USING connection in POST products threadId:', connection.threadId);

    try {
        await connection.beginTransaction();

        const product_id = uuidv4();
        const formData = await req.json();
        const { name, description, category, specie, breed, color, stock, price, discount, imageURL } = formData
        let updatedBreed = breed;
        let updatedColor = color;
        if(breed === 'NULL'){
            updatedBreed = null
        }
        if(color === 'NULL'){
            updatedColor = null
        }

        const [newProductQuery] = await connection.query(
            `INSERT INTO products (product_id, name, specie_name, breed_name, description, category_id, price, discount, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [product_id, name, specie, updatedBreed, description, category, price, discount, imageURL]
        );

        const [newProductStockQuery] = await connection.query(
            `INSERT INTO product_stock (product_id, color_id, stock) VALUES (?, ?, ?);`,
            [product_id, updatedColor, stock]
        );

        if(newProductQuery.affectedRows > 0 && newProductStockQuery.affectedRows > 0){
            connection.commit()
            return new NextResponse(JSON.stringify({ success: true }), { status: 200 })
        } else {
            throw new Error('Error inserting new product')
        }

    } catch (error: any) {
        await connection.rollback();
        return new NextResponse(JSON.stringify({ success: false, error: error.message}), { status: 500 });

    } finally {
        console.log('RELEASING connection in POST products threadId:', connection.threadId);
        connection.release();
    }
}
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from  "uuid";
const db = require('@/db');

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const categories = searchParams.get('categories');
    const colors = searchParams.get('colors');
    const priceRange = searchParams.get('price');

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
                p.product_id,
                p.name as product_name,
                p.description,
                p.stock,
                p.price,
                p.discount,
                p.image_url,
                p.created_at,
                p.updated_at    
            from products p 
            inner join categories c
            on p.category_id = c.category_id
            inner join colors co
            on p.color = co.color_id
        `;

        if(colors){ 
            const colorsArray = colors.split(',');
            let colorFilter = `WHERE (` + colorsArray.map(() => `co.color_id = ?`).join(' OR ') + `)`;
            query += colorFilter;
            values.push(...colorsArray);
        }
        if(categories){ 
            const categoriesArray = categories.split(',');
            let categoryFilter = ` ${colors ? 'AND' : 'WHERE'} (` + categoriesArray.map(() => `c.category_id = ?`).join(' OR ') + `)`;
            query += categoryFilter;
            values.push(...categoriesArray);
        }

        query += `;`
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
        const { name, description, category, color, stock, price, imageURL } = formData

        const [newProductQuery] = await connection.query(
            `INSERT INTO products (product_id, name, description, category_id, color, stock, price, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
            [product_id, name, description, category, color, stock, price, imageURL]
        );

        if(newProductQuery.affectedRows > 0){
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
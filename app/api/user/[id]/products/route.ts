import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from  "uuid";
const db = require('@/db');

interface Params {
    params: {
        id: string;
    };
}

export async function GET(req: NextRequest, { params }: Params, res: NextResponse) {
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

    const { id } = params;

    try {
        await connection.beginTransaction();

        const values: string[] = [id];
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
                p.updated_at,
                CASE WHEN up.product_id IS NOT NULL THEN 1 ELSE 0 END as is_saved
            from products p 
            inner join categories c
            on p.category_id = c.category_id
            inner join product_stock ps
            on p.product_id = ps.product_id
            left join colors co
            on ps.color_id = co.color_id
            left join user_products up
            on up.product_id = p.product_id
            AND up.user_id = ?
        `
        // console.log(category, specie)
        const filters: string[] = [];
        if (colors) {
            const colorsArray = colors.split(',');
            const colorFilter = colorsArray.map(() => `co.color_id = ?`).join(' OR ');
            filters.push(`(${colorFilter})`);
            values.push(...colorsArray);
        }
        if (category && category !== 'null') {
            filters.push(`c.category_id = ?`);
            values.push(category);
        }
        if (specie) {
            filters.push(`p.specie_name = ?`);
            values.push(specie);
        }

        if (filters.length > 0) {
            query += ' WHERE ' + filters.join(' AND ');
        }

        const limit = 10;
        query += ` LIMIT ${limit} OFFSET ${offset};`;
        
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
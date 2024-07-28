import { NextRequest, NextResponse } from "next/server";
const db = require('@/db');

export async function GET(req: NextRequest) {

    const connection = await db.getConnection();
    console.log('USING connection in GET deals threadId:', connection.threadId);

    try {
        await connection.beginTransaction();

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
            ORDER BY p.discount DESC
            LIMIT 3 OFFSET 0;
        `;

        const [productsResult] = await connection.query(query)

        await connection.commit();
        return new NextResponse(JSON.stringify({ success: true, products: productsResult}), { status: 200 });

    } catch (error: any) {
        await connection.rollback();
        return new NextResponse(JSON.stringify({ success: false, error: error.message}), { status: 500 });

    } finally {
        console.log('RELEASING connection in GET deals threadId:', connection.threadId);
        connection.release();
    }
}
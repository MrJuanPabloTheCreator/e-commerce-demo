import { NextRequest, NextResponse } from "next/server";
const db = require('@/db')

interface Params {
    params: {
        id: string;
    };
}

export async function POST(req: NextRequest, { params }: Params, res: NextResponse) {
    const connection = await db.getConnection();
    console.log('USING connection in POST user/id/saved-items threadId:', connection.threadId);

    const { id } = params;
    const { productId } = await req.json();

    if(!id || !productId){
        return NextResponse.json({ success: false, error: 'No credentials' }, { status: 401 });
    }

    try {
        await connection.beginTransaction();

        const [saveItemQuery] = await connection.query(`
            INSERT INTO user_products (user_id, product_id)
            VALUES (?, ?);`, 
            [id, productId]
        );

        if(saveItemQuery.affectedRows > 0){
            await connection.commit();
            return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
        } else {
            throw new Error('Error inserting item')
        }

    } catch (error:any) {
        await connection.rollback();
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });

    } finally {
        console.log('RELEASING connection in POST user/id/saved-items threadId:', connection.threadId);
        connection.release();
    }
}

export async function GET(req: NextRequest, { params }: Params, res: NextResponse) {
    const connection = await db.getConnection();
    console.log('USING connection in GET user/id/saved-items threadId:', connection.threadId);

    const { id } = params;

    try {
        await connection.beginTransaction();

        const [savedItemsQuery] = await connection.query(`
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
            WHERE up.user_id = ?;`, 
            [id]
        );

        await connection.commit();
        return new NextResponse(JSON.stringify({ success: true, items: savedItemsQuery }), { status: 200 });

    } catch (error:any) {
        await connection.rollback();
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });

    } finally {
        console.log('RELEASING connection in GET user/id/saved-items threadId:', connection.threadId);
        connection.release();
    }
}

export async function DELETE(req: NextRequest, { params }: Params, res: NextResponse) {
    const connection = await db.getConnection();
    console.log('USING connection in DELETE user/id/saved-items threadId:', connection.threadId);

    const { id } = params;
    const { productId } = await req.json();

    try {
        await connection.beginTransaction();

        const values = [id]
        let query = `
            DELETE from user_products
            WHERE user_id = ?
        `

        if(productId){
            query += ` AND product_id = ?`
            values.push(productId)
        }
        query += `;`

        const [deleteSavedItemQuery] = await connection.query(query, values);
        if(deleteSavedItemQuery.affectedRows > 0){
            await connection.commit();
            return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
        } else {
            throw new Error('Unable to delete item from saved products')
        }

    } catch (error:any) {
        await connection.rollback();
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });

    } finally {
        console.log('RELEASING connection in DELETE user/id/saved-items threadId:', connection.threadId);
        connection.release();
    }
}
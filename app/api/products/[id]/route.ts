import { NextRequest, NextResponse } from "next/server";
const db = require('@/db')

interface Params {
    params: {
        id: string;
    };
}

export async function DELETE(req: NextRequest, { params }: Params, res: NextResponse) {
    const connection = await db.getConnection();
    console.log('USING connection in GET products/id threadId:', connection.threadId);

    const { id } = params;

    try {
        await connection.beginTransaction();

        const [deleteProductQuery] = await connection.query('DELETE FROM products WHERE product_id = ?;', [id]);

        if(deleteProductQuery.affectedRows > 0){
            await connection.commit();
            return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
        } else {
            throw new Error('No affected rows')
        }

    } catch (error:any) {
        await connection.rollback();
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });

    } finally {
        console.log('RELEASING connection in GET producs/id threadId:', connection.threadId);
        connection.release();
    }
}
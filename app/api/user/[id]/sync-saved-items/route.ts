import { NextRequest, NextResponse } from "next/server";
const db = require('@/db')

interface Params {
    params: {
        id: string;
    };
}

export async function POST(req: NextRequest, { params }: Params, res: NextResponse) {
    const connection = await db.getConnection();
    console.log('USING connection in POST user/id/sync-saved-items threadId:', connection.threadId);

    const { id } = params;
    const { savedItemsIds }:{ savedItemsIds: string[] } = await req.json();

    if(!id || !savedItemsIds){
        return NextResponse.json({ success: false, error: 'No credentials' }, { status: 401 });
    }

    try {
        await connection.beginTransaction();

        let allSuccessful = true;

        for (const product_id of savedItemsIds) {
            const [newSavedItemQuery] = await connection.query(`
                INSERT INTO user_products (user_id, product_id)
                VALUES (?, ?);`, 
                [id, product_id]
            );

            if (newSavedItemQuery.affectedRows === 0) {
                allSuccessful = false;
                break;
            }
        }

        if(allSuccessful){
            await connection.commit();
            return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
        } else {
            throw new Error('Error inserting item')
        }

    } catch (error:any) {
        await connection.rollback();
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });

    } finally {
        console.log('RELEASING connection in POST user/id/sync-saved-items threadId:', connection.threadId);
        connection.release();
    }
}
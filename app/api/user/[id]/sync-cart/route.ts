import { CartItem } from "@/types/cartItem";
import { NextRequest, NextResponse } from "next/server";
const db = require('@/db')

interface Params {
    params: {
        id: string;
    };
}

export async function POST(req: NextRequest, { params }: Params, res: NextResponse) {
    const connection = await db.getConnection();
    console.log('USING connection in POST user/id/sync-cart threadId:', connection.threadId);

    const { id } = params;
    const { newProducts }:{ newProducts:[string, CartItem][] } = await req.json();

    if(!id || !newProducts){
        return NextResponse.json({ success: false, error: 'No credentials' }, { status: 401 });
    }

    try {
        await connection.beginTransaction();

        let allSuccessful = true;

        for (const [product_id, item] of newProducts) {

            const [newItemQuery] = await connection.query(`
                INSERT INTO user_cart (user_id, product_id, quantity)
                VALUES (?, ?, ?);`, 
                [id, product_id, item.quantity]
            );

            if (newItemQuery.affectedRows === 0) {
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
        console.log('RELEASING connection in POST user/id/sync-cart threadId:', connection.threadId);
        connection.release();
    }
}

export async function PATCH(req: NextRequest, { params }: Params, res: NextResponse) {
    const connection = await db.getConnection();
    console.log('USING connection in PATCH user/id/sync-cart threadId:', connection.threadId);

    const { id } = params;
    const { updateProducts }:{ updateProducts: [string, number][] }  = await req.json();

    if(!id || !updateProducts){
        return NextResponse.json({ success: false, error: 'No credentials' }, { status: 401 });
    }

    try {
        await connection.beginTransaction();

        let allSuccessful = true;

        for (const [product_id, quantity] of updateProducts) {
            console.log('Updating db', quantity)
            const [updateItemQuery] = await connection.query(`
                UPDATE user_cart SET quantity = ? 
                WHERE product_id = ? AND user_id = ?;`, 
                [quantity, product_id, id]
            );

            if (updateItemQuery.affectedRows === 0) {
                allSuccessful = false;
                break;
            }
        }

        if(allSuccessful){
            console.log("Sync Patch succesfull")
            await connection.commit();
            return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
        } else {
            throw new Error('Error inserting item')
        }

    } catch (error:any) {
        await connection.rollback();
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });

    } finally {
        console.log('RELEASING connection in PATCH user/id/sync-cart threadId:', connection.threadId);
        connection.release();
    }
}
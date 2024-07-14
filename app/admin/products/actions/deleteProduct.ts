"use client"

export const deleteProduct = async (product_id: string) => {
    const deleteProductResponse =  await fetch(`/api/products/${product_id}`, {
        method: 'DELETE',
    })
    const { success, error } = await deleteProductResponse.json();
    return { success, error}
}
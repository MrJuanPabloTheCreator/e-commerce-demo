"use client"

import { ImageUp, X } from "lucide-react";
import styles from "./_styles/newProductModal.module.css"
import { FieldValues, useForm, Controller } from "react-hook-form";
import { computeSHA256 } from "@/lib/SHA256";
import { getSignedURL } from "@/lib/actions";
import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

import { categories, colors } from "@/constants";
import { Product } from "@/types";

interface NewProductModalProps {
    selectedProduct: Product;
    setProductModal: (value: Product | null) => void;
};

const UpdateProductModal: React.FC<NewProductModalProps> = ({ selectedProduct, setProductModal }) => {
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const { 
        register, 
        handleSubmit, 
        control,
        formState: { errors, isSubmitting },
        reset
    } = useForm({
        defaultValues: {
          name: selectedProduct.product_name,
          description: selectedProduct.description,
          category: selectedProduct.category_id,
          color: selectedProduct.color_id,
          stock: selectedProduct.stock,
          price: selectedProduct.price,
          image_url: selectedProduct.image_url,
        }
    });

    useEffect(() => {
        if (selectedProduct) {
          reset({
            name: selectedProduct.product_name,
            description: selectedProduct.description,
            category: selectedProduct.category_id,
            color: selectedProduct.color_id,
            stock: selectedProduct.stock,
            price: selectedProduct.price,
            image_url: selectedProduct.image_url
          });
    
          setImagePreview(selectedProduct.image_url);
        }
    }, [selectedProduct, reset]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setImageFile(file)

        if(imagePreview){
            URL.revokeObjectURL(imagePreview)
        }

        if(file) {
            const url = URL.createObjectURL(file)
            setImagePreview(url)
        } else {
            setImagePreview(null)
        }
    };

    const onSubmit = async (data: FieldValues) => {
        try {
            let imageURL = null;
            if(imageFile){
                const checksum = await computeSHA256(imageFile)
                const signedUrlResult = await getSignedURL(imageFile.type, imageFile.size, checksum)

                if (signedUrlResult.succes) {
                    const url = signedUrlResult.succes.url
                    const name = signedUrlResult.succes.name
                    
                    const s3ImageUpload = await fetch(url, {
                        method: "PUT",
                        body: imageFile,
                        headers: {
                            "Content-Type": imageFile.type,
                        },
                    })

                    if (!s3ImageUpload.ok) {
                        throw new Error('Failed to upload image to S3');
                    }

                    imageURL = `https://voy-now-bucket.s3.amazonaws.com/${name}`

                } else {
                    throw new Error('Failed to get signed URL');
                }
            }
            const { name, description, category, color, stock, price, } = data;

            const newProductResponse = await fetch('/api/products', {
                method: 'PATCH',
                body: JSON.stringify({
                    name,
                    description,
                    category,
                    color,
                    stock,
                    price,
                    imageURL
                })
            })

            const { success, error } = await newProductResponse.json()
            if (success){
                toast.success("Product posted succesfully!")
                reset();
                setProductModal(null)
            } else {
                throw new Error(error)
            }
             
        } catch (error: any){
            toast.error(error.message)
        }
    }

    return (
        <div className={styles.modalContainer}>
            <header>
                <h2>
                    Product {selectedProduct.category_id}
                </h2>
                <button onClick={() => setProductModal(null)}>
                    <X size={16} />
                </button>
            </header>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
                <section className={styles.section_1}>

                    <div>
                        <fieldset>
                            <h3>Product Name</h3>
                            <input
                                {
                                    ...register("name", {
                                        required: "Product name is required",
                                    })
                                }
                            />
                            {errors.name && <span>This field is required</span>}
                        </fieldset>

                        <fieldset>
                            <h3>Description</h3>
                            <textarea
                                {
                                    ...register("description", {
                                        required: "Description is required",
                                    })
                                }
                            />
                            {errors.description && <span>This field is required</span>}
                        </fieldset>

                        {/* <fieldset>
                            <h3>Category</h3>
                            <select
                                {
                                    ...register("category", {
                                        required: "Category is required",
                                        validate: value => value != ''
                                    })
                                }
                            >
                                <option value={''}>Select category</option>
                                {categories.map((category, index) => 
                                    <option key={index} value={category.value}>
                                        {category.label}
                                    </option>
                                )}
                            </select>
                            {errors.category && <span>Please select a valid category</span>}
                        </fieldset> */}

                    </div>

                    {imagePreview ? (
                        <div className={styles.imageContainer}>
                            <Image src={imagePreview} alt="product image" className={styles.image} layout="fill"/> 
                        </div>
                    ):( 
                        <label className={styles.imageInput}>
                            <ImageUp size={48}/>
                            <Controller
                                control={control}
                                name="image_url"
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
                                    onChange={(e) => {
                                        handleFileChange(e);
                                        field.onChange(e);
                                    }}
                                    />
                                )}
                            />
                        </label>
                    )} 

                </section>

                <section className={styles.section_2}>   

                    <fieldset>
                        <h3>Color</h3>
                        <select
                            {
                                ...register("color", {
                                    required: true,
                                    validate: value => value != '' 
                                })
                            }
                        >
                            <option value={''}>Select color</option>
                            {colors.map((color, index) => 
                                <option key={index} value={color.value}>
                                    {color.label}
                                </option>
                            )}
                        </select>
                        {errors.color && <span>Please select a valid color</span>}
                    </fieldset>

                    <fieldset>
                        <h3>Stock</h3>
                        <input
                            type="number" 
                            step="0.01" 
                            {...register("stock", { required: true, validate: value => value >= 1 })} 
                        />
                        {errors.stock && <span>This field is required and must be a positive number</span>}
                    </fieldset>

                    <fieldset>
                        <h3>Price</h3>
                        <input
                            type="number" 
                            step="0.01" 
                            {...register("price", { required: true, validate: value => value >= 0 || "Price must be a positive number"  })} 
                        />
                        {errors.price && <span>This field is required and must be a positive number</span>}
                    </fieldset>

                </section>

                <button
                    disabled={isSubmitting}
                >
                    Update
                </button>

            </form>
        </div>
    )
}

export default UpdateProductModal;
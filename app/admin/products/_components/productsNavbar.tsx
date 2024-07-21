"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

import styles from "./_styles/navbar.module.css"
import { ChevronDown, Plus, SlidersHorizontal } from "lucide-react";
import NewProductModal from "./newProductModal";
import { colors, categories } from "@/constants";

type FilterOptions = {
  categories: Set<string>;
  colors: Set<string>;
}

const ProductsNavbar = () => {
  const [addProductModal, setAddProductModal] = useState(false)
  const [activeFilter, setActiveFilter] = useState(false)
  const [activeOption, setActiveOption] = useState<string | null>(null)
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    categories: new Set<string>(),
    colors: new Set<string>(),
  });

  const router = useRouter();
  const searchParamsUrl = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const categoriesParam = searchParamsUrl.get('categories');
    const colorsParam = searchParamsUrl.get('colors');
    const newFilterOptions: FilterOptions = { colors: new Set<string>(), categories: new Set<string>() };

    if (colorsParam) {
      const colorsArray = colorsParam.split(',');
      newFilterOptions.colors = new Set(colorsArray);
    }

    if (categoriesParam) {
      const categoriesArray = categoriesParam.split(',');
      newFilterOptions.categories = new Set(categoriesArray);
    }

    setFilterOptions(newFilterOptions);
  }, [searchParamsUrl]);


  const handleSelectCategory = (event: ChangeEvent<HTMLInputElement>): void => {
    const { value, checked } = event.target;
    const updatedSelectedCategories = new Set(filterOptions.categories);
    if (checked) {
      updatedSelectedCategories.add(value);
    } else {
      updatedSelectedCategories.delete(value);
    }
    setFilterOptions({...filterOptions, categories: updatedSelectedCategories});
  };


  const handleSelectColor = (event: ChangeEvent<HTMLInputElement>): void => {
    const { value, checked } = event.target;
    const updatedSelectedColors = new Set(filterOptions.colors);
    if (checked) {
      updatedSelectedColors.add(value);
    } else {
      updatedSelectedColors.delete(value);
    }
    setFilterOptions({...filterOptions, colors: updatedSelectedColors});
  };

  function updateSearchParams() {
    const params = new URLSearchParams(searchParamsUrl.toString());

    if (filterOptions.colors.size > 0) {
      params.set("colors", Array.from(filterOptions.colors).join(','));
    } else {
      params.delete("colors");
    }

    if(filterOptions.categories.size > 0){
      params.set("categories", Array.from(filterOptions.categories).join(','));
    } else {
      params.delete("categories");
    }
    console.log(params.toString());
    router.push(`${pathname}?${params.toString()}`);
  }

  useEffect(() => {
    updateSearchParams()
  }, [filterOptions])
  

  return (
    <div className={styles.navbarContainer}>
      <div className={styles.navbarActions}>
        {/* <button className={styles.actionsButton} style={activeFilter ? {}:{backgroundColor: '#ffffff', color: '#000000', border: '#000 2px solid'}} onClick={() => (setActiveFilter(!activeFilter), setActiveOption(null))}>
          Filters
          <SlidersHorizontal size={16} />
        </button> */}
        <button className={styles.actionsButton} onClick={() => setAddProductModal(true)}>
          Add
          <Plus size={16}/>
        </button>
      </div>
      {addProductModal && 
        <div className={styles.productModal}>
          <NewProductModal setProductModal={setAddProductModal}/>
        </div>
      }
      {/* {activeFilter && 
        <div className={styles.filtersContainer}>
          <div className={styles.filterContainer}>
            <button className={styles.colorsButton} onClick={() => setActiveOption(activeOption === 'categories' ? null : 'categories')}>
              <p>Category</p>
              <ChevronDown size={16} style={activeOption === 'categories' ? { transform: 'rotate(180deg)' }:{}}/>
            </button>
            {activeOption === 'categories' && 
              <div className={styles.filterDropDown}>
                { categories.map((category, index) => 
                  <label 
                    key={index} 
                    className={styles.filterLabel}
                    style={ filterOptions.categories.has(category.value) ? { backgroundColor: '#222222', color: '#FFFFFF'}:{}}
                  > 
                    {category.label}
                    <input
                      type="checkbox"
                      value={category.value}
                      className={styles.hiddenInput}
                      checked={filterOptions.categories.has(category.value)}
                      onChange={handleSelectCategory}
                    />
                  </label>
                )}
              </div>
            }
          </div>
          <div className={styles.filterContainer}>
            <button className={styles.colorsButton} onClick={() => setActiveOption(activeOption === 'price' ? null : 'price')}>
              <p>Price</p>
              <ChevronDown size={16} style={activeOption === 'price' ? { transform: 'rotate(180deg)' }:{}}/>
            </button>
            {activeOption === 'price' && 
              <div className={styles.filterDropDown}>
                <label 
                  className={styles.filterLabel}
                > 
                  Fom
                  <input type="range" id="volume" name="volume" className={styles.rangeInput} min="0" max="100" step="1" />
                </label>
                <label 
                  className={styles.filterLabel}
                > 
                  To
                  <input type="range" id="volume" name="volume" className={styles.rangeInput} min="0" max="100" step="1" />
                </label>
              </div>
            }
          </div>
          <div className={styles.filterContainer}>
            <button className={styles.colorsButton} onClick={() => setActiveOption(activeOption === 'colors' ? null : 'colors')}>
              <p>Color</p>
              <ChevronDown size={16} style={activeOption === 'colors' ? { transform: 'rotate(180deg)' }:{}}/>
            </button>
            {activeOption === 'colors' && 
              <div className={styles.filterDropDown}>
                { colors.map((color, index) => 
                  <label 
                    key={index} 
                    className={styles.filterLabel}
                    style={ filterOptions.colors.has(color.value) ? { backgroundColor: '#222222', color: '#FFFFFF'}:{}}
                  > 
                    <span className={styles.colorBox} style={{backgroundColor: color.value}}/>
                    {color.label}
                    <input
                      type="checkbox"
                      value={color.value}
                      className={styles.hiddenInput}
                      checked={filterOptions.colors.has(color.value)}
                      onChange={handleSelectColor}
                    />
                  </label>
                )}
              </div>
            }
          </div>
        </div>
      } */}
    </div>
  )
}

export default ProductsNavbar
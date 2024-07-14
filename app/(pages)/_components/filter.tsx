"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

import styles from "./filter.module.css"
import { ChevronDown, Plus, SlidersHorizontal } from "lucide-react";
import { species, colors } from "@/constants";

type FilterOptions = {
  species: Set<string>;
  colors: Set<string>;
}

const Filter = () => {
  const [activeOption, setActiveOption] = useState<string | null>(null)
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    species: new Set<string>(),
    colors: new Set<string>(),
  });

  const router = useRouter();
  const searchParamsUrl = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const speciesParam = searchParamsUrl.get('species');
    const colorsParam = searchParamsUrl.get('colors');
    const newFilterOptions: FilterOptions = { colors: new Set<string>(), species: new Set<string>() };

    if (colorsParam) {
      const colorsArray = colorsParam.split(',');
      newFilterOptions.colors = new Set(colorsArray);
    }

    if (speciesParam) {
      const speciesArray = speciesParam.split(',');
      newFilterOptions.species = new Set(speciesArray);
    }

    setFilterOptions(newFilterOptions);
  }, [searchParamsUrl]);


  const handleSelectCategory = (event: ChangeEvent<HTMLInputElement>): void => {
    const { value, checked } = event.target;
    const updatedSelectedspecies = new Set(filterOptions.species);
    if (checked) {
      updatedSelectedspecies.add(value);
    } else {
      updatedSelectedspecies.delete(value);
    }
    setFilterOptions({...filterOptions, species: updatedSelectedspecies});
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

    if(filterOptions.species.size > 0){
      params.set("species", Array.from(filterOptions.species).join(','));
    } else {
      params.delete("species");
    }
    console.log(params.toString());
    router.push(`${pathname}?${params.toString()}`);
  }

  useEffect(() => {
    updateSearchParams()
  }, [filterOptions])
  

  return (
    <div className={styles.filtersContainer}>
        <div className={styles.filterContainer}>
          <button className={styles.filterButton} onClick={() => setActiveOption(activeOption === 'species' ? null : 'species')}>
              <p>Specie</p>
              <ChevronDown size={16} style={activeOption === 'species' ? { transform: 'rotate(180deg)' }:{}}/>
          </button>
          {activeOption === 'species' && 
            <div className={styles.filterDropDown}>
              { species.map((specie, index) => 
                <label 
                  key={index} 
                  className={styles.filterLabel}
                  style={ filterOptions.species.has(specie.name) ? { backgroundColor: '#222222', color: '#FFFFFF'}:{}}
                > 
                  {specie.name}
                  <input
                    type="checkbox"
                    value={specie.name}
                    className={styles.hiddenInput}
                    checked={filterOptions.species.has(specie.name)}
                    onChange={handleSelectCategory}
                  />
                </label>
              )}
            </div>
          }
        </div>
        {/* <div className={styles.filterContainer}>
          <button className={styles.filterButton} onClick={() => setActiveOption(activeOption === 'breeds' ? null : 'breeds')}>
              <p>Breed</p>
              <ChevronDown size={16} style={activeOption === 'breeds' ? { transform: 'rotate(180deg)' }:{}}/>
          </button>
          {activeOption === 'breeds' && 
            <div className={styles.filterDropDown}>
              { species.${activeOption}.map((specie, index) => 
                <label 
                  key={index} 
                  className={styles.filterLabel}
                  style={ filterOptions.species.has(specie.name) ? { backgroundColor: '#222222', color: '#FFFFFF'}:{}}
                > 
                  {specie.name}
                  <input
                    type="checkbox"
                    value={specie.name}
                    className={styles.hiddenInput}
                    checked={filterOptions.species.has(specie.name)}
                    onChange={handleSelectCategory}
                  />
                </label>
              )}
            </div>
          }
        </div> */}
        <div className={styles.filterContainer}>
          <button className={styles.filterButton} onClick={() => setActiveOption(activeOption === 'price' ? null : 'price')}>
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
          <button className={styles.filterButton} onClick={() => setActiveOption(activeOption === 'colors' ? null : 'colors')}>
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
  )
}

export default Filter
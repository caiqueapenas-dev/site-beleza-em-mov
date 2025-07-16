// src/components/FilterSidebar.jsx
import React from 'react';

function FilterSidebar({
  activeCategory, onCategoryChange,
  availableColors, selectedColor, onColorChange,
  selectedSize, onSizeChange,
  onClearFilters
}) {
  const categories = ['todos', 'top', 'legging', 'shorts', 'camiseta', 'jaqueta'];
  const sizes = ['P', 'M', 'G', 'GG'];

  return (
    <aside className="w-full md:w-1/4 lg:w-1/5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Filtros</h2>
        <button onClick={onClearFilters} className="text-sm text-cyan-600 hover:underline">Limpar Filtros</button>
      </div>
      <div className="space-y-6">
        {/* Filtro de Categoria */}
        <div>
          <h3 className="font-semibold mb-2">Categorias</h3>
          <ul className="space-y-1 text-gray-600">
            {categories.map(category => (
              <li key={category}>
                <button
                  onClick={() => onCategoryChange(category)}
                  className={`capitalize hover:text-cyan-600 ${activeCategory === category ? 'font-bold text-cyan-700' : ''}`}
                >
                  {category === 'todos' ? 'Mostrar Todos' : category}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Filtro de Tamanho */}
        <div>
          <h3 className="font-semibold mb-2">Tamanho</h3>
          <div className="flex flex-wrap gap-2">
            {sizes.map(size => (
              <button
                key={size}
                onClick={() => onSizeChange(size)}
                className={`border rounded-md px-3 py-1 text-sm transition-colors ${selectedSize === size ? 'bg-gray-900 text-white border-gray-900' : 'hover:bg-gray-200'}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Filtro de Cor */}
        <div>
          <h3 className="font-semibold mb-2">Cor</h3>
          <div className="flex flex-wrap gap-2">
            {availableColors.map(color => (
              <button
                key={color.nome}
                onClick={() => onColorChange(color.nome)}
                title={color.nome}
                className={`w-6 h-6 rounded-full border transition-transform hover:scale-110 ${selectedColor === color.nome ? 'ring-2 ring-offset-2 ring-cyan-500' : ''}`}
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default FilterSidebar;
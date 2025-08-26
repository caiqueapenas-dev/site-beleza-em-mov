// src/components/FilterDropdown.jsx
import React, { useState } from 'react';
import { Filter, X } from 'lucide-react';

function FilterDropdown({
  activeCategory,
  onCategoryChange,
  availableCategories = [],
  selectedColor,
  onColorChange,
  availableColors = [],
  selectedSize,
  onSizeChange,
  availableSizes = [],
  onClearFilters,
}) {
  const [isOpen, setIsOpen] = useState(false);

  // função para lidar com a seleção, que aplica o filtro e fecha o menu
  const handleSelect = (setter, value) => {
    setter(value);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      {/* botão principal que abre o dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex justify-center items-center gap-2 w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <Filter size={16} />
        filtrar por preferências
      </button>

      {/* menu dropdown condicional */}
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
          <div className="p-4 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">filtros</h3>
              <button onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {/* filtro de categoria dinâmico */}
            <div>
              <h4 className="font-semibold mb-2 text-sm">categorias</h4>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => handleSelect(onCategoryChange, 'todos')}
                    className={`capitalize text-gray-600 ${
                      activeCategory === 'todos' ? 'font-bold text-cyan-700' : ''
                    }`}
                  >
                    mostrar todos
                  </button>
                </li>
                {availableCategories.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => handleSelect(onCategoryChange, cat)}
                      className={`capitalize text-gray-600 ${
                        activeCategory === cat ? 'font-bold text-cyan-700' : ''
                      }`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* filtro de tamanho dinâmico */}
            <div>
              <h4 className="font-semibold mb-2 text-sm">tamanho</h4>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSelect(onSizeChange, size)}
                    className={`border rounded-md px-3 py-1 text-xs uppercase transition-colors ${
                      selectedSize === size
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'hover:bg-gray-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* filtro de cor dinâmico */}
            <div>
              <h4 className="font-semibold mb-2 text-sm">cor</h4>
              <div className="flex flex-wrap gap-2">
                {availableColors.map((color) => (
                  <button
                    key={color.nome}
                    onClick={() => handleSelect(onColorChange, color.nome)}
                    title={color.nome}
                    className={`w-6 h-6 rounded-full border transition-transform hover:scale-110 ${
                      selectedColor === color.nome
                        ? 'ring-2 ring-offset-2 ring-cyan-500'
                        : ''
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                onClearFilters();
                setIsOpen(false);
              }}
              className="w-full text-center text-sm text-cyan-600 hover:underline pt-2 border-t"
            >
              limpar filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FilterDropdown;
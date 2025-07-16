// src/components/FilterSidebar.jsx
import React from 'react';

// O componente recebe a categoria ativa e uma função para alterá-la (onCategoryChange)
function FilterSidebar({ activeCategory, onCategoryChange }) {
  const categories = ['todos', 'top', 'legging', 'shorts', 'camiseta', 'jaqueta'];

  return (
    <aside className="w-full md:w-1/4 lg:w-1/5">
      <h2 className="text-xl font-bold mb-4">Filtros</h2>
      <div className="space-y-6">
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

        {/* Futuramente adicionaremos os filtros de Tamanho e Cor aqui */}
        <div>
          <h3 className="font-semibold mb-2 text-gray-400">Tamanho</h3>
          <div className="flex flex-wrap gap-2 opacity-50 cursor-not-allowed">
            <button disabled className="border rounded-md px-3 py-1 text-sm">P</button>
            <button disabled className="border rounded-md px-3 py-1 text-sm">M</button>
            <button disabled className="border rounded-md px-3 py-1 text-sm">G</button>
            <button disabled className="border rounded-md px-3 py-1 text-sm">GG</button>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default FilterSidebar;
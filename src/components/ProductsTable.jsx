// src/components/ProductsTable.jsx
import React from 'react';

function ProductsTable({
  products,
  onEdit,
  onDelete,
  adminSearchTerm,
  onAdminSearchChange,
  adminCategory,
  onAdminCategoryChange,
  allCategories,
  onAddNew,
}) {
  const filteredProducts = products
    .filter((p) => adminCategory === 'todos' || p.categoria === adminCategory)
    .filter((p) =>
      p.name.toLowerCase().includes(adminSearchTerm.toLowerCase()),
    );

  const formatStock = (stockObject) => {
    if (!stockObject) return 'N/A';
    return Object.entries(stockObject)
      .map(([size, quantity]) => `${size.toUpperCase()}: ${quantity}`)
      .join(' | ');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
        <h2 className="text-2xl font-semibold">Produtos Cadastrados</h2>
        <button
          onClick={onAddNew}
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg whitespace-nowrap"
        >
          Adicionar Novo
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
        <input
          type="text"
          placeholder="Buscar por nome do produto..."
          value={adminSearchTerm}
          onChange={onAdminSearchChange}
          className="w-full md:w-1/3 p-2 border rounded-md"
        />
        <select
          value={adminCategory}
          onChange={onAdminCategoryChange}
          className="w-full md:w-auto p-2 border rounded-md bg-white"
        >
          <option value="todos">Todas as Categorias</option>
          {allCategories.map((cat) => (
            <option key={cat} value={cat} className="capitalize">
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 font-semibold">Produto</th>
              <th className="p-3 font-semibold">Categoria</th>
              <th className="p-3 font-semibold">Preço</th>
              <th className="p-3 font-semibold">Estoque</th>
              <th className="p-3 font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{product.name}</td>
                <td className="p-3 capitalize">{product.categoria}</td>
                <td className="p-3">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(product.price)}
                  {product.desconto_percentual > 0 && (
                    <span className="ml-2 text-xs bg-red-200 text-red-800 font-bold px-2 py-1 rounded-full">
                      -{product.desconto_percentual}%
                    </span>
                  )}
                </td>
                <td className="p-3 whitespace-nowrap">
                  {formatStock(product.estoque)}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => onEdit(product)}
                    className="text-blue-600 hover:underline mr-4"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(product.id)}
                    className="text-red-600 hover:underline"
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductsTable;

// src/components/ProductForm.jsx
import React, { useState } from 'react';

function ProductForm({ onSubmit, onCancel, initialData = {} }) {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    categoria: initialData.categoria || 'top',
    price: initialData.price || 0,
    image: initialData.image || '',
    material: initialData.material || '',
    avaliacao: initialData.avaliacao || 0,
    estoque: initialData.estoque || { P: 0, M: 0, G: 0, GG: 0 },
    palavras_chave: initialData.palavras_chave || ''
  });

  const [newSizeName, setNewSizeName] = useState('');
  const [newSizeQty, setNewSizeQty] = useState(0);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleStockChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      estoque: {
        ...prev.estoque,
        [name]: parseInt(value, 10) || 0,
      },
    }));
  };

  const handleAddCustomSize = () => {
    const sizeKey = newSizeName.trim().toUpperCase();
    if (!sizeKey) return;

    setFormData((prev) => ({
      ...prev,
      estoque: {
        ...prev.estoque,
        [sizeKey]: newSizeQty,
      },
    }));

    setNewSizeName('');
    setNewSizeQty(0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nome e Categoria */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Nome do Produto"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <div>
          <label className="block text-sm font-medium">Categoria</label>
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md"
          >
            {['top', 'legging', 'shorts', 'camiseta', 'jaqueta'].map((cat) => (
              <option key={cat} value={cat}>
                {cat[0].toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Preço e Avaliação */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Preço (R$)"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          step="0.01"
          required
        />
        <FormField
          label="Avaliação (0 a 5)"
          name="avaliacao"
          type="number"
          value={formData.avaliacao}
          onChange={handleChange}
          step="0.1"
          max="5"
          required
        />
      </div>

      {/* URL da Imagem */}
      <FormField
        label="URL da Imagem"
        name="image"
        type="text"
        value={formData.image}
        onChange={handleChange}
        required
      />

      {/* Material */}
      <FormField
        label="Material"
        name="material"
        type="text"
        value={formData.material}
        onChange={handleChange}
      />

      {/* Palavras-chave */}
      <FormField
        label="Palavras-chave (separadas por vírgula)"
        name="palavras_chave"
        type="text"
        value={formData.palavras_chave}
        onChange={handleChange}
      />

      {/* Estoque */}
      <div>
        <label className="block text-sm font-medium">Estoque</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-1">
          {Object.keys(formData.estoque).map((size) => (
            <div key={size}>
              <label className="block text-xs font-medium text-gray-500">
                {size}
              </label>
              <input
                type="number"
                name={size}
                value={formData.estoque[size]}
                onChange={handleStockChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 ADICIONE TODO ESTE BLOCO */}
      <div className="mt-4 space-y-2">
        <label className="block text-sm font-medium">
          Adicionar Tamanho Personalizado
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newSizeName}
            onChange={(e) => setNewSizeName(e.target.value)}
            placeholder="Ex: XG, 38"
            className="w-full p-2 border rounded-md"
          />
          <input
            type="number"
            value={newSizeQty}
            onChange={(e) => setNewSizeQty(parseInt(e.target.value, 10))}
            placeholder="Qtd"
            className="w-24 p-2 border rounded-md"
          />
          <button
            type="button"
            onClick={handleAddCustomSize}
            className="px-3 py-2 bg-green-600 text-white rounded-md"
          >
            Adicionar
          </button>
        </div>
      </div>

      {/* Botões */}
      <div className="flex justify-end pt-4 gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-cyan-600 text-white rounded-md"
        >
          Salvar Produto
        </button>
      </div>
    </form>
  );
}

// 🔥 Componente reutilizável para campos de formulário
function FormField({ label, name, type, value, onChange, ...rest }) {
  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full mt-1 p-2 border rounded-md"
        {...rest}
      />
    </div>
  );
}

export default ProductForm;

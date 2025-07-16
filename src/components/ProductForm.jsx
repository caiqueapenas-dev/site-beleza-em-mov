// src/components/ProductForm.jsx
import React, { useState } from 'react';

// O formulário recebe uma função 'onSubmit' e os dados iniciais (para edição futura)
function ProductForm({ onSubmit, initialData = {} }) {
  // O estado do formulário é inicializado com os dados iniciais ou campos vazios
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    categoria: initialData.categoria || 'top',
    price: initialData.price || 0,
    image: initialData.image || '',
    material: initialData.material || '',
    avaliacao: initialData.avaliacao || 0,
    estoque: {
      P: initialData.estoque?.P || 0,
      M: initialData.estoque?.M || 0,
      G: initialData.estoque?.G || 0,
      GG: initialData.estoque?.GG || 0,
    },
    palavras_chave: initialData.palavras_chave || ''
  });

  // Função para lidar com mudanças nos inputs normais
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  // Função para lidar com mudanças nos inputs de estoque
  const handleStockChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      estoque: {
        ...prev.estoque,
        [name]: parseInt(value, 10) || 0,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Envia os dados do formulário para a função pai
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Nome do Produto</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full mt-1 p-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium">Categoria</label>
          <select name="categoria" value={formData.categoria} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md">
            <option value="top">Top</option>
            <option value="legging">Legging</option>
            <option value="shorts">Shorts</option>
            <option value="camiseta">Camiseta</option>
            <option value="jaqueta">Jaqueta</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Preço (R$)</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} step="0.01" required className="w-full mt-1 p-2 border rounded-md" />
        </div>
         <div>
          <label className="block text-sm font-medium">Avaliação (0 a 5)</label>
          <input type="number" name="avaliacao" value={formData.avaliacao} onChange={handleChange} step="0.1" max="5" required className="w-full mt-1 p-2 border rounded-md" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">URL da Imagem</label>
        <input type="text" name="image" value={formData.image} onChange={handleChange} required className="w-full mt-1 p-2 border rounded-md" />
      </div>
       <div>
        <label className="block text-sm font-medium">Material</label>
        <input type="text" name="material" value={formData.material} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" />
      </div>
      <div>
        <label className="block text-sm font-medium">Palavras-chave (separadas por vírgula)</label>
        <input type="text" name="palavras_chave" value={formData.palavras_chave} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md" />
      </div>
      <div>
        <label className="block text-sm font-medium">Estoque</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1">
          <input type="number" name="P" value={formData.estoque.P} onChange={handleStockChange} placeholder="P" className="w-full p-2 border rounded-md" />
          <input type="number" name="M" value={formData.estoque.M} onChange={handleStockChange} placeholder="M" className="w-full p-2 border rounded-md" />
          <input type="number" name="G" value={formData.estoque.G} onChange={handleStockChange} placeholder="G" className="w-full p-2 border rounded-md" />
          <input type="number" name="GG" value={formData.estoque.GG} onChange={handleStockChange} placeholder="GG" className="w-full p-2 border rounded-md" />
        </div>
      </div>
      <div className="flex justify-end pt-4">
        <button type="button" onClick={onSubmit} className="px-4 py-2 mr-2 bg-gray-200 rounded-md">Cancelar</button>
        <button type="submit" className="px-4 py-2 bg-cyan-600 text-white rounded-md">Salvar Produto</button>
      </div>
    </form>
  );
}

export default ProductForm;
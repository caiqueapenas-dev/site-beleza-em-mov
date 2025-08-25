// src/components/ProductForm.jsx
import React, { useState } from 'react';
import CustomCurrencyInput from './CustomCurrencyInput';

function ProductForm({
  onSubmit,
  onCancel,
  initialData = {},
  allNames = [],
  allMaterials = [],
  allKeywords = [],
  allCategories = [],
}) {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    categoria: initialData.categoria || 'top',
    price: (initialData.price || 0) * 100,
    desconto_percentual: initialData.desconto_percentual || 0,
    image: initialData.image || '',
    material: initialData.material || '',
    avaliacao: initialData.avaliacao || 0,
    description: initialData.description || '',
    estoque: initialData.estoque || { p: 0, m: 0, g: 0, gg: 0 },
    palavras_chave: initialData.palavras_chave || '',
  });

  const [isUploading, setIsUploading] = useState(false);
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formDataApi = new FormData();
    formDataApi.append('file', file);
    formDataApi.append('upload_preset', 'beleza-em-mov-unsigned'); // seu upload preset

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dnescubo4/image/upload`, // seu cloud name
        {
          method: 'post',
          body: formDataApi,
        },
      );
      const data = await response.json();
      setFormData((prev) => ({ ...prev, image: data.secure_url }));
    } catch (error) {
      console.error('erro ao enviar imagem:', error);
    } finally {
      setIsUploading(false);
    }
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
    const dataToSubmit = {
      ...formData,
      price: formData.price / 100,
    };
    onSubmit(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* nome e categoria */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="nome do produto"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
          list="product-names"
          suggestions={allNames}
        />
        <FormField
          label="categoria"
          name="categoria"
          type="text"
          value={formData.categoria}
          onChange={handleChange}
          required
          list="product-categories"
          suggestions={allCategories}
        />
      </div>

      {/* preço e avaliação */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">preço (r$)</label>
          <CustomCurrencyInput
            valueInCents={formData.price}
            onValueChange={(newCents) => {
              setFormData((prev) => ({ ...prev, price: newCents }));
            }}
          />
        </div>
        <FormField
          label="avaliação (0 a 5)"
          name="avaliacao"
          type="number"
          value={formData.avaliacao}
          onChange={handleChange}
          step="0.1"
          max="5"
          required
        />
      </div>

      <FormField
        label="desconto do produto (%)"
        name="desconto_percentual"
        type="number"
        value={formData.desconto_percentual}
        onChange={handleChange}
        min="0"
        max="100"
        placeholder="ex: 15 para 15% de desconto"
      />

      {/* --- NOVO CAMPO DE UPLOAD DE IMAGEM --- */}
      <div>
        <label className="block text-sm font-medium">imagem do produto</label>
        <div className="mt-1 flex items-center gap-4">
          {formData.image && (
            <img
              src={formData.image}
              alt="pré-visualização"
              className="w-20 h-20 rounded-md object-cover"
            />
          )}
          <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50">
            <span>{isUploading ? 'enviando...' : 'escolher arquivo'}</span>
            <input
              type="file"
              onChange={handleImageUpload}
              className="sr-only"
              disabled={isUploading}
            />
          </label>
          {!formData.image && !isUploading && (
            <span className="text-sm text-gray-500">
              nenhuma imagem selecionada.
            </span>
          )}
        </div>
      </div>
      {/* --- FIM DO NOVO CAMPO --- */}

      <FormField
        label="descrição do produto"
        name="description"
        as="textarea"
        value={formData.description}
        onChange={handleChange}
        rows="4"
      />

      {/* material */}
      <FormField
        label="material"
        name="material"
        type="text"
        value={formData.material}
        onChange={handleChange}
        list="product-materials"
        suggestions={allMaterials}
      />

      {/* palavras-chave */}
      <FormField
        label="palavras-chave (separadas por vírgula)"
        name="palavras_chave"
        type="text"
        value={formData.palavras_chave}
        onChange={handleChange}
        list="product-keywords"
        suggestions={allKeywords}
      />

      {/* estoque */}
      <div>
        <label className="block text-sm font-medium">estoque</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-1">
          {Object.keys(formData.estoque).map((size) => (
            <div key={size}>
              <label className="block text-xs font-medium text-gray-500">
                {size.toUpperCase()}
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

      <div className="mt-4 space-y-2">
        <label className="block text-sm font-medium">
          adicionar tamanho personalizado
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newSizeName}
            onChange={(e) => setNewSizeName(e.target.value)}
            placeholder="ex: xg, 38"
            className="w-full p-2 border rounded-md"
          />
          <input
            type="number"
            value={newSizeQty}
            onChange={(e) =>
              setNewSizeQty(parseInt(e.target.value, 10) || 0)
            }
            placeholder="qtd"
            className="w-24 p-2 border rounded-md"
          />
          <button
            type="button"
            onClick={handleAddCustomSize}
            className="px-3 py-2 bg-green-600 text-white rounded-md"
          >
            adicionar
          </button>
        </div>
      </div>

      {/* botões */}
      <div className="flex justify-end pt-4 gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
        >
          cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-cyan-600 text-white rounded-md"
        >
          salvar produto
        </button>
      </div>
    </form>
  );
}

// componente reutilizável para campos de formulário
function FormField({ label, name, as = 'input', ...rest }) {
  const Component = as;
  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <Component
        name={name}
        className="w-full mt-1 p-2 border rounded-md"
        {...rest}
      />
    </div>
  );
}

export default ProductForm;
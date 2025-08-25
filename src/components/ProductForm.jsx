// src/components/ProductForm.jsx
import React, { useState } from 'react';
import { Trash2, X } from 'lucide-react';
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
    images: initialData.images || [], // alterado de image para images
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
    const files = e.target.files;
    if (!files.length) return;

    setIsUploading(true);
    const uploadedUrls = [];
    
    for (const file of files) {
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
        uploadedUrls.push(data.secure_url);
      } catch (error) {
        console.error('erro ao enviar imagem:', error);
      }
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...uploadedUrls],
    }));
    setIsUploading(false);
  };
  
  const handleRemoveImage = (urlToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(url => url !== urlToRemove)
    }))
  }

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
        />
        <FormField
          label="categoria"
          name="categoria"
          type="text"
          value={formData.categoria}
          onChange={handleChange}
          required
        />
      </div>

      {/* preço e avaliação */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">preço (r$)</label>
          <CustomCurrencyInput
            valueInCents={formData.price}
            onValueChange={(cents) =>
              setFormData((prev) => ({ ...prev, price: cents }))
            }
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
      />

      {/* upload de imagens */}
      <div>
        <label className="block text-sm font-medium">imagens do produto</label>
        <div className="mt-1 flex flex-wrap gap-4 items-center">
          {formData.images.map((url) => (
            <div key={url} className="relative">
              <img
                src={url}
                alt="pré-visualização"
                className="w-20 h-20 rounded-md object-cover"
              />
              <button 
                type="button" 
                onClick={() => handleRemoveImage(url)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
              >
                <X size={14}/>
              </button>
            </div>
          ))}
          <label className="w-20 h-20 flex items-center justify-center border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50">
            <span className="text-gray-500">{isUploading ? '...' : '+'}</span>
            <input
              type="file"
              onChange={handleImageUpload}
              className="sr-only"
              multiple // permite selecionar múltiplos arquivos
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      <FormField
        label="descrição do produto"
        name="description"
        as="textarea"
        value={formData.description}
        onChange={handleChange}
        rows="4"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="material"
          name="material"
          type="text"
          value={formData.material}
          onChange={handleChange}
        />
        <FormField
          label="palavras-chave (separadas por vírgula)"
          name="palavras_chave"
          type="text"
          value={formData.palavras_chave}
          onChange={handleChange}
        />
      </div>

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
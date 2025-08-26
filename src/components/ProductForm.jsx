// src/components/ProductForm.jsx
import React, { useState, useMemo } from 'react';
import { X, PlusCircle } from 'lucide-react';
import CustomCurrencyInput from './CustomCurrencyInput';

// componente para os seletores de tags/botões
const TagSelector = ({
  label,
  options,
  selected,
  onSelect,
  onAddNew,
}) => {
  const [showInput, setShowInput] = useState(false);
  const [newValue, setNewValue] = useState('');

  const handleAddNew = () => {
    if (newValue.trim()) {
      onAddNew(newValue.trim());
      setNewValue('');
      setShowInput(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            type="button"
            key={option}
            onClick={() => onSelect(option)}
            className={`px-3 py-1 text-sm border rounded-full transition-colors ${
              selected === option
                ? 'bg-cyan-600 text-white border-cyan-600'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {option}
          </button>
        ))}
        {!showInput && (
          <button
            type="button"
            onClick={() => setShowInput(true)}
            className="flex items-center gap-1 px-3 py-1 text-sm text-cyan-600 hover:bg-cyan-50 rounded-full"
          >
            <PlusCircle size={16} /> novo
          </button>
        )}
      </div>
      {showInput && (
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder={`nova ${label.toLowerCase()}`}
          />
          <button
            type="button"
            onClick={handleAddNew}
            className="px-4 bg-green-600 text-white rounded-md"
          >
            add
          </button>
          <button
            type="button"
            onClick={() => setShowInput(false)}
            className="px-4 bg-gray-300 rounded-md"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

// componente para as palavras-chave
const KeywordManager = ({
  options,
  selectedKeywords,
  onToggleKeyword,
  onAddKeyword,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);

  const filteredOptions = useMemo(
    () =>
      options.filter((kw) =>
        kw.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [options, searchTerm],
  );

  const displayedOptions = showAll
    ? filteredOptions
    : filteredOptions.slice(0, 10);

  const handleAdd = () => {
    if (searchTerm.trim() && !selectedKeywords.includes(searchTerm.trim())) {
      onAddKeyword(searchTerm.trim());
    }
    setSearchTerm('');
  };

  return (
    <div>
      <label className="block text-sm font-medium">palavras-chave</label>
      <div className="p-2 border rounded-md mt-1">
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedKeywords.map((kw) => (
            <span
              key={kw}
              className="flex items-center gap-1 bg-cyan-100 text-cyan-800 text-xs font-semibold px-2 py-1 rounded-full"
            >
              {kw}
              <button type="button" onClick={() => onToggleKeyword(kw)}>
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="buscar ou adicionar nova palavra-chave..."
            className="w-full p-2 border-t"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="px-4 bg-green-600 text-white rounded-md"
          >
            add
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-1 mt-2">
        {displayedOptions.map((kw) => (
          <button
            type="button"
            key={kw}
            onClick={() => onToggleKeyword(kw)}
            className={`px-2 py-0.5 text-xs rounded-full ${
              selectedKeywords.includes(kw)
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-200'
            }`}
          >
            {kw}
          </button>
        ))}
      </div>
      {filteredOptions.length > 10 && (
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-cyan-600 mt-2"
        >
          {showAll ? 'ver menos' : `ver mais ${filteredOptions.length - 10}...`}
        </button>
      )}
    </div>
  );
};

function ProductForm({
  onSubmit,
  onCancel,
  initialData,
  allCategories = [],
  allMaterials = [],
  allKeywords = [],
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    categoria: initialData?.categoria || '',
    price: (initialData?.price || 0) * 100,
    desconto_percentual: initialData?.desconto_percentual || 0,
    images: initialData?.images || [],
    material: initialData?.material || '',
    avaliacao: initialData?.avaliacao ?? 4.5,
    description: initialData?.description || '',
    estoque: initialData?.estoque || { p: 0, m: 0, g: 0, gg: 0 },
    palavras_chave: initialData?.palavras_chave || '',
  });

  const [dynamicOptions, setDynamicOptions] = useState({
    categories: allCategories,
    materials: allMaterials,
    keywords: allKeywords,
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStockChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      estoque: { ...prev.estoque, [name]: parseInt(value, 10) || 0 },
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
      formDataApi.append('upload_preset', 'beleza-em-mov-unsigned');
      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/dnescubo4/image/upload`,
          { method: 'post', body: formDataApi },
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
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((url) => url !== urlToRemove),
    }));
  };

  const handleAddNewOption = (field, value) => {
    setDynamicOptions((prev) => ({
      ...prev,
      [field]: [...prev[field], value].sort(),
    }));
    setFormData((prev) => ({ ...prev, [field.slice(0, -1)]: value }));
  };

  const handleKeywordToggle = (keyword) => {
    const currentKeywords = formData.palavras_chave
      ? formData.palavras_chave.split(',').map((k) => k.trim())
      : [];
    const newKeywords = currentKeywords.includes(keyword)
      ? currentKeywords.filter((k) => k !== keyword)
      : [...currentKeywords, keyword];
    setFormData((prev) => ({
      ...prev,
      palavras_chave: newKeywords.join(', '),
    }));
  };

  const handleKeywordAdd = (keyword) => {
    if (!dynamicOptions.keywords.includes(keyword)) {
      setDynamicOptions((prev) => ({
        ...prev,
        keywords: [...prev.keywords, keyword].sort(),
      }));
    }
    handleKeywordToggle(keyword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, price: formData.price / 100 });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* nome, preço, desconto, avaliação */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">nome do produto</label>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">preço (r$)</label>
          <CustomCurrencyInput
            valueInCents={formData.price}
            onValueChange={(cents) =>
              setFormData((prev) => ({ ...prev, price: cents }))
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium">
            desconto do produto (%)
          </label>
          <input
            name="desconto_percentual"
            type="number"
            value={formData.desconto_percentual}
            onChange={handleChange}
            min="0"
            max="100"
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">avaliação (0 a 5)</label>
          <input
            name="avaliacao"
            type="number"
            value={formData.avaliacao}
            onChange={handleChange}
            step="0.1"
            max="5"
            required
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>
      </div>

      {/* categoria e material */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TagSelector
          label="categoria"
          options={dynamicOptions.categories}
          selected={formData.categoria}
          onSelect={(val) => setFormData({ ...formData, categoria: val })}
          onAddNew={(val) => handleAddNewOption('categories', val)}
        />
        <TagSelector
          label="material"
          options={dynamicOptions.materials}
          selected={formData.material}
          onSelect={(val) => setFormData({ ...formData, material: val })}
          onAddNew={(val) => handleAddNewOption('materials', val)}
        />
      </div>

      {/* palavras-chave */}
      <KeywordManager
        options={dynamicOptions.keywords}
        selectedKeywords={
          formData.palavras_chave
            ? formData.palavras_chave.split(',').map((k) => k.trim())
            : []
        }
        onToggleKeyword={handleKeywordToggle}
        onAddKeyword={handleKeywordAdd}
      />

      {/* descrição */}
      <div>
        <label className="block text-sm font-medium">descrição</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          className="w-full mt-1 p-2 border rounded-md"
        />
      </div>

      {/* imagens */}
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
                <X size={14} />
              </button>
            </div>
          ))}
          <label className="w-20 h-20 flex items-center justify-center border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50">
            <span className="text-gray-500">{isUploading ? '...' : '+'}</span>
            <input
              type="file"
              onChange={handleImageUpload}
              className="sr-only"
              multiple
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      {/* estoque */}
      <div>
        <label className="block text-sm font-medium">estoque</label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-1">
          {Object.keys(formData.estoque)
            .sort()
            .map((size) => (
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

export default ProductForm;
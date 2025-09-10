// src/components/PromotionSettings.jsx
import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

function PromotionSettings({ promoSettings, onSave, showNotification }) {
  const [settings, setSettings] = useState(promoSettings || {
    banner: {
      isActive: false,
      text: '',
      textColor: '#ffffff',
      backgroundColor: '#000000',
    },
    coupons: [],
  });
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountPercent: '',
    isActive: true,
  });

  // Atualiza o estado local quando promoSettings muda
  useEffect(() => {
    if (promoSettings) {
      setSettings(promoSettings);
    }
  }, [promoSettings]);

  const handleBannerChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      banner: {
        ...prev.banner,
        [name]: type === 'checkbox' ? checked : value,
      },
    }));
  };

  const handleCouponChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const updatedCoupons = [...settings.coupons];
    updatedCoupons[index] = {
      ...updatedCoupons[index],
      [name]: type === 'checkbox' ? checked : value,
    };
    setSettings((prev) => ({ ...prev, coupons: updatedCoupons }));
  };

  const handleNewCouponChange = (e) => {
    const { name, value } = e.target;
    setNewCoupon((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCoupon = () => {
    if (!newCoupon.code || !newCoupon.discountPercent) {
      showNotification('Preencha o código e o percentual do cupom.', 'error');
      return;
    }
    const newCouponData = {
      ...newCoupon,
      id: Date.now().toString(),
      discountPercent: Number(newCoupon.discountPercent),
    };
    setSettings((prev) => ({
      ...prev,
      coupons: [...prev.coupons, newCouponData],
    }));
    setNewCoupon({ code: '', discountPercent: '', isActive: true });
    showNotification('Cupom adicionado com sucesso!', 'success');
  };

  const handleDeleteCoupon = (id) => {
    if (window.confirm('Tem certeza que deseja remover este cupom?')) {
      setSettings((prev) => ({
        ...prev,
        coupons: prev.coupons.filter((c) => c.id !== id),
      }));
      showNotification('Cupom removido!', 'success');
    }
  };

  const handleSaveChanges = () => {
    // Garante que o banner tenha todos os campos necessários
    const settingsToSave = {
      ...settings,
      banner: {
        isActive: settings.banner?.isActive || false,
        text: settings.banner?.text || '',
        textColor: settings.banner?.textColor || '#ffffff',
        backgroundColor: settings.banner?.backgroundColor || '#000000',
      },
      coupons: settings.coupons || [],
    };
    
    onSave(settingsToSave);
    showNotification('Configurações de promoção salvas!', 'success');
  };

  return (
    <div className="space-y-8">
      {/* Gerenciador de Banner */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Banner de Promoção</h3>
        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isActive"
              checked={settings.banner.isActive}
              onChange={handleBannerChange}
              className="h-5 w-5 rounded"
            />
            <span>Ativar banner de promoção no topo do site?</span>
          </label>

          {settings.banner.isActive && (
            <div className="animate-fade-in space-y-4">
              <div>
                <label className="block text-sm font-medium">
                  Texto do Banner
                </label>
                <input
                  type="text"
                  name="text"
                  value={settings.banner.text}
                  onChange={handleBannerChange}
                  className="w-full mt-1 p-2 border rounded-md"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">
                    Cor do Texto
                  </label>
                  <input
                    type="color"
                    name="textColor"
                    value={settings.banner.textColor}
                    onChange={handleBannerChange}
                    className="w-full mt-1 h-10 p-1 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Cor de Fundo
                  </label>
                  <input
                    type="color"
                    name="backgroundColor"
                    value={settings.banner.backgroundColor}
                    onChange={handleBannerChange}
                    className="w-full mt-1 h-10 p-1 border rounded-md"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Gerenciador de Cupons */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Cupons de Desconto</h3>
        {/* Adicionar novo cupom */}
        <div className="flex flex-col md:flex-row gap-2 p-3 bg-gray-50 rounded-md border mb-4">
          <input
            type="text"
            name="code"
            value={newCoupon.code}
            onChange={handleNewCouponChange}
            placeholder="Código (ex: PROMO15)"
            className="p-2 border rounded-md flex-grow"
          />
          <input
            type="number"
            name="discountPercent"
            value={newCoupon.discountPercent}
            onChange={handleNewCouponChange}
            placeholder="% de Desconto"
            className="p-2 border rounded-md w-full md:w-48"
          />
          <button
            onClick={handleAddCoupon}
            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
          >
            Adicionar Cupom
          </button>
        </div>

        {/* Lista de cupons existentes */}
        <div className="space-y-2">
          {settings.coupons.map((coupon, index) => (
            <div
              key={coupon.id}
              className="grid grid-cols-12 gap-2 items-center p-2 rounded-md hover:bg-gray-50"
            >
              <div className="col-span-5">
                {' '}
                <input
                  type="text"
                  name="code"
                  value={coupon.code}
                  onChange={(e) => handleCouponChange(index, e)}
                  className="w-full p-1 border rounded-md"
                />
              </div>
              <div className="col-span-3">
                {' '}
                <input
                  type="number"
                  name="discountPercent"
                  value={coupon.discountPercent}
                  onChange={(e) => handleCouponChange(index, e)}
                  className="w-full p-1 border rounded-md"
                />
              </div>
              <div className="col-span-3 flex items-center justify-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={coupon.isActive}
                  onChange={(e) => handleCouponChange(index, e)}
                  className="h-5 w-5"
                />
              </div>
              <div className="col-span-1">
                <button
                  onClick={() => handleDeleteCoupon(coupon.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {settings.coupons.length > 0 && (
            <div className="grid grid-cols-12 gap-2 text-xs font-bold text-gray-500 px-2">
              <div className="col-span-5">Código</div>
              <div className="col-span-3">Desconto (%)</div>
              <div className="col-span-3 text-center">Ativo</div>
              <div className="col-span-1"></div>
            </div>
          )}
        </div>
      </div>

      {/* Botão de Salvar */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveChanges}
          className="px-8 py-3 bg-cyan-600 text-white font-bold rounded-lg hover:bg-cyan-700 transition-colors"
        >
          Salvar Alterações
        </button>
      </div>
    </div>
  );
}

export default PromotionSettings;

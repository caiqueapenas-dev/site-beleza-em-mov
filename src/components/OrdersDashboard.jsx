// src/components/OrdersDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import CustomCurrencyInput from './CustomCurrencyInput';

function OrdersDashboard({ allProducts }) {
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem('manualOrders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newOrder, setNewOrder] = useState({
    id: null,
    customerName: '',
    items: [{ productId: '', size: '', quantity: 1 }],
    total: 0,
    status: 'pago',
    date: new Date().toISOString().split('t')[0],
  });

  useEffect(() => {
    localStorage.setItem('manualOrders', JSON.stringify(orders));
  }, [orders]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrder((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const items = [...newOrder.items];
    items[index][name] = value;

    // se o produto mudar, reseta o tamanho
    if (name === 'productId') {
      items[index].size = '';
    }
    setNewOrder((prev) => ({ ...prev, items }));
  };

  const handleAddItem = () => {
    setNewOrder((prev) => ({
      ...prev,
      items: [...prev.items, { productId: '', size: '', quantity: 1 }],
    }));
  };

  const handleRemoveItem = (index) => {
    const items = newOrder.items.filter((_, i) => i !== index);
    setNewOrder((prev) => ({ ...prev, items }));
  };

  const calculateTotal = () => {
    return newOrder.items.reduce((sum, item) => {
      const product = allProducts.find((p) => p._id === item.productId);
      if (!product) return sum;
      return sum + product.price * item.quantity;
    }, 0);
  };

  useEffect(() => {
    const totalInCents = calculateTotal() * 100;
    setNewOrder((prev) => ({ ...prev, total: totalInCents }));
  }, [newOrder.items, allProducts]);

  const resetForm = () => {
    setIsFormVisible(false);
    setNewOrder({
      id: null,
      customerName: '',
      items: [{ productId: '', size: '', quantity: 1 }],
      total: 0,
      status: 'pago',
      date: new Date().toISOString().split('t')[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setOrders((prev) => [...prev, { ...newOrder, id: Date.now() }]);
    resetForm();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">pedidos registrados</h2>
        {!isFormVisible && (
          <button
            onClick={() => setIsFormVisible(true)}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            registrar novo pedido
          </button>
        )}
      </div>

      {isFormVisible && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-4 bg-gray-50 rounded-lg border space-y-4"
        >
          <h3 className="text-lg font-semibold">novo registro de venda</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              name="customerName"
              value={newOrder.customerName}
              onChange={handleInputChange}
              placeholder="nome do cliente"
              className="w-full p-2 border rounded-md"
              required
            />
            <input
              name="date"
              type="date"
              value={newOrder.date}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
              required
            />
            <select
              name="status"
              value={newOrder.status}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md bg-white"
            >
              <option value="pago">pago</option>
              <option value="pendente">pendente</option>
              <option value="cancelado">cancelado</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="font-medium">itens do pedido</label>
            {newOrder.items.map((item, index) => {
              const selectedProduct = allProducts.find(
                (p) => p._id === item.productId,
              );
              return (
                <div key={index} className="flex items-center gap-2">
                  <select
                    name="productId"
                    value={item.productId}
                    onChange={(e) => handleItemChange(index, e)}
                    className="w-full p-2 border rounded-md bg-white flex-grow"
                  >
                    <option value="">selecione um produto</option>
                    {allProducts.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <select
                    name="size"
                    value={item.size}
                    onChange={(e) => handleItemChange(index, e)}
                    className="w-24 p-2 border rounded-md bg-white"
                    disabled={!selectedProduct}
                  >
                    <option value="">tamanho</option>
                    {selectedProduct &&
                      Object.keys(selectedProduct.estoque).map((s) => (
                        <option key={s} value={s}>
                          {s.toUpperCase()}
                        </option>
                      ))}
                  </select>
                  <input
                    name="quantity"
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, e)}
                    className="w-20 p-2 border rounded-md"
                    min="1"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
            <button
              type="button"
              onClick={handleAddItem}
              className="text-sm text-cyan-600 font-semibold hover:underline"
            >
              + adicionar item
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium">valor total (r$)</label>
            <CustomCurrencyInput
              valueInCents={newOrder.total}
              onValueChange={(cents) =>
                setNewOrder((prev) => ({ ...prev, total: cents }))
              }
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
            >
              cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md"
            >
              salvar pedido
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        {orders.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            nenhum pedido registrado ainda.
          </p>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 font-semibold">data</th>
                <th className="p-3 font-semibold">cliente</th>
                <th className="p-3 font-semibold">itens</th>
                <th className="p-3 font-semibold">total</th>
                <th className="p-3 font-semibold">status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="p-3">
                    {new Date(order.date).toLocaleDateString('pt-br', {
                      timeZone: 'utc',
                    })}
                  </td>
                  <td className="p-3">{order.customerName}</td>
                  <td className="p-3 text-sm">
                    {order.items
                      .map((item) => {
                        const product = allProducts.find(
                          (p) => p._id === item.productId,
                        );
                        return `${item.quantity}x ${
                          product?.name || 'produto removido'
                        } (${item.size.toUpperCase()})`;
                      })
                      .join(', ')}
                  </td>
                  <td className="p-3 font-medium">
                    {new Intl.NumberFormat('pt-br', {
                      style: 'currency',
                      currency: 'brl',
                    }).format(order.total / 100)}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === 'pago'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'pendente'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default OrdersDashboard;
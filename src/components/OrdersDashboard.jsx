// src/components/OrdersDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import CustomCurrencyInput from './CustomCurrencyInput';

function OrdersDashboard({ allProducts }) {
  // Estado para os pedidos, carregando do localStorage
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
    date: new Date().toISOString().split('T')[0],
  });

  // Salva os pedidos no localStorage sempre que eles mudam
  useEffect(() => {
    localStorage.setItem('manualOrders', JSON.stringify(orders));
  }, [orders]);

  // Manipula mudanças nos inputs do formulário principal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrder((prev) => ({ ...prev, [name]: value }));
  };

  // Manipula mudanças nos itens do pedido (produto, tamanho, quantidade)
  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const items = [...newOrder.items];
    items[index][name] = value;

    if (name === 'productId') {
      items[index].size = ''; // Reseta o tamanho se o produto mudar
    }
    setNewOrder((prev) => ({ ...prev, items }));
  };

  // Adiciona um novo campo de item ao pedido
  const handleAddItem = () => {
    setNewOrder((prev) => ({
      ...prev,
      items: [...prev.items, { productId: '', size: '', quantity: 1 }],
    }));
  };

  // Remove um item do pedido
  const handleRemoveItem = (index) => {
    const items = newOrder.items.filter((_, i) => i !== index);
    setNewOrder((prev) => ({ ...prev, items }));
  };

  // Calcula o valor total do pedido com base nos itens
  useEffect(() => {
    const total = newOrder.items.reduce((sum, item) => {
      const product = allProducts.find((p) => p._id === item.productId);
      if (!product) return sum;
      return sum + product.price * item.quantity;
    }, 0);
    setNewOrder((prev) => ({ ...prev, total: total * 100 }));
  }, [newOrder.items, allProducts]);

  // Reseta o formulário para o estado inicial
  const resetForm = () => {
    setIsFormVisible(false);
    setNewOrder({
      id: null,
      customerName: '',
      items: [{ productId: '', size: '', quantity: 1 }],
      total: 0,
      status: 'pago',
      date: new Date().toISOString().split('T')[0],
    });
  };

  // Salva o novo pedido
  const handleSubmit = (e) => {
    e.preventDefault();
    setOrders((prev) => [...prev, { ...newOrder, id: Date.now() }]);
    resetForm();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Pedidos Registrados</h2>
        {!isFormVisible && (
          <button
            onClick={() => setIsFormVisible(true)}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg"
          >
            Registrar Novo Pedido
          </button>
        )}
      </div>

      {isFormVisible && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-4 bg-gray-50 rounded-lg border space-y-4 animate-fade-in"
        >
          <h3 className="text-lg font-semibold">Novo Registro de Venda</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              name="customerName"
              value={newOrder.customerName}
              onChange={handleInputChange}
              placeholder="Nome do Cliente"
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
              <option value="pago">Pago</option>
              <option value="pendente">Pendente</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="font-medium">Itens do Pedido</label>
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
                    <option value="">Selecione um produto</option>
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
                    <option value="">Tamanho</option>
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
              + Adicionar Item
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium">Valor Total (R$)</label>
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
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md"
            >
              Salvar Pedido
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        {orders.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Nenhum pedido registrado ainda.
          </p>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 font-semibold">Data</th>
                <th className="p-3 font-semibold">Cliente</th>
                <th className="p-3 font-semibold">Itens</th>
                <th className="p-3 font-semibold">Total</th>
                <th className="p-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="p-3">
                    {new Date(order.date).toLocaleDateString('pt-BR', {
                      timeZone: 'UTC',
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
                          product?.name || 'Produto Removido'
                        } (${item.size.toUpperCase()})`;
                      })
                      .join(', ')}
                  </td>
                  <td className="p-3 font-medium">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(order.total / 100)}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
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

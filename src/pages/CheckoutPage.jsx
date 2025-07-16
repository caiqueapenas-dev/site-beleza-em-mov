// Substitua o conteúdo do seu CheckoutPage.jsx por este:
import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, DollarSign } from 'lucide-react';

function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const cartItems = location.state?.items || [];

  // Se não houver itens, redireciona de volta para a loja
  if (cartItems.length === 0) {
    navigate('/loja');
    return null;
  }

  // Estados para o formulário
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('');
  const [coupon, setCoupon] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  // Lógica de cupom pode ser adicionada aqui para calcular o total
  const total = subtotal;

  const handleSubmitOrder = () => {
    // Validação simples
    if (!customerInfo.name || !customerInfo.phone || !paymentMethod) {
      alert(
        'Por favor, preencha seu nome, telefone e escolha uma forma de pagamento.',
      );
      return;
    }

    // Monta a lista de itens para a mensagem
    const itemsList = cartItems
      .map(
        (item) =>
          `- ${item.name} (Tam: ${item.size}, Qtd: ${item.quantity}) - ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)}`,
      )
      .join('\n');

    // Monta a mensagem final
    const message = `
*🎉 NOVO PEDIDO REALIZADO PELO SITE!*

*DADOS DO CLIENTE:*
*Nome:* ${customerInfo.name}
*Telefone:* ${customerInfo.phone}
*Email:* ${customerInfo.email || 'Não informado'}
*CPF:* ${customerInfo.cpf || 'Não informado'}

-----------------------------------

*RESUMO DO PEDIDO:*
${itemsList}

-----------------------------------

*Total:* *${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}*
*Forma de Pagamento Escolhida:* ${paymentMethod}
${coupon ? `*Cupom Aplicado:* ${coupon}` : ''}

Aguardando contato para finalizar a compra.
    `;

    // Cria o link do WhatsApp
    const whatsappUrl = `https://wa.me/5575983059101?text=${encodeURIComponent(message)}`;

    // Abre o link em uma nova aba
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            to="/loja"
            className="text-3xl font-bold tracking-tighter text-cyan-600"
          >
            BeM
          </Link>
          <Link to="/loja" className="text-sm text-gray-600 hover:underline">
            Voltar para a loja
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Lado Esquerdo: Formulário */}
        <div className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">Seus Dados</h2>
          <form className="space-y-4">
            {/* Inputs para nome, email, telefone, cpf */}
            <input
              type="text"
              name="name"
              placeholder="Nome Completo"
              onChange={handleInputChange}
              className="w-full p-3 border rounded-md"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleInputChange}
              className="w-full p-3 border rounded-md"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Telefone (WhatsApp)"
              onChange={handleInputChange}
              className="w-full p-3 border rounded-md"
              required
            />
            <input
              type="text"
              name="cpf"
              placeholder="CPF"
              onChange={handleInputChange}
              className="w-full p-3 border rounded-md"
              required
            />
          </form>

          <h2 className="text-2xl font-bold mt-8 mb-4">Forma de Pagamento</h2>
          <div className="space-y-3">
            {/* Opções de Pagamento */}
            {['Pix', 'Cartão de Crédito', 'Dinheiro'].map((method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`w-full flex items-center gap-3 p-4 border rounded-lg text-left ${paymentMethod === method ? 'border-cyan-500 ring-2 ring-cyan-500' : ''}`}
              >
                {method === 'Pix' && <Smartphone />}
                {method === 'Cartão de Crédito' && <CreditCard />}
                {method === 'Dinheiro' && <DollarSign />}
                {method}
              </button>
            ))}
          </div>
          <div className="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-r-lg">
            <p className="font-bold">Atenção</p>
            <p className="text-sm">
              O pedido será finalizado e o pagamento combinado através do
              WhatsApp.
            </p>
          </div>
        </div>

        {/* Lado Direito: Resumo do Pedido */}
        <div className="bg-white p-8 rounded-lg shadow h-fit">
          <h2 className="text-2xl font-bold mb-6">Resumo do Pedido</h2>
          <div className="space-y-4 border-b pb-4">
            {cartItems.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className="flex justify-between items-center text-sm"
              >
                <div>
                  <p className="font-semibold">
                    {item.name} ({item.size})
                  </p>
                  <p className="text-gray-600">Qtd: {item.quantity}</p>
                </div>
                <p>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
          <div className="space-y-2 py-4 border-b">
            <div className="flex justify-between text-sm">
              <p>Subtotal</p>
              <p>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(total)}
              </p>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Cupom de desconto"
                className="w-full p-2 border rounded-md"
              />
              <button className="px-4 bg-gray-200 rounded-md text-sm font-bold">
                Aplicar
              </button>
            </div>
          </div>
          <div className="flex justify-between font-bold text-xl pt-4">
            <p>Total</p>
            <p>
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(total)}
            </p>
          </div>
          <button
            onClick={handleSubmitOrder}
            className="w-full mt-6 bg-green-500 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-600"
          >
            Enviar Pedido
          </button>
        </div>
      </main>
    </div>
  );
}

export default CheckoutPage;

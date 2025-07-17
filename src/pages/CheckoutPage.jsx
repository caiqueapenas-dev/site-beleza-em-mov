// Substitua o conteúdo do seu CheckoutPage.jsx por este:
import React, { useState, useEffect } from 'react'; // Adicionar useEffect
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Smartphone,
  DollarSign,
  Tag,
  CheckCircle,
} from 'lucide-react'; // Adicionar Tag e CheckCircle

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

  const [promoSettings, setPromoSettings] = useState({ coupons: [] });
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState({ text: '', type: '' });

  // Carregar cupons do localStorage
  useEffect(() => {
    const savedPromos = localStorage.getItem('promoSettings');
    if (savedPromos) {
      setPromoSettings(JSON.parse(savedPromos));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // Calcula o desconto e o total
  const discountAmount = appliedCoupon
    ? subtotal * (appliedCoupon.discountPercent / 100)
    : 0;
  const total = subtotal - discountAmount;

  const handleApplyCoupon = () => {
    setCouponMessage({ text: '', type: '' });
    if (appliedCoupon) {
      setCouponMessage({
        text: 'Apenas um cupom pode ser aplicado.',
        type: 'error',
      });
      return;
    }
    const foundCoupon = promoSettings.coupons.find(
      (c) => c.code.toUpperCase() === coupon.toUpperCase() && c.isActive,
    );

    if (foundCoupon) {
      setAppliedCoupon(foundCoupon);
      setCouponMessage({
        text: `Cupom de ${foundCoupon.discountPercent}% aplicado!`,
        type: 'success',
      });
    } else {
      setCouponMessage({ text: 'Cupom inválido ou expirado.', type: 'error' });
    }
  };

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

    const message = `
*NOVO PEDIDO REALIZADO PELO SITE!*

*DADOS DO CLIENTE:*
*Nome:* ${customerInfo.name}
*Telefone:* ${customerInfo.phone}
*Email:* ${customerInfo.email || 'Não informado'}
*CPF:* ${customerInfo.cpf || 'Não informado'}

-----------------------------------

*RESUMO DO PEDIDO:*
${itemsList}

-----------------------------------
*Subtotal:* ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}
${appliedCoupon ? `*Cupom Aplicado (${appliedCoupon.code}):* -${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(discountAmount)}\n` : ''}
*Total:* *${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}*
*Forma de Pagamento Escolhida:* ${paymentMethod}

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
                disabled={!!appliedCoupon}
              />
              <button
                onClick={handleApplyCoupon}
                disabled={!!appliedCoupon}
                className="px-4 bg-gray-200 rounded-md text-sm font-bold hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
              >
                Aplicar
              </button>
            </div>
            {/* Mensagens de feedback do cupom */}
            {couponMessage.text && (
              <div
                className={`text-xs flex items-center gap-1 ${couponMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}
              >
                {couponMessage.type === 'success' ? (
                  <CheckCircle size={14} />
                ) : (
                  <Tag size={14} />
                )}
                {couponMessage.text}
              </div>
            )}
            {/* Exibição do desconto */}
            {appliedCoupon && (
              <div className="flex justify-between text-sm text-green-600">
                <p>Desconto ({appliedCoupon.code})</p>
                <p>
                  -
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(discountAmount)}
                </p>
              </div>
            )}
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

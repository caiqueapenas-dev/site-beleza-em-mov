// src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Smartphone,
  DollarSign,
  Tag,
  CheckCircle,
} from 'lucide-react';

function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const cartItems = location.state?.items || [];

  // se não houver itens, redireciona de volta para a loja
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/loja');
    }
  }, [cartItems, navigate]);

  // estados para o formulário
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

  // carregar cupons da api
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await fetch('/api/promotions');
        const data = await response.json();
        setPromoSettings(data);
      } catch (error) {
        console.error('falha ao buscar promoções no checkout:', error);
      }
    };
    fetchPromotions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // calcula o desconto e o total
  const discountAmount = appliedCoupon
    ? subtotal * (appliedCoupon.discountPercent / 100)
    : 0;
  const total = subtotal - discountAmount;

  const handleApplyCoupon = () => {
    setCouponMessage({ text: '', type: '' });
    if (appliedCoupon) {
      setCouponMessage({
        text: 'apenas um cupom pode ser aplicado.',
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
        text: `cupom de ${foundCoupon.discountPercent}% aplicado!`,
        type: 'success',
      });
    } else {
      setCouponMessage({ text: 'cupom inválido ou expirado.', type: 'error' });
    }
  };

  const handleSubmitOrder = () => {
    // validação simples
    if (!customerInfo.name || !customerInfo.phone || !paymentMethod) {
      alert(
        'por favor, preencha seu nome, telefone e escolha uma forma de pagamento.',
      );
      return;
    }

    // monta a lista de itens para a mensagem
    const itemsList = cartItems
      .map(
        (item) =>
          `- ${item.name} (tam: ${item.size}, qtd: ${
            item.quantity
          }) - ${new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(item.price * item.quantity)}`,
      )
      .join('\n');

    const message = `
*novo pedido realizado pelo site!*

*dados do cliente:*
*nome:* ${customerInfo.name}
*telefone:* ${customerInfo.phone}
*email:* ${customerInfo.email || 'não informado'}
*cpf:* ${customerInfo.cpf || 'não informado'}

-----------------------------------

*resumo do pedido:*
${itemsList}

-----------------------------------
*subtotal:* ${new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(subtotal)}
${
  appliedCoupon
    ? `*cupom aplicado (${
        appliedCoupon.code
      }):* -${new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(discountAmount)}\n`
    : ''
}
*total:* *${new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(total)}*
*forma de pagamento escolhida:* ${paymentMethod}

aguardando contato para finalizar a compra.
    `;

    // cria o link do whatsapp
    const whatsappUrl = `https://wa.me/5575983059101?text=${encodeURIComponent(
      message,
    )}`;

    // abre o link em uma nova aba
    window.open(whatsappUrl, '_blank');
  };
  
  if (cartItems.length === 0) {
    return null; // evita renderizar a página antes do redirecionamento
  }


  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            to="/loja"
            className="text-3xl font-bold tracking-tighter text-cyan-600"
          >
            bem
          </Link>
          <Link to="/loja" className="text-sm text-gray-600 hover:underline">
            voltar para a loja
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* lado esquerdo: formulário */}
        <div className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">seus dados</h2>
          <form className="space-y-4">
            {/* inputs para nome, email, telefone, cpf */}
            <input
              type="text"
              name="name"
              placeholder="nome completo"
              onChange={handleInputChange}
              className="w-full p-3 border rounded-md"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="email"
              onChange={handleInputChange}
              className="w-full p-3 border rounded-md"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="telefone (whatsapp)"
              onChange={handleInputChange}
              className="w-full p-3 border rounded-md"
              required
            />
            <input
              type="text"
              name="cpf"
              placeholder="cpf"
              onChange={handleInputChange}
              className="w-full p-3 border rounded-md"
              required
            />
          </form>

          <h2 className="text-2xl font-bold mt-8 mb-4">forma de pagamento</h2>
          <div className="space-y-3">
            {/* opções de pagamento */}
            {['pix', 'cartão de crédito', 'dinheiro'].map((method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`w-full flex items-center gap-3 p-4 border rounded-lg text-left capitalize ${
                  paymentMethod === method
                    ? 'border-cyan-500 ring-2 ring-cyan-500'
                    : ''
                }`}
              >
                {method === 'pix' && <Smartphone />}
                {method === 'cartão de crédito' && <CreditCard />}
                {method === 'dinheiro' && <DollarSign />}
                {method}
              </button>
            ))}
          </div>
          <div className="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-r-lg">
            <p className="font-bold">atenção</p>
            <p className="text-sm">
              o pedido será finalizado e o pagamento combinado através do
              whatsapp.
            </p>
          </div>
        </div>

        {/* lado direito: resumo do pedido */}
        <div className="bg-white p-8 rounded-lg shadow h-fit">
          <h2 className="text-2xl font-bold mb-6">resumo do pedido</h2>
          <div className="space-y-4 border-b pb-4">
            {cartItems.map((item) => (
              <div
                key={`${item._id}-${item.size}`}
                className="flex justify-between items-center text-sm"
              >
                <div>
                  <p className="font-semibold">
                    {item.name} ({item.size})
                  </p>
                  <p className="text-gray-600">qtd: {item.quantity}</p>
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
              <p>subtotal</p>
              <p>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(subtotal)}
              </p>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="cupom de desconto"
                className="w-full p-2 border rounded-md"
                disabled={!!appliedCoupon}
              />
              <button
                onClick={handleApplyCoupon}
                disabled={!!appliedCoupon}
                className="px-4 bg-gray-200 rounded-md text-sm font-bold hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
              >
                aplicar
              </button>
            </div>
            {couponMessage.text && (
              <div
                className={`text-xs flex items-center gap-1 ${
                  couponMessage.type === 'success'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {couponMessage.type === 'success' ? (
                  <CheckCircle size={14} />
                ) : (
                  <Tag size={14} />
                )}
                {couponMessage.text}
              </div>
            )}
            {appliedCoupon && (
              <div className="flex justify-between text-sm text-green-600">
                <p>desconto ({appliedCoupon.code})</p>
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
            <p>total</p>
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
            enviar pedido
          </button>
        </div>
      </main>
    </div>
  );
}

export default CheckoutPage;
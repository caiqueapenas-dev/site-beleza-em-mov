// src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import {
  CreditCard,
  Smartphone,
  DollarSign,
  Tag,
  CheckCircle,
} from 'lucide-react'

function CheckoutPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const cartItems = location.state?.items || []

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/loja')
    }
  }, [cartItems, navigate])

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
  })
  const [paymentMethod, setPaymentMethod] = useState('')
  const [coupon, setCoupon] = useState('')

  const [promoSettings, setPromoSettings] = useState({ coupons: [] })
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponMessage, setCouponMessage] = useState({ text: '', type: '' })

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await fetch('/api/promotions')
        const data = await response.json()
        setPromoSettings(data)
      } catch (error) {
        console.error('Falha ao buscar promoções no checkout:', error)
      }
    }
    fetchPromotions()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCustomerInfo((prev) => ({ ...prev, [name]: value }))
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )

  // Calcula o total original (sem descontos de produtos)
  const originalSubtotal = cartItems.reduce(
    (sum, item) => {
      const hasDiscount = item.desconto_percentual && item.desconto_percentual > 0;
      const originalPrice = item.originalPrice || (hasDiscount ? item.price / (1 - item.desconto_percentual / 100) : item.price);
      return sum + originalPrice * item.quantity;
    },
    0,
  )

  // Calcula o desconto total dos produtos
  const productDiscountAmount = originalSubtotal - subtotal

  const discountAmount = appliedCoupon
    ? subtotal * (appliedCoupon.discountPercent / 100)
    : 0
  const total = subtotal - discountAmount

  const handleApplyCoupon = () => {
    setCouponMessage({ text: '', type: '' })
    if (appliedCoupon) {
      setCouponMessage({
        text: 'Apenas um cupom pode ser aplicado.',
        type: 'error',
      })
      return
    }
    const foundCoupon = promoSettings.coupons.find(
      (c) => c.code.toUpperCase() === coupon.toUpperCase() && c.isActive,
    )

    if (foundCoupon) {
      setAppliedCoupon(foundCoupon)
      setCouponMessage({
        text: `Cupom de ${foundCoupon.discountPercent}% aplicado!`,
        type: 'success',
      })
    } else {
      setCouponMessage({ text: 'Cupom inválido ou expirado.', type: 'error' })
    }
  }

  const handleSubmitOrder = () => {
    if (!customerInfo.name || !customerInfo.phone || !paymentMethod) {
      alert(
        'Por favor, preencha seu nome, telefone e escolha uma forma de pagamento.',
      )
      return
    }

    const itemsList = cartItems
      .map((item) => {
        const hasDiscount = item.desconto_percentual && item.desconto_percentual > 0;
        const originalPrice = item.originalPrice || (hasDiscount ? item.price / (1 - item.desconto_percentual / 100) : item.price);
        const currentPrice = item.price;
        const totalItemPrice = currentPrice * item.quantity;
        const totalOriginalPrice = originalPrice * item.quantity;
        
        let itemText = `- ${item.name} (Tam: ${item.size.toUpperCase()}, Qtd: ${item.quantity})`;
        
        if (hasDiscount) {
          itemText += `\n  Preço original: ${new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(totalOriginalPrice)}`;
          itemText += `\n  Desconto: -${item.desconto_percentual}%`;
          itemText += `\n  Preço final: ${new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(totalItemPrice)}`;
        } else {
          itemText += ` - ${new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(totalItemPrice)}`;
        }
        
        return itemText;
      })
      .join('\n\n')

    const message = `
*Novo Pedido Realizado pelo Site!*

*Dados do Cliente:*
*Nome:* ${customerInfo.name}
*Telefone:* ${customerInfo.phone}
*Email:* ${customerInfo.email || 'Não informado'}
*CPF:* ${customerInfo.cpf || 'Não informado'}

-----------------------------------

*Resumo do Pedido:*
${itemsList}

-----------------------------------
${
  productDiscountAmount > 0
    ? `*Desconto nos Produtos:* -${new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(productDiscountAmount)}\n`
    : ''
}*Subtotal:* ${new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(subtotal)}
${
  appliedCoupon
    ? `*Cupom Aplicado (${
        appliedCoupon.code
      }):* -${new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(discountAmount)}\n`
    : ''
}
*Total:* *${new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(total)}*
*Forma de Pagamento Escolhida:* ${paymentMethod}

Aguardando contato para finalizar a compra.
    `

    const whatsappUrl = `https://wa.me/5575983059101?text=${encodeURIComponent(
      message,
    )}`
    window.open(whatsappUrl, '_blank')
  }

  if (cartItems.length === 0) {
    return null
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            to="/loja"
            className="text-3xl font-bold tracking-tighter text-brand-purple"
          >
            <img
              src="https://res.cloudinary.com/dnescubo4/image/upload/v1756503535/538968010_17882407869363451_6804061717713560360_n_bzkryc.jpg"
              alt="Beleza em Movimento Logo"
              className="h-10 w-auto"
            />
          </Link>
          <Link to="/loja" className="text-sm text-gray-600 hover:underline">
            Voltar para a Loja
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-6">Seus Dados</h2>
          <form className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Nome completo"
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
            />
          </form>

          <h2 className="text-2xl font-bold mt-8 mb-4">Forma de Pagamento</h2>
          <div className="space-y-3">
            {[
              { id: 'pix', label: 'Pix', icon: <Smartphone /> },
              {
                id: 'cartao',
                label: 'Cartão de Crédito',
                icon: <CreditCard />,
              },
              { id: 'dinheiro', label: 'Dinheiro', icon: <DollarSign /> },
            ].map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.label)}
                className={`w-full flex items-center gap-3 p-4 border rounded-lg text-left capitalize ${
                  paymentMethod === method.label
                    ? 'border-brand-purple ring-2 ring-brand-purple'
                    : ''
                }`}
              >
                {method.icon}
                {method.label}
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

        <div className="bg-white p-8 rounded-lg shadow h-fit">
          <h2 className="text-2xl font-bold mb-6">Resumo do Pedido</h2>
          <div className="space-y-4 border-b pb-4">
            {cartItems.map((item) => {
              const hasDiscount = item.desconto_percentual && item.desconto_percentual > 0;
              // Se não há originalPrice, calcula o preço original baseado no desconto
              const originalPrice = item.originalPrice || (hasDiscount ? item.price / (1 - item.desconto_percentual / 100) : item.price);
              const currentPrice = item.price;
              const totalItemPrice = currentPrice * item.quantity;
              const totalOriginalPrice = originalPrice * item.quantity;
              
              return (
                <div
                  key={`${item._id}-${item.size}`}
                  className="flex justify-between items-center text-sm"
                >
                  <div>
                    <p className="font-semibold">
                      {item.name} ({item.size.toUpperCase()})
                    </p>
                    <p className="text-gray-600">Qtd: {item.quantity}</p>
                    {hasDiscount && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-semibold">
                          -{item.desconto_percentual}% OFF
                        </span>
                        <span className="text-xs text-gray-500 line-through">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(totalOriginalPrice)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(totalItemPrice)}
                    </p>
                    {hasDiscount && (
                      <p className="text-xs text-gray-500">
                        Economia: {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(totalOriginalPrice - totalItemPrice)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="space-y-2 py-4 border-b">
            {productDiscountAmount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <p>Desconto nos Produtos</p>
                <p>
                  -{new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(productDiscountAmount)}
                </p>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <p>Subtotal</p>
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
  )
}

export default CheckoutPage
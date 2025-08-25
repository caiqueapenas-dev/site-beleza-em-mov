// src/pages/HomePage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// Componentes Principais
import Header from '../components/Header';
import Footer from '../components/Footer';
import FaqItem from '../components/FaqItem'; // Importamos nosso novo componente

// Ícones
import { Cpu, HeartPulse, Sparkles, CheckCircle2 } from 'lucide-react';

// Dados para o FAQ - Em React, é comum separar os dados da apresentação
const faqData = [
  {
    question: 'Qual o prazo de entrega?',
    answer:
      'O prazo de entrega varia de acordo com sua localidade. Em média, leva de 5 a 10 dias úteis após a confirmação do pagamento. Você pode calcular o prazo exato na página do produto ou no carrinho de compras.',
  },
  {
    question: 'Como funciona a política de troca?',
    answer:
      'A primeira troca é grátis! Você tem até 30 dias corridos após o recebimento do produto para solicitar a troca por outro tamanho, cor ou modelo, ou até 7 dias para devolução por arrependimento. O produto não pode ter sinais de uso.',
  },
  {
    question: 'Os produtos têm garantia?',
    answer:
      'Sim, todos os nossos produtos possuem garantia de 90 dias contra defeitos de fabricação. A garantia não cobre danos por mau uso, como lavagem inadequada ou acidentes.',
  },
  {
    question: 'Quais são as formas de pagamento?',
    answer:
      'Aceitamos pagamentos via Cartão de Crédito (em até 6x sem juros), PIX com 5% de desconto, e Boleto Bancário. O pedido final é consolidado via WhatsApp para sua conveniência.',
  },
  {
    question: 'Como escolher o tamanho certo?',
    answer:
      'Temos uma tabela de medidas detalhada em cada página de produto. Recomendamos que você compare as medidas com uma peça de roupa que você já tenha e goste do caimento. Se ainda tiver dúvidas, nosso time de atendimento está pronto para ajudar!',
  },
];

function HomePage() {
  return (
    <>

      <Helmet>
        <title>beleza em movimento - roupas fitness com tecnologia e estilo</title>
        <meta
          name="description"
          content="encontre roupas fitness de alta performance. tecnologia, conforto e estilo para seus treinos. tops, leggings, shorts e mais."
        />
      </Helmet>
      <Header />

      <div className="relative hero-bg text-white">
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-0 flex flex-col items-center justify-center h-screen min-h-[500px] text-center p-4">
          <h1
            data-aos="fade-down"
            className="text-4xl md:text-7xl font-black uppercase text-shadow"
          >
            Conforto que te acompanha a cada movimento
          </h1>
          <p
            data-aos="fade-up"
            data-aos-delay="200"
            className="mt-4 max-w-2xl text-lg md:text-2xl text-shadow"
          >
            Roupas fitness projetadas com tecnologia de ponta para você superar
            qualquer desafio com estilo.
          </p>
          <Link
            to="/loja"
            data-aos="zoom-in"
            data-aos-delay="400"
            className="mt-8 px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-lg transition-transform transform hover:scale-105"
          >
            Ir para a Loja
          </Link>
        </div>
      </div>

      <main>
        <section id="collections" className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2
              data-aos="fade-up"
              className="text-3xl md:text-4xl font-bold mb-2"
            >
              Nossas Coleções
            </h2>
            <p
              data-aos="fade-up"
              data-aos-delay="100"
              className="text-gray-600 mb-12 max-w-2xl mx-auto"
            >
              Encontre o look perfeito para cada tipo de treino.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div
                data-aos="fade-up"
                data-aos-delay="200"
                className="group relative overflow-hidden rounded-lg"
              >
                <img
                  src="https://i.postimg.cc/PxsQrKsv/Captura-de-tela-2025-07-14-155611.png"
                  alt="Modelo masculino de roupa fitness"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 aspect-square"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-6">
                  <h3 className="text-white text-3xl font-bold">
                    Blusas manga curta
                  </h3>
                </div>
                <Link to="/loja" className="absolute inset-0" />
              </div>
              <div
                data-aos="fade-up"
                data-aos-delay="300"
                className="group relative overflow-hidden rounded-lg"
              >
                <img
                  src="https://i.postimg.cc/Znj8HS96/Captura-de-tela-2025-07-14-155619.png"
                  alt="Modelo feminina de roupa fitness"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 aspect-square"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-6">
                  <h3 className="text-white text-3xl font-bold">Tops</h3>
                </div>
                <Link to="/loja" className="absolute inset-0" />
              </div>
              <div
                data-aos="fade-up"
                data-aos-delay="400"
                className="group relative overflow-hidden rounded-lg"
              >
                <img
                  src="https://i.postimg.cc/63rL7Rtj/Captura-de-tela-2025-07-14-155644.png"
                  alt="Acessórios de fitness"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 aspect-square"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-6">
                  <h3 className="text-white text-3xl font-bold">Shorts</h3>
                </div>
                <Link to="/loja" className="absolute inset-0" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center"
              data-aos="fade-up"
            >
              <div className="flex flex-col items-center">
                <div className="bg-cyan-100 text-cyan-600 rounded-full p-4 mb-4">
                  <Cpu className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Tecnologia Avançada</h3>
                <p className="text-gray-600">
                  Tecidos que absorvem o suor, oferecem proteção UV e secagem
                  rápida para máximo desempenho.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-cyan-100 text-cyan-600 rounded-full p-4 mb-4">
                  <HeartPulse className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Conforto Incomparável
                </h3>
                <p className="text-gray-600">
                  Modelagem ergonômica e tecidos flexíveis que se movem com
                  você, sem restrições.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-cyan-100 text-cyan-600 rounded-full p-4 mb-4">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Estilo e Versatilidade
                </h3>
                <p className="text-gray-600">
                  Designs modernos e cores vibrantes para você se sentir bem
                  dentro e fora da academia.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="about"
          className="py-16 md:py-24 bg-gray-800 text-white overflow-hidden"
        >
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1" data-aos="fade-right">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Feito para durar. Projetado para vencer.
              </h2>
              <p className="mb-4 text-gray-300">
                Nossa obsessão por qualidade começa na escolha da matéria-prima.
                Usamos tecidos inteligentes que se adaptam ao seu corpo e ao
                clima, garantindo que sua única preocupação seja o próximo
                recorde a ser quebrado.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-cyan-400" />{' '}
                  Costura reforçada para alta durabilidade.
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-cyan-400" />{' '}
                  Tratamento antiodor e antibacteriano.
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-cyan-400" /> Cores
                  que não desbotam com a lavagem.
                </li>
              </ul>
              <Link
                to="/sobre"
                className="mt-8 inline-block px-6 py-3 border border-cyan-400 text-cyan-400 font-semibold rounded-lg hover:bg-cyan-400 hover:text-gray-900 transition-colors"
              >
                Saiba Mais
              </Link>
            </div>
            <div className="order-1 md:order-2" data-aos="fade-left">
              <img
                src="https://i.postimg.cc/mkwrFZcW/5.jpg"
                alt="Detalhe do tecido da roupa"
                className="rounded-lg shadow-2xl h-full w-full"
              />
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2
              data-aos="fade-up"
              className="text-3xl md:text-4xl font-bold mb-2"
            >
              O que nossos clientes dizem
            </h2>
            <p
              data-aos="fade-up"
              data-aos-delay="100"
              className="text-gray-600 mb-12 max-w-2xl mx-auto"
            >
              A maior prova de qualidade é a satisfação de quem usa.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div
                data-aos="fade-up"
                data-aos-delay="200"
                className="bg-white p-8 rounded-lg shadow-md"
              >
                <p className="text-gray-600 mb-4">
                  "A melhor legging que já usei! Não fica transparente e o
                  conforto é surreal. Já quero uma de cada cor."
                </p>
                <div className="flex items-center">
                  <img
                    src="https://i.pravatar.cc/150?img=1"
                    alt="Cliente Joana"
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <p className="font-bold">Joana F.</p>
                    <p className="text-sm text-gray-500">Atleta Amadora</p>
                  </div>
                </div>
              </div>
              <div
                data-aos="fade-up"
                data-aos-delay="300"
                className="bg-white p-8 rounded-lg shadow-md"
              >
                <p className="text-gray-600 mb-4">
                  "As camisetas dry-fit são perfeitas para os treinos mais
                  intensos. Secam muito rápido e não pesam no corpo."
                </p>
                <div className="flex items-center">
                  <img
                    src="https://i.pravatar.cc/150?img=68"
                    alt="Cliente Marcos"
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <p className="font-bold">Marcos P.</p>
                    <p className="text-sm text-gray-500">Personal Trainer</p>
                  </div>
                </div>
              </div>
              <div
                data-aos="fade-up"
                data-aos-delay="400"
                className="bg-white p-8 rounded-lg shadow-md"
              >
                <p className="text-gray-600 mb-4">
                  "Qualidade e estilo que impressionam. Uso as roupas da Beleza
                  em Movimento tanto na academia quanto no dia a dia."
                </p>
                <div className="flex items-center">
                  <img
                    src="https://i.pravatar.cc/150?img=32"
                    alt="Cliente Carla"
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <p className="font-bold">Carla S.</p>
                    <p className="text-sm text-gray-500">Entusiasta Fitness</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2
              data-aos="fade-up"
              className="text-3xl md:text-4xl font-bold mb-2"
            >
              Junte-se à nossa comunidade
            </h2>
            <p
              data-aos="fade-up"
              data-aos-delay="100"
              className="text-gray-600 mb-12"
            >
              Siga{' '}
              <a
                href="https://www.instagram.com/belezaemov/"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-600 font-semibold"
              >
                @belezaemov
              </a>{' '}
              e use a hashtag #UseBmov
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a
                href="https://www.instagram.com/belezaemov/"
                target="_blank"
                rel="noreferrer"
                className="group relative block"
                data-aos="zoom-in"
                data-aos-delay="200"
              >
                <img
                  src="https://i.postimg.cc/Vk2jD4NZ/Captura-de-tela-2025-07-14-155829.png"
                  alt="Post do Instagram 1"
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg opacity-100 group-hover:bg-opacity-20 transition-all duration-300">
                  <p className="text-white text-2xl font-bold opacity-75 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                    @belezaemov
                  </p>
                </div>
              </a>
              {/* ... Adicione os outros 3 links do instagram aqui ... */}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-cyan-500 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2
              data-aos="fade-up"
              className="text-3xl md:text-4xl font-bold mb-2"
            >
              Faça parte do clube!
            </h2>
            <p
              data-aos="fade-up"
              data-aos-delay="100"
              className="mb-8 max-w-2xl mx-auto"
            >
              Cadastre-se e ganhe{' '}
              <span className="font-extrabold">15% de desconto</span> na sua
              primeira compra, além de acesso exclusivo a lançamentos e
              promoções.
            </p>
            <form
              data-aos="fade-up"
              data-aos-delay="200"
              className="flex flex-col gap-4 max-w-2xl mx-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nome"
                  className="w-full px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                  required
                />
                <input
                  type="text"
                  placeholder="Sobrenome"
                  className="w-full px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                  required
                />
              </div>
              <input
                type="email"
                placeholder="Digite seu melhor e-mail"
                className="w-full px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                required
              />
              <input
                type="tel"
                placeholder="Telefone (WhatsApp)"
                className="w-full px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                required
              />
              <button
                type="submit"
                className="w-full px-8 py-3 bg-gray-800 hover:bg-gray-900 text-white font-bold rounded-lg transition-colors"
              >
                Quero meu desconto!
              </button>
            </form>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-3xl" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Perguntas Frequentes
            </h2>
            <div className="space-y-4">
              {/* Mapeamos os dados do FAQ para criar cada item dinamicamente */}
              {faqData.map((faq, index) => (
                <FaqItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default HomePage;

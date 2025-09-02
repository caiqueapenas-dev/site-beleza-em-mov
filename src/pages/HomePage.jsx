// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FaqItem from '../components/FaqItem';
import { Cpu, HeartPulse, Sparkles, CheckCircle2 } from 'lucide-react';

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
        <title>
          Beleza em Movimento - Roupas Fitness com Tecnologia e Estilo
        </title>
        <meta
          name="description"
          content="Encontre roupas fitness de alta performance. Tecnologia, conforto e estilo para seus treinos. Tops, leggings, shorts e mais."
        />
      </Helmet>
      <Header />

      <div className="relative bg-white text-black">
        <div className="relative z-0 flex flex-col items-center justify-center h-screen min-h-[500px] text-center p-4">
          <h1
            data-aos="fade-down"
            className="text-4xl md:text-7xl font-black uppercase"
          >
            Conforto que te Acompanha a Cada Movimento
          </h1>
          <p
            data-aos="fade-up"
            data-aos-delay="200"
            className="mt-4 max-w-2xl text-lg md:text-2xl text-gray-700"
          >
            Roupas fitness projetadas com tecnologia de ponta para você superar
            qualquer desafio com estilo.
          </p>
          <Link
            to="/loja"
            data-aos="zoom-in"
            data-aos-delay="400"
            className="mt-8 px-8 py-4 bg-brand-purple hover:bg-brand-purple-dark text-white font-bold rounded-lg transition-transform transform hover:scale-105"
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
              {/* Coleção 1: Conjuntos */}
              <div
                data-aos="fade-up"
                data-aos-delay="200"
                className="group relative overflow-hidden rounded-lg"
              >
                <img
                  src="https://res.cloudinary.com/dnescubo4/image/upload/v1756852284/5cf45cb1-ee7c-4f6a-b016-3ae151ec56db_jlxc2i.jpg"
                  alt="Coleção de Conjuntos Fitness"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 aspect-square"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-6">
                  <h3 className="text-white text-3xl font-bold">Conjuntos</h3>
                </div>
                <Link to="/loja" className="absolute inset-0" />
              </div>
              {/* Coleção 2: Tops */}
              <div
                data-aos="fade-up"
                data-aos-delay="300"
                className="group relative overflow-hidden rounded-lg"
              >
                <img
                  src="https://res.cloudinary.com/dnescubo4/image/upload/v1756852284/f2696e67-4563-49bb-9bc2-449061eb0fe7_pesphj.jpg"
                  alt="Coleção de Tops Fitness"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 aspect-square"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-6">
                  <h3 className="text-white text-3xl font-bold">Tops</h3>
                </div>
                <Link to="/loja" className="absolute inset-0" />
              </div>
              {/* Coleção 3: Leggings */}
              <div
                data-aos="fade-up"
                data-aos-delay="400"
                className="group relative overflow-hidden rounded-lg"
              >
                <img
                  src="https://res.cloudinary.com/dnescubo4/image/upload/v1756852284/c542ab87-4ae2-448a-8e8b-0567eca89611_slcf7p.jpg"
                  alt="Coleção de Leggings Fitness"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 aspect-square"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-6">
                  <h3 className="text-white text-3xl font-bold">Leggings</h3>
                </div>
                <Link to="/loja" className="absolute inset-0" />
              </div>
              {/* Coleção 4: Macacões */}
              <div
                data-aos="fade-up"
                data-aos-delay="500"
                className="group relative overflow-hidden rounded-lg"
              >
                <img
                  src="https://res.cloudinary.com/dnescubo4/image/upload/v1756852284/5116bc6b-edcc-4e5c-a4b9-4182a2856e97_ddkosf.jpg"
                  alt="Coleção de Macacões Fitness"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 aspect-square"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-6">
                  <h3 className="text-white text-3xl font-bold">Macacões</h3>
                </div>
                <Link to="/loja" className="absolute inset-0" />
              </div>
              {/* Coleção 5: Bermudas */}
              <div
                data-aos="fade-up"
                data-aos-delay="600"
                className="group relative overflow-hidden rounded-lg"
              >
                <img
                  src="https://res.cloudinary.com/dnescubo4/image/upload/v1756852284/43f6cd1b-3abb-4b0b-a2c0-9a6a1d9b23dd_ehn4wf.jpg"
                  alt="Coleção de Bermudas Fitness"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 aspect-square"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-6">
                  <h3 className="text-white text-3xl font-bold">Bermudas</h3>
                </div>
                <Link to="/loja" className="absolute inset-0" />
              </div>
              {/* Coleção 6: Shorts */}
              <div
                data-aos="fade-up"
                data-aos-delay="700"
                className="group relative overflow-hidden rounded-lg"
              >
                <img
                  src="https://i.postimg.cc/63rL7Rtj/Captura-de-tela-2025-07-14-155644.png"
                  alt="Coleção de Shorts Fitness"
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
                <div className="bg-brand-purple-light text-brand-purple-dark rounded-full p-4 mb-4">
                  <Cpu className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Tecnologia Avançada</h3>
                <p className="text-gray-600">
                  Tecidos que absorvem o suor, oferecem proteção UV e secagem
                  rápida para máximo desempenho.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-brand-purple-light text-brand-purple-dark rounded-full p-4 mb-4">
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
                <div className="bg-brand-purple-light text-brand-purple-dark rounded-full p-4 mb-4">
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
                Feito para Durar. Projetado para Vencer.
              </h2>
              <p className="mb-4 text-gray-300">
                Nossa obsessão por qualidade começa na escolha da matéria-prima.
                Usamos tecidos inteligentes que se adaptam ao seu corpo e ao
                clima, garantindo que sua única preocupação seja o próximo
                recorde a ser quebrado.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-brand-purple-light" />
                  Costura reforçada para alta durabilidade.
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-brand-purple-light" />
                  Tratamento antiodor e antibacteriano.
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-brand-purple-light" />{' '}
                  Cores que não desbotam com a lavagem.
                </li>
              </ul>
              <Link
                to="/sobre"
                className="mt-8 inline-block px-6 py-3 border border-brand-purple-light text-brand-purple-light font-semibold rounded-lg hover:bg-brand-purple-light hover:text-gray-900 transition-colors"
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
              O Que Nossos Clientes Dizem
            </h2>
            <p
              data-aos="fade-up"
              data-aos-delay="100"
              className="text-gray-600 mb-12 max-w-2xl mx-auto"
            >
              A maior prova de qualidade é a satisfação de quem usa.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              <div data-aos="fade-up" data-aos-delay="200">
                <img
                  src="https://res.cloudinary.com/dnescubo4/image/upload/v1756851833/e4bc087d-6148-4a69-94bd-e0cf6d1f8916_aigmjt.jpg"
                  alt="Depoimento de cliente 1"
                  className="rounded-lg shadow-md w-full"
                />
              </div>
              <div data-aos="fade-up" data-aos-delay="300">
                <img
                  src="https://res.cloudinary.com/dnescubo4/image/upload/v1756851832/2474cf66-f88e-4666-a6a9-279456f07ba3_znsmbi.jpg"
                  alt="Depoimento de cliente 2"
                  className="rounded-lg shadow-md w-full"
                />
              </div>
              <div data-aos="fade-up" data-aos-delay="400">
                <img
                  src="https://res.cloudinary.com/dnescubo4/image/upload/v1756851833/0c50d9fc-43f4-4063-9e4a-337019a6b319_zo1yko.jpg"
                  alt="Depoimento de cliente 3"
                  className="rounded-lg shadow-md w-full"
                />
              </div>
              <div data-aos="fade-up" data-aos-delay="500">
                <img
                  src="https://res.cloudinary.com/dnescubo4/image/upload/v1756851832/89cb526c-1d4d-4830-a71d-5a1e888f386b_pl9z9b.jpg"
                  alt="Depoimento de cliente 4"
                  className="rounded-lg shadow-md w-full"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-3xl" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Perguntas Frequentes
            </h2>
            <div className="space-y-4">
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
// src/pages/SobrePage.jsx
import React from 'react';
import LojaHeader from '../components/LojaHeader'; // Usamos o header da loja para ter um padrão
import Footer from '../components/Footer';

function SobrePage() {
  return (
    <>
      <LojaHeader />

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-gray-900">Sobre Nós</h1>
          {/* A classe 'prose' do Tailwind formata o texto de forma agradável */}
          <div className="prose lg:prose-xl text-gray-700 space-y-4">
            <p>
              A Beleza em Movimento nasceu da paixão pelo esporte e pela crença
              de que a roupa que você veste pode e deve ser uma aliada na sua
              performance. Não somos apenas uma marca de roupas; somos um
              movimento que celebra a força, a resiliência e a beleza de cada
              corpo em atividade.
            </p>
            <p>
              Nossa missão é criar peças com design inovador, tecnologia de
              ponta e conforto absoluto, para que sua única preocupação seja
              superar seus próprios limites. Cada costura, cada tecido e cada
              modelagem são pensados para oferecer a liberdade que você precisa
              para se mover, seja na academia, na rua ou na natureza.
            </p>
            <p>
              Junte-se a nós e sinta a diferença que a roupa certa pode fazer no
              seu dia a dia e nos seus treinos.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default SobrePage;

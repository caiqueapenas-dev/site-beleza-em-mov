// src/components/FaqItem.jsx
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

// Recebemos a pergunta (question) e a resposta (answer) como propriedades (props)
function FaqItem({ question, answer }) {
  // Cada item do FAQ controla seu próprio estado (aberto ou fechado)
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="faq-item bg-white rounded-lg shadow-sm">
      <button
        className="faq-question w-full flex justify-between items-center text-left p-5 font-semibold"
        onClick={() => setIsOpen(!isOpen)} // Ao clicar, invertemos o estado
      >
        <span>{question}</span>
        <ChevronDown
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {/* A resposta só é exibida se o estado 'isOpen' for verdadeiro */}
      {isOpen && (
        <div className="faq-answer p-5 pt-0 text-gray-600">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default FaqItem;
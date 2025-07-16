// src/components/CustomCurrencyInput.jsx
import React from 'react';

// Este componente trabalha com o valor em CENTAVOS para evitar erros de decimal
function CustomCurrencyInput({ valueInCents, onValueChange }) {
  
  const handleChange = (e) => {
    // Pega o valor, remove tudo que não for número e converte para um inteiro
    const newCents = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10) || 0;
    onValueChange(newCents);
  };

  // Formata o valor em centavos para uma string de moeda (ex: 12990 -> "R$ 129,90")
  const formattedValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valueInCents / 100);

  return (
    <input
      type="text"
      value={formattedValue}
      onChange={handleChange}
      className="w-full mt-1 p-2 border rounded-md"
    />
  );
}

export default CustomCurrencyInput;
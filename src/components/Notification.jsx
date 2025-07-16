// src/components/Notification.jsx
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

// O componente recebe a mensagem, o tipo (sucesso/erro) e se está visível
function Notification({ message, type = 'success', visible }) {
  if (!visible) return null;

  const successStyles = 'bg-green-100 border-green-400 text-green-700';
  const errorStyles = 'bg-red-100 border-red-400 text-red-700';

  const styles = type === 'success' ? successStyles : errorStyles;
  const Icon = type === 'success' ? CheckCircle : XCircle;

  return (
    <div className={`fixed top-5 right-5 p-4 rounded-lg border shadow-lg flex items-center z-50 animate-fade-in-down ${styles}`}>
      <Icon className="mr-3" />
      <span>{message}</span>
    </div>
  );
}

export default Notification;
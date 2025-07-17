// src/components/AdminModal.jsx
import React from 'react';
import { X } from 'lucide-react';

function AdminModal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <header className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <X />
          </button>
        </header>
        <main className="p-6 overflow-y-auto">
          {children}{' '}
          {/* O conteúdo do modal (nosso formulário) será renderizado aqui */}
        </main>
      </div>
    </div>
  );
}

export default AdminModal;

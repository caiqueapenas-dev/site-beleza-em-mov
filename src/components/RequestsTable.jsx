// src/components/RequestsTable.jsx
import React from 'react';

function RequestsTable({ requests, onMarkAsSeen }) {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Solicitações de Clientes</h2>
      {requests.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 font-semibold">Cliente</th>
                <th className="p-3 font-semibold">Contato (WhatsApp)</th>
                <th className="p-3 font-semibold">Produto Solicitado</th>
                <th className="p-3 font-semibold">Tamanho</th>
                <th className="p-3 font-semibold">Data</th>
                <th className="p-3 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr
                  key={req.id}
                  className={`border-b transition-opacity ${req.seen ? 'opacity-50' : ''}`}
                >
                  <td className="p-3 font-semibold">
                    {req.requesterName || 'Não informado'}
                  </td>
                  <td className="p-3">
                    {req.requesterPhone ? (
                      <a
                        href={`https://wa.me/55${(
                          req.requesterPhone || ''
                        ).replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-600 hover:underline"
                      >
                        {req.requesterPhone}
                      </a>
                    ) : (
                      'Não informado'
                    )}
                  </td>
                  <td className="p-3">{req.productName}</td>
                  <td className="p-3 font-bold">{req.requestedSize}</td>
                  <td className="p-3">
                    {new Date(req.timestamp).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="p-3">
                    {!req.seen && (
                      <button
                        onClick={() => onMarkAsSeen(req.id)}
                        className="text-green-600 hover:underline text-sm font-semibold"
                      >
                        Marcar como visto
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">Nenhuma solicitação no momento.</p>
      )}
    </>
  );
}

export default RequestsTable;

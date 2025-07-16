// Dentro de AdminDashboardPage.jsx

// ... (import de useState, useEffect, e dos produtos)

return (
    <div>
        <h1>Painel de Controle de Estoque</h1>
        <button>Adicionar Novo Produto</button>

        <table>
            <thead>
                <tr>
                    <th>Produto</th>
                    <th>Estoque Detalhado</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                {products.map(product => (
                    <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>
                            {Object.entries(product.estoque).map(([tamanho, qtd]) => (
                                <span key={tamanho}>
                                    <strong>{tamanho}:</strong> {qtd} unid. 
                                </span>
                            ))}
                        </td>
                        <td>
                            <button>Editar</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
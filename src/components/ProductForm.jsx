// Dentro de ProductForm.jsx

function ProductForm({ onSubmit, initialData = {} }) {
    // ... (estados para cada campo do formulário)

    return (
        <form onSubmit={handleSubmit}>
            <input name="name" placeholder="Nome do Produto" />
            <input name="price" type="number" placeholder="Preço" />

            <fieldset>
                <legend>Estoque</legend>
                <input name="estoque.P" type="number" placeholder="Qtd. P" />
                <input name="estoque.M" type="number" placeholder="Qtd. M" />
                <input name="estoque.G" type="number" placeholder="Qtd. G" />
                <input name="estoque.GG" type="number" placeholder="Qtd. GG" />
            </fieldset>

            <button type="submit">Salvar Produto</button>
        </form>
    );
}
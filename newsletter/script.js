async function carregarArtigo(url, containerId) {
    const container = document.getElementById(containerId);

    // Oculta todos os outros containers de artigo para que apenas um seja visível por vez
    // e limpa o conteúdo para não haver sobreposição
    document.querySelectorAll('.article-container').forEach(item => {
        if (item.id !== containerId) { // Não oculta o container atual
            item.classList.add('hidden');
            item.innerHTML = ''; // Limpa o conteúdo dos outros containers
        }
    });

    // Se o container clicado já estiver visível e com conteúdo (ou seja, o artigo já está aberto),
    // oculta ele e limpa seu conteúdo para "fechar" o artigo.
    if (!container.classList.contains('hidden') && container.innerHTML.trim() !== '') {
        container.classList.add('hidden');
        container.innerHTML = '';
        return; // Sai da função, pois já lidamos com o fechamento/toggle
    }

    // Exibe uma mensagem de carregamento enquanto o conteúdo é buscado
    container.innerHTML = '<p>Carregando artigo...</p>';
    container.classList.remove('hidden'); // Garante que o container esteja visível para mostrar a mensagem de carregamento

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro ao carregar o artigo: ${response.status} - ${response.statusText}`);
        }
        const html = await response.text();
        container.innerHTML = html; // Insere o conteúdo HTML do artigo
        // A classe 'hidden' já foi removida acima.
    } catch (error) {
        console.error("Falha ao carregar o artigo:", error);
        container.innerHTML = `<p style="color: red;">Ocorreu um erro ao carregar o artigo. Por favor, tente novamente mais tarde.</p><p>Detalhes: ${error.message}</p>`;
        container.classList.remove('hidden'); // Garante que a mensagem de erro seja visível
    }
}

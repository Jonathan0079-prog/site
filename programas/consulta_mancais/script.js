document.addEventListener('DOMContentLoaded', () => {

    // --- SELEÇÃO DOS ELEMENTOS DO DOM ---
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('results-container');
    const themeToggle = document.getElementById('theme-toggle');

    // --- FUNÇÃO PRINCIPAL DE INICIALIZAÇÃO ---
    async function initializeApp() {
        setupTheme();
        try {
            const response = await fetch('database.json');
            if (!response.ok) {
                throw new Error(`Erro ao carregar a base de dados: ${response.statusText}`);
            }
            const DB_MANCAIS = await response.json();
            setupEventListeners(DB_MANCAIS);
            showInitialMessage();
        } catch (error) {
            console.error("Não foi possível carregar a base de dados:", error);
            showErrorMessage("Falha crítica: Não foi possível carregar a base de dados. Verifique o console para mais detalhes.");
        }
    }

    // --- CONFIGURAÇÃO DOS EVENTOS ---
    function setupEventListeners(DB_MANCAIS) {
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.trim().toUpperCase();
            if (searchTerm === '') {
                showInitialMessage();
                return;
            }
            const allKeys = Object.keys(DB_MANCAIS);
            const filteredKeys = allKeys.filter(key => key.includes(searchTerm));
            displayFilteredResults(filteredKeys);
        });

        resultsContainer.addEventListener('click', (event) => {
            if (event.target && event.target.classList.contains('result-item-button')) {
                const key = event.target.dataset.key;
                if (DB_MANCAIS[key]) {
                    displayMancalData(DB_MANCAIS[key]);
                    document.getElementById('results-card').scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }

    // --- FUNÇÕES DE EXIBIÇÃO ---
    function displayFilteredResults(keys) {
        resultsContainer.innerHTML = '';
        const title = document.createElement('h2');
        title.innerHTML = `<i class="fas fa-list-ul"></i> Resultados da Busca`;
        resultsContainer.appendChild(title);

        if (keys.length === 0) {
            resultsContainer.innerHTML += `<p>Nenhum resultado encontrado.</p>`;
            return;
        }
        
        const listContainer = document.createElement('div');
        listContainer.className = 'results-list';
        keys.forEach(key => {
            const button = document.createElement('button');
            button.className = 'result-item-button';
            button.textContent = key;
            button.dataset.key = key;
            listContainer.appendChild(button);
        });
        resultsContainer.appendChild(listContainer);
    }
    
    // FUNÇÃO ATUALIZADA PARA MOSTRAR O DIÂMETRO DO EIXO NA TABELA
    function displayMancalData(mancal) {
        // Constrói o cabeçalho inicial com o diâmetro principal ou em polegadas
        let eixoPrincipal = mancal.eixo_mm ? `${mancal.eixo_mm} mm` : (mancal.eixo_pol ? `${mancal.eixo_pol} (${mancal.eixo_mm} mm)` : 'N/A');
        let detailsHtml = `
            <h2><i class="fas fa-info-circle"></i> ${mancal.designacao_completa}</h2>
            <p><strong>Tipo:</strong> ${mancal.tipo} | <strong>Eixo Padrão:</strong> ${eixoPrincipal}</p>`;

        // Se for mancal bipartido, cria a tabela de rolamentos com a nova coluna de eixo
        if (mancal.rolamentos_compativeis) {
            const rolamentosRows = mancal.rolamentos_compativeis.map(r => `<tr><td>${r.tipo}</td><td>${r.rolamento}</td><td>${r.bucha || 'N/A'}</td><td>${r.eixo} mm</td></tr>`).join('');
            const vedacoesRows = mancal.vedacoes_compativeis.map(v => `<tr><td>${v}</td></tr>`).join('');
            detailsHtml += `
                <div class="table-container">
                    <table><thead><tr><th>Tipo de Rolamento</th><th>Designação</th><th>Bucha de Fixação</th><th>Ø Eixo</th></tr></thead><tbody>${rolamentosRows}</tbody></table>
                </div>
                <div class="table-container">
                    <table><thead><tr><th>Vedações Compatíveis</th></tr></thead><tbody>${vedacoesRows}</tbody></table>
                </div>`;
        }

        // Se for unidade de rolamento (Y-Bearing, UCP, UCF, etc.)
        if (mancal.unidade_rolamento) {
            detailsHtml += `
                <div class="table-container">
                    <table><thead><tr><th>Componente</th><th>Designação</th></tr></thead><tbody>
                        <tr><td>Rolamento de Inserção</td><td>${mancal.unidade_rolamento.rolamento_inserido}</td></tr>
                        <tr><td>Método de Fixação</td><td>${mancal.unidade_rolamento.metodo_fixacao}</td></tr>
                    </tbody></table>
                </div>`;
        }
        
        if (mancal.notas_tecnicas) {
             detailsHtml += `<br><p><strong>Nota:</strong> ${mancal.notas_tecnicas}</p>`;
        }
        resultsContainer.innerHTML = detailsHtml;
    }

    function showInitialMessage() {
        resultsContainer.innerHTML = '<h2><i class="fas fa-hand-pointer"></i> Bem-vindo!</h2><p>Use a barra de busca acima para filtrar e encontrar as especificações do mancal que você precisa.</p>';
    }

    function showErrorMessage(message) {
        resultsContainer.innerHTML = `<div class="card error-message">${message}</div>`;
    }

    // --- LÓGICA DO TEMA ---
    function setupTheme() {
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggle.checked = true;
        }
        themeToggle.addEventListener('change', () => {
            document.body.classList.toggle('dark-theme');
            if (document.body.classList.contains('dark-theme')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.removeItem('theme');
            }
        });
    }

    // --- PONTO DE ENTRADA DA APLICAÇÃO ---
    initializeApp();
});

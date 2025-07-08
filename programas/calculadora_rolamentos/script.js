// Envolvemos toda a lógica em um Event Listener que garante que o HTML foi carregado.
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. SELEÇÃO DE ELEMENTOS DO DOM ---
    const specInput = document.getElementById('bearing-spec');
    const calculateBtn = document.getElementById('calculate-btn');
    const boreSearchInput = document.getElementById('bore-diameter-search');
    const searchByBoreBtn = document.getElementById('search-by-bore-btn');
    const clearBtn = document.getElementById('clear-btn');
    const resultDisplay = document.getElementById('result-display');
    const copyBtn = document.getElementById('copy-btn');
    const themeToggle = document.getElementById('theme-toggle-checkbox');
    let rolamentosDB = [];

    // --- 2. FUNÇÕES DE CARREGAMENTO E INICIALIZAÇÃO ---
    async function loadData() {
        try {
            const response = await fetch('rolamentos.json');
            if (!response.ok) throw new Error(`Erro HTTP! status: ${response.status}`);
            rolamentosDB = await response.json();
        } catch (error) {
            console.error("Falha fatal ao carregar o banco de dados de rolamentos:", error);
            displayMessage('Erro crítico: Não foi possível carregar a base de dados. Verifique o console para mais detalhes.', 'error');
        }
    }

    function loadTheme() {
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggle.checked = true;
        }
    }
    
    async function init() {
        loadTheme();
        await loadData();
        setupEventListeners();
    }

    // --- 3. FUNÇÕES DE EXIBIÇÃO ---
    function displayMessage(label, type, value = '-') {
        resultDisplay.innerHTML = `
            <div class="result-item ${type}">
                <span class="label">${label}</span>
                <span class="value" id="result-value">${value}</span>
            </div>
        `;
        copyBtn.style.display = (type === 'success' && value !== '-') ? 'block' : 'none';
    }

    // ***** FUNÇÃO ATUALIZADA *****
    function displayBearingDetails(data) {
        // Verifica se a largura é 'B' (padrão) ou 'T' (cônicos)
        const larguraLabel = data.T ? 'Largura Total (T)' : 'Largura (B)';
        const larguraValue = data.T || data.B;
        
        // Cria uma nota especial se o rolamento for cônico
        let specialNote = '';
        if (data.tipo && data.tipo.includes('Cônico')) {
            specialNote = `
                <div class="result-item warning">
                    <span class="label"><i class="fa-solid fa-triangle-exclamation"></i> Nota sobre Rolos Cônicos</span>
                    <span class="value" style="font-size: 1rem; font-family: 'Roboto', sans-serif;">Este rolamento é composto por duas partes (cone + capa) que podem ter designações diferentes.</span>
                </div>
            `;
        }

        resultDisplay.innerHTML = `
            <div class="result-item success">
                <span class="label">Rolamento Encontrado:</span>
                <span class="value" id="result-value">${data.designacao}</span>
            </div>
            <div class="results-grid-main">
                <div class="result-item"><span class="label">Tipo</span><span class="value">${data.tipo}</span></div>
                <div class="result-item"><span class="label">Diâmetro do Furo (d)</span><span class="value">${data.d} mm</span></div>
                <div class="result-item"><span class="label">Diâmetro Externo (D)</span><span class="value">${data.D} mm</span></div>
                <div class="result-item"><span class="label">${larguraLabel}</span><span class="value">${larguraValue} mm</span></div>
            </div>
            ${specialNote}
        `;
        copyBtn.style.display = 'block';
    }
    
    function displayReverseSearchResults(results, boreSize) {
        resultDisplay.innerHTML = `
            <div class="result-item success">
                <span class="label">${results.length} rolamento(s) encontrado(s) com furo de:</span>
                <span class="value">${boreSize} mm</span>
            </div>
            <div class="table-container">
                <table>
                    <thead><tr><th>Designação</th><th>Tipo</th><th>Ext. (D)</th><th>Larg. (T/B)</th></tr></thead>
                    <tbody>
                        ${results.map(b => `<tr>
                            <td><strong>${b.designacao}</strong></td>
                            <td>${b.tipo}</td>
                            <td>${b.D} mm</td>
                            <td>${b.T || b.B} mm</td>
                        </tr>`).join('')}
                    </tbody>
                </table>
            </div>`;
        copyBtn.style.display = 'none';
    }

    // --- 4. FUNÇÕES PRINCIPAIS DE LÓGICA ---
    function handleDirectSearch() {
        toggleLoading(calculateBtn, true, '<i class="fa-solid fa-spinner fa-spin"></i> Consultando...');
        const spec = specInput.value.trim().toUpperCase();

        if (!spec) {
            displayMessage('Por favor, digite uma especificação.', 'warning');
        } else {
            const bearingData = rolamentosDB.find(b => b.designacao === spec);
            if (bearingData) {
                displayBearingDetails(bearingData);
            } else {
                displayMessage(`Rolamento '${spec}' não encontrado na base de dados.`, 'warning', 'Verificar Catálogo');
            }
        }
        toggleLoading(calculateBtn, false, '<i class="fa-solid fa-calculator"></i> Consultar');
    }

    function handleReverseSearch() {
        toggleLoading(searchByBoreBtn, true, '<i class="fa-solid fa-spinner fa-spin"></i> Procurando...');
        const boreSize = parseInt(boreSearchInput.value, 10);

        if (isNaN(boreSize) || boreSize <= 0) {
            displayMessage('Por favor, insira um diâmetro de furo válido.', 'error');
        } else {
            const results = rolamentosDB.filter(b => b.d === boreSize);
            if (results.length > 0) {
                displayReverseSearchResults(results, boreSize);
            } else {
                displayMessage(`Nenhum rolamento encontrado com furo de ${boreSize} mm.`, 'warning');
            }
        }
        toggleLoading(searchByBoreBtn, false, '<i class="fa-solid fa-search"></i> Procurar');
    }

    // --- 5. FUNÇÕES AUXILIARES ---
    function clearAll() {
        specInput.value = '';
        boreSearchInput.value = '';
        displayMessage('Aguardando consulta...', '');
        specInput.focus();
    }

    function toggleLoading(button, isLoading, loadingText) {
        button.disabled = isLoading;
        if (isLoading) {
            button.innerHTML = loadingText;
        } else {
            button.innerHTML = button.id === 'calculate-btn' ?
                '<i class="fa-solid fa-calculator"></i> Consultar' :
                '<i class="fa-solid fa-search"></i> Procurar';
        }
    }
    
    // --- 6. CONFIGURAÇÃO DOS EVENT LISTENERS ---
    function setupEventListeners() {
        calculateBtn.addEventListener('click', handleDirectSearch);
        searchByBoreBtn.addEventListener('click', handleReverseSearch);
        clearBtn.addEventListener('click', clearAll);
        
        specInput.addEventListener('keyup', (e) => e.key === 'Enter' && handleDirectSearch());
        boreSearchInput.addEventListener('keyup', (e) => e.key === 'Enter' && handleReverseSearch());
        
        copyBtn.addEventListener('click', () => {
            const resultValue = document.getElementById('result-value')?.innerText;
            if (resultValue) {
                navigator.clipboard.writeText(resultValue).then(() => {
                    const originalIcon = copyBtn.innerHTML;
                    copyBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
                    setTimeout(() => { copyBtn.innerHTML = originalIcon; }, 1500);
                });
            }
        });

        themeToggle.addEventListener('change', () => {
            document.body.classList.toggle('dark-theme');
            localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
        });
    }

    // --- INICIALIZAÇÃO ---
    init();
});

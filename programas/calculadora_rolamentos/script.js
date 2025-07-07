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
    let rolamentosDB = []; // Variável para armazenar os dados do JSON

    // --- 2. CARREGAMENTO DE DADOS E TEMA ---
    async function loadData() {
        try {
            const response = await fetch('rolamentos.json'); // Busca o arquivo JSON
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            rolamentosDB = await response.json(); // Carrega os dados para a variável rolamentosDB
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

    function displayBearingDetails(data) {
        resultDisplay.innerHTML = `
            <div class="result-item success">
                <span class="label">Rolamento Encontrado:</span>
                <span class="value" id="result-value">${data.designacao}</span>
            </div>
            <div class="results-grid-main">
                <div class="result-item"><span class="label">Tipo</span><span class="value">${data.tipo}</span></div>
                <div class="result-item"><span class="label">Diâmetro do Furo (d)</span><span class="value">${data.d} mm</span></div>
                <div class="result-item"><span class="label">Diâmetro Externo (D)</span><span class="value">${data.D} mm</span></div>
                <div class="result-item"><span class="label">Largura (B)</span><span class="value">${data.B} mm</span></div>
            </div>
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
                    <thead><tr><th>Designação</th><th>Tipo</th><th>Ext. (D)</th><th>Larg. (B)</th></tr></thead>
                    <tbody>
                        ${results.map(b => `<tr>
                            <td><strong>${b.designacao}</strong></td>
                            <td>${b.tipo}</td>
                            <td>${b.D} mm</td>
                            <td>${b.B} mm</td>
                        </tr>`).join('')}
                    </tbody>
                </table>
            </div>`;
        copyBtn.style.display = 'none';
    }

    // --- 4. FUNÇÕES PRINCIPAIS DE LÓGICA ---

    // Nova função para calcular o furo baseada na especificação (lógica do Python)
    function calcularFuroRolamentoPorRegra(especificacao) {
        if (typeof especificacao !== 'string' || especificacao.length < 2) {
            return { error: `Erro: A especificação do rolamento deve ser um texto com pelo menos 2 caracteres.`, type: 'error' };
        }

        try {
            const codigoFuroStr = especificacao.slice(-2);
            const codigoFuroInt = parseInt(codigoFuroStr, 10);

            if (isNaN(codigoFuroInt)) {
                return { error: `Erro: Os dois últimos caracteres da especificação ('${codigoFuroStr}') devem ser numéricos.`, type: 'error' };
            }

            let diametro;
            let mensagem;
            let tipo = 'success';

            if (codigoFuroInt === 0) {
                diametro = 10;
                mensagem = `Furo de ${diametro} mm (código 00).`;
            } else if (codigoFuroInt === 1) {
                diametro = 12;
                mensagem = `Furo de ${diametro} mm (código 01).`;
            } else if (codigoFuroInt === 2) {
                diametro = 15;
                mensagem = `Furo de ${diametro} mm (código 02).`;
            } else if (codigoFuroInt === 3) {
                diametro = 17;
                mensagem = `Furo de ${diametro} mm (código 03).`;
            } else if (codigoFuroInt >= 4 && codigoFuroInt <= 96) {
                diametro = codigoFuroInt * 5;
                mensagem = `Furo de ${diametro} mm (código ${codigoFuroStr}).`;
            } else {
                mensagem = `Código '${codigoFuroStr}' não segue a regra padrão de multiplicação. Verifique o catálogo do fabricante.`;
                tipo = 'warning';
                diametro = null; // Indica que não foi possível calcular o diâmetro exato
            }
            return { success: `Rolamento '${especificacao}': ${mensagem}`, diameter: diametro, type: tipo };

        } catch (e) {
            return { error: `Ocorreu um erro inesperado no cálculo: ${e.message}`, type: 'error' };
        }
    }

    async function handleDirectSearch() {
        toggleLoading(calculateBtn, true, '<i class="fa-solid fa-spinner fa-spin"></i> Consultando...');
        const spec = specInput.value.trim().toUpperCase();

        if (!spec) {
            displayMessage('Por favor, digite uma especificação.', 'warning');
            toggleLoading(calculateBtn, false, '<i class="fa-solid fa-calculator"></i> Consultar');
            return;
        }

        // 1. Tenta encontrar o rolamento na base de dados (JSON)
        const bearingData = rolamentosDB.find(b => b.designacao === spec);

        if (bearingData) {
            // Se encontrou no JSON, exibe os detalhes completos
            displayBearingDetails(bearingData);
        } else {
            // Se não encontrou no JSON, tenta calcular o furo pela regra
            const calculationResult = calcularFuroRolamentoPorRegra(spec);

            if (calculationResult.success) {
                // Se o cálculo pela regra foi bem-sucedido, exibe o resultado do cálculo
                displayMessage(`Rolamento '${spec}': ${calculationResult.success}`, calculationResult.type, calculationResult.diameter ? `${calculationResult.diameter} mm` : 'Não Calculado');
            } else if (calculationResult.error) {
                // Se houve um erro no cálculo pela regra
                displayMessage(calculationResult.error, calculationResult.type);
            } else {
                // Se a regra não aplicou ou deu uma mensagem de aviso
                displayMessage(`Rolamento '${spec}': ${calculationResult.message || 'Não encontrado na base de dados e não segue regra padrão.'}`, calculationResult.type, 'Verificar Catálogo');
            }
        }
        toggleLoading(calculateBtn, false, '<i class="fa-solid fa-calculator"></i> Consultar');
    }

    async function handleReverseSearch() {
        toggleLoading(searchByBoreBtn, true, '<i class="fa-solid fa-spinner fa-spin"></i> Procurando...');
        const boreSize = parseInt(boreSearchInput.value, 10);

        if (isNaN(boreSize) || boreSize <= 0) {
            displayMessage('Por favor, insira um diâmetro de furo válido.', 'error');
            toggleLoading(searchByBoreBtn, false, '<i class="fa-solid fa-search"></i> Procurar');
            return;
        }

        // Filtra os rolamentos no banco de dados carregado do JSON pelo diâmetro do furo
        const results = rolamentosDB.filter(b => b.d === boreSize);

        if (results.length > 0) {
            displayReverseSearchResults(results, boreSize);
        } else {
            displayMessage(`Nenhum rolamento encontrado com furo de ${boreSize} mm na base de dados.`, 'warning');
        }
        toggleLoading(searchByBoreBtn, false, '<i class="fa-solid fa-search"></i> Procurar');
    }

    // --- 5. FUNÇÕES AUXILIARES ---
    function clearAll() {
        specInput.value = '';
        boreSearchInput.value = '';
        displayMessage('Aguardando consulta...', '');
        copyBtn.style.display = 'none'; // Garante que o botão copiar seja ocultado ao limpar
        specInput.focus();
    }

    function toggleLoading(button, isLoading, loadingText) {
        button.disabled = isLoading;
        if (isLoading) {
            button.innerHTML = loadingText;
        } else {
            // Retorna o texto original
            button.innerHTML = button.id === 'calculate-btn' ?
                '<i class="fa-solid fa-calculator"></i> Consultar' :
                '<i class="fa-solid fa-search"></i> Procurar';
        }
    }
    
    // --- 6. EVENT LISTENERS ---
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

    // --- INICIALIZAÇÃO ---
    loadData(); // Carrega os dados do JSON quando a página é carregada
    loadTheme();
});

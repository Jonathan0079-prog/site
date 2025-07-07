document.addEventListener('DOMContentLoaded', () => {

    // --- 1. SELEÇÃO DE ELEMENTOS DO DOM ---
    const specInput = document.getElementById('bearing-spec');
    const calculateBtn = document.getElementById('calculate-btn');
    const boreSearchInput = document.getElementById('bore-diameter-search');
    const outerDiameterSearchInput = document.getElementById('outer-diameter-search');
    const widthSearchInput = document.getElementById('width-search');
    const searchByBoreBtn = document.getElementById('search-by-bore-btn');
    const clearBtn = document.getElementById('clear-btn');
    const resultDisplay = document.getElementById('result-display');
    const copyBtn = document.getElementById('copy-btn');
    const themeToggle = document.getElementById('theme-toggle-checkbox');
    let rolamentosDB = [];

    // --- 2. CARREGAMENTO DE DADOS E TEMA ---
    async function loadData() {
        try {
            const response = await fetch('rolamentos.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            rolamentosDB = await response.json();
        } catch (error) {
            console.error("Falha fatal ao carregar o banco de dados de rolamentos:", error);
            displayMessage('Erro crítico: Não foi possível carregar a base de dados.', 'error');
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
                <div class="result-item"><span class="label">Furo (d)</span><span class="value">${data.d} mm</span></div>
                <div class="result-item"><span class="label">Externo (D)</span><span class="value">${data.D} mm</span></div>
                <div class="result-item"><span class="label">Largura (B)</span><span class="value">${data.B} mm</span></div>
            </div>
            <hr>
            <h4>Especificações Técnicas</h4>
            <div class="results-grid-secondary">
                <div class="result-item"><span class="label">Carga Din. (C)</span><span class="value">${data.C} kN</span></div>
                <div class="result-item"><span class="label">Carga Est. (C0)</span><span class="value">${data.C0} kN</span></div>
                <div class="result-item"><span class="label">RPM Limite</span><span class="value">${data.limite_rpm.toLocaleString('pt-BR')}</span></div>
                <div class="result-item"><span class="label">Massa</span><span class="value">${data.massa} kg</span></div>
            </div>
        `;
        copyBtn.style.display = 'block';
    }
    
    function displayReverseSearchResults(results, params) {
        const title = `Busca por ${params.join(', ')}`;
        resultDisplay.innerHTML = `
            <div class="result-item success">
                <span class="label">${results.length} rolamento(s) encontrado(s) para:</span>
                <span class="value">${title}</span>
            </div>
            <div class="table-container">
                <table>
                    <thead><tr><th>Designação</th><th>Tipo</th><th>d</th><th>D</th><th>B</th></tr></thead>
                    <tbody>
                        ${results.map(b => `<tr>
                            <td><strong>${b.designacao}</strong></td>
                            <td>${b.tipo}</td>
                            <td>${b.d}</td>
                            <td>${b.D}</td>
                            <td>${b.B}</td>
                        </tr>`).join('')}
                    </tbody>
                </table>
            </div>`;
        copyBtn.style.display = 'none';
    }

    // --- 4. FUNÇÕES PRINCIPAIS DE LÓGICA ---
    function calcularFuroRolamentoPorRegra(especificacao) {
        if (typeof especificacao !== 'string' || especificacao.length < 2) {
            return { error: `Erro: A especificação deve ter pelo menos 2 caracteres.`, type: 'error' };
        }
        try {
            const codigoFuroStr = especificacao.slice(-2);
            const codigoFuroInt = parseInt(codigoFuroStr, 10);
            if (isNaN(codigoFuroInt)) return { error: `Erro: Os dois últimos caracteres ('${codigoFuroStr}') devem ser numéricos.`, type: 'error' };

            let diametro, mensagem, tipo = 'success';
            if (codigoFuroInt === 0) diametro = 10;
            else if (codigoFuroInt === 1) diametro = 12;
            else if (codigoFuroInt === 2) diametro = 15;
            else if (codigoFuroInt === 3) diametro = 17;
            else if (codigoFuroInt >= 4 && codigoFuroInt <= 96) diametro = codigoFuroInt * 5;
            else {
                mensagem = `Código '${codigoFuroStr}' não segue a regra padrão. Verifique o catálogo.`;
                tipo = 'warning';
                diametro = null;
            }
            if (!mensagem) mensagem = `Furo de ${diametro} mm (código ${codigoFuroStr}).`;
            return { success: mensagem, diameter: diametro, type: tipo };
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

        const bearingData = rolamentosDB.find(b => b.designacao === spec);
        if (bearingData) {
            displayBearingDetails(bearingData);
        } else {
            const calcResult = calcularFuroRolamentoPorRegra(spec);
            if (calcResult.success) {
                displayMessage(`Rolamento '${spec}': ${calcResult.success}`, calcResult.type, calcResult.diameter ? `${calcResult.diameter} mm` : 'Não Calculado');
            } else {
                displayMessage(calcResult.error || `Não encontrado na base de dados e não segue regra padrão.`, calcResult.type || 'warning');
            }
        }
        toggleLoading(calculateBtn, false, '<i class="fa-solid fa-calculator"></i> Consultar');
    }

    async function handleReverseSearch() {
        toggleLoading(searchByBoreBtn, true, '<i class="fa-solid fa-spinner fa-spin"></i> Procurando...');
        const d = parseFloat(boreSearchInput.value) || null;
        const D = parseFloat(outerDiameterSearchInput.value) || null;
        const B = parseFloat(widthSearchInput.value) || null;

        if (!d && !D && !B) {
            displayMessage('Insira pelo menos uma medida para a busca.', 'error');
            toggleLoading(searchByBoreBtn, false, '<i class="fa-solid fa-search"></i> Procurar');
            return;
        }

        let searchParams = [];
        if (d) searchParams.push(`d=${d}mm`);
        if (D) searchParams.push(`D=${D}mm`);
        if (B) searchParams.push(`B=${B}mm`);

        const results = rolamentosDB.filter(b => {
            return (!d || b.d === d) &&
                   (!D || b.D === D) &&
                   (!B || b.B === B);
        });

        if (results.length > 0) {
            displayReverseSearchResults(results, searchParams);
        } else {
            displayMessage(`Nenhum rolamento encontrado com os critérios fornecidos.`, 'warning');
        }
        toggleLoading(searchByBoreBtn, false, '<i class="fa-solid fa-search"></i> Procurar');
    }

    // --- 5. FUNÇÕES AUXILIARES ---
    function clearAll() {
        specInput.value = '';
        boreSearchInput.value = '';
        outerDiameterSearchInput.value = '';
        widthSearchInput.value = '';
        displayMessage('Aguardando consulta...', '');
        copyBtn.style.display = 'none';
        specInput.focus();
    }

    function toggleLoading(button, isLoading, loadingText) {
        button.disabled = isLoading;
        button.innerHTML = isLoading ? loadingText : (button.id === 'calculate-btn' ? '<i class="fa-solid fa-calculator"></i> Consultar' : '<i class="fa-solid fa-search"></i> Procurar');
    }
    
    // --- 6. EVENT LISTENERS ---
    calculateBtn.addEventListener('click', handleDirectSearch);
    searchByBoreBtn.addEventListener('click', handleReverseSearch);
    clearBtn.addEventListener('click', clearAll);
    
    specInput.addEventListener('keyup', (e) => e.key === 'Enter' && handleDirectSearch());
    boreSearchInput.addEventListener('keyup', (e) => e.key === 'Enter' && handleReverseSearch());
    outerDiameterSearchInput.addEventListener('keyup', (e) => e.key === 'Enter' && handleReverseSearch());
    widthSearchInput.addEventListener('keyup', (e) => e.key === 'Enter' && handleReverseSearch());
    
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
    loadData();
    loadTheme();
});

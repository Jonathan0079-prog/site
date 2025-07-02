// script.js

import { tabelaSimilaridade, matrizCompatibilidade } from './data/database.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- Seleção de Elementos DOM ---
    const marcaSelect = document.getElementById('marca-select');
    const oleoSelect = document.getElementById('oleo-select');
    const searchButton = document.getElementById('search-button');
    const resultsContainer = document.getElementById('results-container');
    const calculatorSearchResultsContainer = document.getElementById('calculator-search-results-container');
    
    const tempOperacaoInput = document.getElementById('temp-operacao');
    const tipoEquipamentoSelect = document.getElementById('tipo-equipamento');
    const calculateButton = document.getElementById('calculate-button');
    const calculatorResultDiv = document.getElementById('calculator-result');
    const recommendedVgText = document.getElementById('recommended-vg-text');
    const justificationText = document.getElementById('calculator-justification'); // NOVO
    const findOilsButton = document.getElementById('find-oils-button');

    const modal = document.getElementById('compatibility-modal');
    // ... (outros elementos da modal e do planner)

    // =======================================================
    //          LÓGICA DA CALCULADORA (APRIMORADA)
    // =======================================================
    function calcularViscosidade() {
        const temp = parseFloat(tempOperacaoInput.value);
        const tipo = tipoEquipamentoSelect.value;
        if (isNaN(temp) || !tipo) { /* ... (validação) ... */ return; }

        let vgRecomendado = 'N/A';
        let justification = '';

        if (tipo === 'redutor_paralelo') {
            if (temp < 40) vgRecomendado = '150'; else if (temp < 60) vgRecomendado = '220'; else if (temp < 80) vgRecomendado = '320'; else vgRecomendado = '460';
            justification = 'Redutores de eixos paralelos em temperaturas mais altas exigem maior viscosidade para garantir a película protetora nas engrenagens.';
        } else if (tipo === 'redutor_semfim') {
            if (temp < 40) vgRecomendado = '320'; else if (temp < 70) vgRecomendado = '460'; else vgRecomendado = '680';
            justification = 'O atrito de deslizamento em redutores coroa/sem-fim gera mais calor, necessitando de óleos mais viscosos para proteção contra o desgaste.';
        } else if (tipo === 'hidraulico_palhetas') {
            if (temp < 50) vgRecomendado = '32'; else if (temp < 70) vgRecomendado = '46'; else vgRecomendado = '68';
            justification = 'Bombas de palhetas são sensíveis à viscosidade. Um óleo muito espesso pode causar cavitação; um muito fino pode causar vazamentos internos e desgaste.';
        } else if (tipo === 'hidraulico_pistoes') {
            if (temp < 55) vgRecomendado = '46'; else if (temp < 75) vgRecomendado = '68'; else vgRecomendado = '100';
            justification = 'Bombas de pistões operam com altas pressões e se beneficiam de óleos um pouco mais viscosos para garantir a vedação e a lubrificação ideal.';
        } else if (tipo === 'mancal_deslizamento') {
             if (temp < 50) vgRecomendado = '68'; else if (temp < 70) vgRecomendado = '100'; else vgRecomendado = '150';
             justification = 'Para mancais de deslizamento, a viscosidade deve ser suficiente para manter um filme hidrodinâmico completo, que se torna mais difícil com o aumento da temperatura.';
        }

        recommendedVgText.textContent = `ISO VG ${vgRecomendado}`;
        justificationText.textContent = justification; // Exibe a justificativa
        findOilsButton.classList.remove('hidden');
        calculatorResultDiv.classList.remove('hidden');
        findOilsButton.onclick = () => buscarPorViscosidade(vgRecomendado, calculatorSearchResultsContainer);
    }

    // =======================================================
    //          LÓGICA DE BUSCA (APRIMORADA)
    // =======================================================
    // A função de busca agora mostra os novos dados técnicos
    function buscarPorViscosidade(viscosidade, container) {
        const gruposEncontrados = tabelaSimilaridade.filter(grupo => grupo.ISO_VG === viscosidade);
        container.innerHTML = '';
        if (gruposEncontrados.length === 0) { /* ... (mensagem de erro) ... */ return; }

        let htmlResultados = `<h3 class="results-header">Óleos Encontrados para ISO VG ${viscosidade}</h3>`;
        gruposEncontrados.forEach(grupo => {
            htmlResultados += `<div class="product-card"><h4>Aplicação: ${grupo.APLICACAO}</h4><ul class="results-list">`;
            for (const marca in grupo.PRODUTOS) {
                const produto = grupo.PRODUTOS[marca];
                htmlResultados += `
                    <li>
                        <div class="list-item-header">
                            <div class="product-details">
                                <span class="brand">${marca}:</span>
                                <span class="product">${produto.NOME}</span>
                            </div>
                        </div>
                        <div class="tech-data-grid">
                            <div class="tech-data-item"><span class="label">BASE</span><span class="value">${produto.BASE}</span></div>
                            <div class="tech-data-item"><span class="label">ÍNDICE VISC.</span><span class="value">${produto.IV}</span></div>
                            <div class="tech-data-item"><span class="label">P. FULGOR</span><span class="value">${produto.PONTO_FULGOR}°C</span></div>
                            <div class="tech-data-item"><span class="label">P. FLUIDEZ</span><span class="value">${produto.PONTO_FLUIDEZ}°C</span></div>
                        </div>
                    </li>`;
            }
            htmlResultados += `</ul></div>`;
        });
        container.innerHTML = htmlResultados;
        container.scrollIntoView({ behavior: 'smooth' });
    }

    // A função de exibir resultados também foi aprimorada
    function exibirResultados(grupo, marcaOriginal) {
        const produtoOriginal = grupo.PRODUTOS[marcaOriginal];
        const substitutos = { ...grupo.PRODUTOS };
        delete substitutos[marcaOriginal];

        let htmlResultados = `
            <h3 class="results-header">Análise de Equivalência</h3>
            <div class="product-card original">
                <h4>Seu Produto: ${produtoOriginal.NOME} (${marcaOriginal})</h4>
                <p><strong>Aplicação:</strong> ${grupo.APLICACAO}</p>
                <div class="tech-data-grid">
                    <div class="tech-data-item"><span class="label">ISO VG</span><span class="value">${grupo.ISO_VG}</span></div>
                    <div class="tech-data-item"><span class="label">BASE</span><span class="value">${produtoOriginal.BASE}</span></div>
                    <div class="tech-data-item"><span class="label">ÍNDICE VISC.</span><span class="value">${produtoOriginal.IV}</span></div>
                    <div class="tech-data-item"><span class="label">P. FULGOR</span><span class="value">${produtoOriginal.PONTO_FULGOR}°C</span></div>
                    <div class="tech-data-item"><span class="label">P. FLUIDEZ</span><span class="value">${produtoOriginal.PONTO_FLUIDEZ}°C</span></div>
                </div>
            </div>
            <h4 class="equivalents-title">Produtos Equivalentes Recomendados:</h4>
            <ul class="results-list">`;
        
        if (Object.keys(substitutos).length === 0) { /* ... */ } else {
            for (const marcaSubstituto in substitutos) {
                const produtoSubstituto = substitutos[marcaSubstituto];
                const infoCompat = matrizCompatibilidade[produtoOriginal.BASE]?.[produtoSubstituto.BASE] || { status: "Desconhecido", descricao: "..." };
                // ... (lógica de compatibilidade)
                htmlResultados += `
                    <li>
                        <div class="list-item-header">
                            <div class="product-details">
                                <span class="brand">${marcaSubstituto}:</span>
                                <span class="product">${produtoSubstituto.NOME}</span>
                            </div>
                            <div class="compatibility-info ...">
                                </div>
                        </div>
                        <div class="tech-data-grid">
                            <div class="tech-data-item"><span class="label">BASE</span><span class="value">${produtoSubstituto.BASE}</span></div>
                            <div class="tech-data-item"><span class="label">ÍNDICE VISC.</span><span class="value">${produtoSubstituto.IV}</span></div>
                            <div class="tech-data-item"><span class="label">P. FULGOR</span><span class="value">${produtoSubstituto.PONTO_FULGOR}°C</span></div>
                            <div class="tech-data-item"><span class="label">P. FLUIDEZ</span><span class="value">${produtoSubstituto.PONTO_FLUIDEZ}°C</span></div>
                        </div>
                    </li>`;
            }
        }
        
        htmlResultados += `</ul><div class="warning-message">...</div>`;
        resultsContainer.innerHTML = htmlResultados;
        // ... (adiciona listeners para os ícones)
    }

    // ... (restante do código: popularMarcas, encontrarSubstitutos, listeners, inicialização, etc.)
});

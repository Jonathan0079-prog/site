// script.js

import { tabelaSimilaridade, matrizCompatibilidade } from './data/database.js';

document.addEventListener('DOMContentLoaded', () => {
    // Variáveis do Buscador de Equivalentes
    const marcaSelect = document.getElementById('marca-select');
    const oleoSelect = document.getElementById('oleo-select');
    const searchButton = document.getElementById('search-button');
    const resultsContainer = document.getElementById('results-container');
    
    // Variáveis da Calculadora de Viscosidade
    const tempOperacaoInput = document.getElementById('temp-operacao');
    const tipoEquipamentoSelect = document.getElementById('tipo-equipamento');
    const calculateButton = document.getElementById('calculate-button');
    const calculatorResultDiv = document.getElementById('calculator-result');
    const recommendedVgText = document.getElementById('recommended-vg-text');
    const findOilsButton = document.getElementById('find-oils-button');

    // =======================================================
    //          LÓGICA DA CALCULADORA (ATUALIZADA)
    // =======================================================
    function calcularViscosidade() {
        const temp = parseFloat(tempOperacaoInput.value);
        const tipo = tipoEquipamentoSelect.value;

        if (isNaN(temp) || !tipo) {
            alert('Por favor, preencha todos os campos da calculadora.');
            return;
        }

        let vgRecomendado = 'N/A';

        // Lógica de recomendação (pode ser refinada)
        if (tipo === 'redutor_paralelo') {
            if (temp < 40) vgRecomendado = '150'; else if (temp < 60) vgRecomendado = '220'; else if (temp < 80) vgRecomendado = '320'; else vgRecomendado = '460';
        } else if (tipo === 'redutor_semfim') {
            if (temp < 40) vgRecomendado = '320'; else if (temp < 70) vgRecomendado = '460'; else vgRecomendado = '680';
        } else if (tipo === 'hidraulico_palhetas') {
            if (temp < 50) vgRecomendado = '32'; else if (temp < 70) vgRecomendado = '46'; else vgRecomendado = '68';
        } else if (tipo === 'hidraulico_pistoes') {
            if (temp < 55) vgRecomendado = '46'; else if (temp < 75) vgRecomendado = '68'; else vgRecomendado = '100';
        } else if (tipo === 'mancal_deslizamento') {
             if (temp < 50) vgRecomendado = '68'; else if (temp < 70) vgRecomendado = '100'; else vgRecomendado = '150';
        }

        // Exibe o resultado e o novo botão
        recommendedVgText.textContent = `ISO VG ${vgRecomendado}`;
        findOilsButton.classList.remove('hidden');
        calculatorResultDiv.classList.remove('hidden');

        // Adiciona um listener de evento ao botão recém-exibido
        findOilsButton.onclick = () => buscarPorViscosidade(vgRecomendado);
    }

    // =======================================================
    //      NOVA FUNÇÃO PARA BUSCAR POR VISCOSIDADE
    // =======================================================
    function buscarPorViscosidade(viscosidade) {
        // Encontra todos os grupos de produtos que correspondem à viscosidade
        const gruposEncontrados = tabelaSimilaridade.filter(grupo => grupo.ISO_VG === viscosidade);

        resultsContainer.innerHTML = ''; // Limpa resultados anteriores

        if (gruposEncontrados.length === 0) {
            resultsContainer.innerHTML = `<p class="error-message">Nenhum óleo com viscosidade ISO VG ${viscosidade} encontrado na base de dados.</p>`;
            return;
        }

        let htmlResultados = `<h3 class="results-header">Óleos Encontrados para ISO VG ${viscosidade}</h3>`;

        gruposEncontrados.forEach(grupo => {
            htmlResultados += `
                <div class="product-card">
                    <h4>Aplicação: ${grupo.APLICACAO}</h4>
                    <ul class="results-list">
            `;
            for (const marca in grupo.PRODUTOS) {
                const produto = grupo.PRODUTOS[marca];
                htmlResultados += `
                        <li>
                            <div class="product-details">
                                <span class="brand">${marca}:</span>
                                <span class="product">${produto.NOME}</span>
                                <span class="tech-info">Base: ${produto.BASE}</span>
                            </div>
                        </li>
                `;
            }
            htmlResultados += `</ul></div>`;
        });
        
        resultsContainer.innerHTML = htmlResultados;
        // Rola a página suavemente até os resultados
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }

    // =======================================================
    //          LÓGICA DO BUSCADOR (SEM ALTERAÇÕES)
    // =======================================================
    function popularMarcas() {
        const marcas = new Set();
        tabelaSimilaridade.forEach(grupo => Object.keys(grupo.PRODUTOS).forEach(marca => marcas.add(marca)));
        const marcasOrdenadas = Array.from(marcas).sort();
        marcasOrdenadas.forEach(marca => {
            const option = document.createElement('option');
            option.value = marca;
            option.textContent = marca;
            marcaSelect.appendChild(option);
        });
    }

    function popularProdutosPorMarca(marcaSelecionada) {
        oleoSelect.innerHTML = '';
        oleoSelect.disabled = true;
        if (!marcaSelecionada) {
            const option = document.createElement('option');
            option.textContent = "-- Primeiro selecione uma marca --";
            oleoSelect.appendChild(option);
            return;
        }
        oleoSelect.disabled = false;
        const defaultOption = document.createElement('option');
        defaultOption.textContent = "-- Selecione o Produto --";
        defaultOption.value = "";
        oleoSelect.appendChild(defaultOption);
        const produtos = [];
        tabelaSimilaridade.forEach((grupo, index) => {
            if (grupo.PRODUTOS[marcaSelecionada]) {
                produtos.push({ nome: grupo.PRODUTOS[marcaSelecionada].NOME, grupoIndex: index });
            }
        });
        produtos.sort((a, b) => a.nome.localeCompare(b.nome));
        produtos.forEach(produto => {
            const opt = document.createElement('option');
            opt.value = produto.grupoIndex;
            opt.textContent = produto.nome;
            oleoSelect.appendChild(opt);
        });
    }
    
    function encontrarSubstitutos() {
        const marcaSelecionada = marcaSelect.value;
        const grupoIndex = oleoSelect.value;
        if (!marcaSelecionada || !grupoIndex) {
            resultsContainer.innerHTML = `<p class="error-message">Por favor, selecione uma marca e um produto.</p>`;
            return;
        }
        const grupoEncontrado = tabelaSimilaridade[parseInt(grupoIndex)];
        exibirResultados(grupoEncontrado, marcaSelecionada);
    }

    function exibirResultados(grupo, marcaOriginal) {
        const produtoOriginal = grupo.PRODUTOS[marcaOriginal];
        const substitutos = { ...grupo.PRODUTOS };
        delete substitutos[marcaOriginal];
        let htmlResultados = `
            <h3 class="results-header">Análise de Equivalência</h3>
            <div class="product-card original">
                <h4>Seu Produto:</h4>
                <p><strong>${produtoOriginal.NOME} (${marcaOriginal})</strong></p>
                <p><strong>Aplicação:</strong> ${grupo.APLICACAO}</p>
                <p><strong>ISO VG:</strong> ${grupo.ISO_VG}</p>
                <p><strong>Base:</strong> ${produtoOriginal.BASE}</p>
            </div>
            <h4 class="equivalents-title">Produtos Equivalentes Recomendados:</h4>
            <ul class="results-list">`;
        if (Object.keys(substitutos).length === 0) {
            htmlResultados += `<p>Nenhum equivalente direto encontrado em nossa base de dados.</p>`;
        } else {
            for (const marcaSubstituto in substitutos) {
                const produtoSubstituto = substitutos[marcaSubstituto];
                const compativeis = matrizCompatibilidade[produtoOriginal.BASE] || [];
                const eCompativel = compativeis.includes(produtoSubstituto.BASE);
                const compatibilidadeHTML = eCompativel ? `<span class="compat-ok">Compatível para Mistura</span>` : `<span class="compat-nok">Incompatível para Mistura (Exige Flushing)</span>`;
                htmlResultados += `
                    <li>
                        <div class="product-details">
                            <span class="brand">${marcaSubstituto}:</span>
                            <span class="product">${produtoSubstituto.NOME}</span>
                            <span class="tech-info">Base: ${produtoSubstituto.BASE} | ISO VG: ${grupo.ISO_VG}</span>
                        </div>
                        <div class="compatibility-info">${compatibilidadeHTML}</div>
                    </li>`;
            }
        }
        htmlResultados += `</ul><div class="warning-message"><strong>ATENÇÃO:</strong> A compatibilidade de mistura é uma referência. Sempre confirme na ficha técnica (TDS) e siga as boas práticas de lubrificação.</div>`;
        resultsContainer.innerHTML = htmlResultados;
    }

    // --- Event Listeners ---
    calculateButton.addEventListener('click', calcularViscosidade);
    marcaSelect.addEventListener('change', () => {
        popularProdutosPorMarca(marcaSelect.value);
        resultsContainer.innerHTML = '';
    });
    searchButton.addEventListener('click', encontrarSubstitutos);

    // --- Inicialização ---
    popularMarcas();
    popularProdutosPorMarca(''); 
});

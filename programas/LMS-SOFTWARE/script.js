// script.js

import { tabelaSimilaridade, matrizCompatibilidade } from './data/database.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- Seleção de Elementos DOM ---
    const marcaSelect = document.getElementById('marca-select');
    const oleoSelect = document.getElementById('oleo-select');
    const searchButton = document.getElementById('search-button');
    const resultsContainer = document.getElementById('results-container');
    
    const tempOperacaoInput = document.getElementById('temp-operacao');
    const tipoEquipamentoSelect = document.getElementById('tipo-equipamento');
    const calculateButton = document.getElementById('calculate-button');
    const calculatorResultDiv = document.getElementById('calculator-result');
    const recommendedVgText = document.getElementById('recommended-vg-text');
    const findOilsButton = document.getElementById('find-oils-button');

    const modal = document.getElementById('compatibility-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalCloseButton = document.getElementById('modal-close-button');


    // =======================================================
    //          LÓGICA DA MODAL DE COMPATIBILIDADE
    // =======================================================
    function exibirModalCompatibilidade(info) {
        modalTitle.textContent = info.status;
        modalTitle.className = `status-${info.status.toLowerCase()}`;
        modalDescription.textContent = info.descricao;
        modal.classList.remove('hidden');
    }

    function fecharModal() {
        modal.classList.add('hidden');
    }


    // =======================================================
    //          LÓGICA DA CALCULADORA DE VISCOSIDADE
    // =======================================================
    function calcularViscosidade() {
        // ... (lógica da calculadora continua a mesma)
        const temp = parseFloat(tempOperacaoInput.value);
        const tipo = tipoEquipamentoSelect.value;
        if (isNaN(temp) || !tipo) {
            alert('Por favor, preencha todos os campos da calculadora.');
            return;
        }
        let vgRecomendado = 'N/A';
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
        recommendedVgText.textContent = `ISO VG ${vgRecomendado}`;
        findOilsButton.classList.remove('hidden');
        calculatorResultDiv.classList.remove('hidden');
        findOilsButton.onclick = () => buscarPorViscosidade(vgRecomendado);
    }

    function buscarPorViscosidade(viscosidade) {
        // ... (lógica da busca por viscosidade continua a mesma)
        const gruposEncontrados = tabelaSimilaridade.filter(grupo => grupo.ISO_VG === viscosidade);
        resultsContainer.innerHTML = '';
        if (gruposEncontrados.length === 0) {
            resultsContainer.innerHTML = `<p class="error-message">Nenhum óleo com viscosidade ISO VG ${viscosidade} encontrado na base de dados.</p>`;
            return;
        }
        let htmlResultados = `<h3 class="results-header">Óleos Encontrados para ISO VG ${viscosidade}</h3>`;
        gruposEncontrados.forEach(grupo => {
            htmlResultados += `<div class="product-card"><h4>Aplicação: ${grupo.APLICACAO}</h4><ul class="results-list">`;
            for (const marca in grupo.PRODUTOS) {
                const produto = grupo.PRODUTOS[marca];
                htmlResultados += `<li><div class="product-details"><span class="brand">${marca}:</span><span class="product">${produto.NOME}</span><span class="tech-info">Base: ${produto.BASE}</span></div></li>`;
            }
            htmlResultados += `</ul></div>`;
        });
        resultsContainer.innerHTML = htmlResultados;
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }

    // =======================================================
    //          LÓGICA DO BUSCADOR (ATUALIZADA)
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
        // ... (lógica para popular produtos continua a mesma)
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
            htmlResultados += `<p>Nenhum equivalente direto encontrado.</p>`;
        } else {
            for (const marcaSubstituto in substitutos) {
                const produtoSubstituto = substitutos[marcaSubstituto];
                
                // --- LÓGICA DE COMPATIBILIDADE ATUALIZADA ---
                const infoCompat = matrizCompatibilidade[produtoOriginal.BASE]?.[produtoSubstituto.BASE] || { status: "Desconhecido", descricao: "A compatibilidade entre estas bases não está registrada." };
                const statusClass = `compat-${infoCompat.status.toLowerCase()}`;
                const statusText = infoCompat.status.replace("_", " ");

                htmlResultados += `
                    <li>
                        <div class="product-details">
                            <span class="brand">${marcaSubstituto}:</span>
                            <span class="product">${produtoSubstituto.NOME}</span>
                            <span class="tech-info">Base: ${produtoSubstituto.BASE} | ISO VG: ${grupo.ISO_VG}</span>
                        </div>
                        <div class="compatibility-info ${statusClass}">
                            <span>${statusText}</span>
                            <i class="fas fa-info-circle info-icon" data-compat-info='${JSON.stringify(infoCompat)}'></i>
                        </div>
                    </li>`;
            }
        }
        
        htmlResultados += `</ul><div class="warning-message"><strong>ATENÇÃO:</strong> A compatibilidade de mistura é uma referência. Sempre confirme na ficha técnica (TDS).</div>`;
        resultsContainer.innerHTML = htmlResultados;

        // Adiciona os event listeners para os novos ícones de informação
        document.querySelectorAll('.info-icon').forEach(icon => {
            icon.addEventListener('click', (e) => {
                const info = JSON.parse(e.target.getAttribute('data-compat-info'));
                exibirModalCompatibilidade(info);
            });
        });
    }

    // =======================================================
    //          EVENT LISTENERS GERAIS
    // =======================================================
    calculateButton.addEventListener('click', calcularViscosidade);
    marcaSelect.addEventListener('change', () => { popularProdutosPorMarca(marcaSelect.value); resultsContainer.innerHTML = ''; });
    searchButton.addEventListener('click', encontrarSubstitutos);
    modalCloseButton.addEventListener('click', fecharModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) fecharModal(); }); // Fecha ao clicar fora

    // --- Inicialização ---
    popularMarcas();
    popularProdutosPorMarca(''); 
});


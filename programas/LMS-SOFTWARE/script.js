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

    // =======================================================
    //          LÓGICA DA CALCULADORA DE VISCOSIDADE
    // =======================================================
    function calcularViscosidade() {
        const temp = parseFloat(tempOperacaoInput.value);
        const tipo = tipoEquipamentoSelect.value;

        if (isNaN(temp) || !tipo) {
            alert('Por favor, preencha todos os campos da calculadora.');
            return;
        }

        let vgRecomendado = 'N/A';

        // Lógica de recomendação baseada em regras práticas da indústria
        if (tipo === 'redutor_paralelo') {
            if (temp < 40) vgRecomendado = '150';
            else if (temp < 60) vgRecomendado = '220';
            else if (temp < 80) vgRecomendado = '320';
            else vgRecomendado = '460';
        } else if (tipo === 'redutor_semfim') {
            if (temp < 40) vgRecomendado = '320';
            else if (temp < 70) vgRecomendado = '460';
            else vgRecomendado = '680';
        } else if (tipo === 'hidraulico_palhetas') {
            if (temp < 50) vgRecomendado = '32';
            else if (temp < 70) vgRecomendado = '46';
            else vgRecomendado = '68';
        } else if (tipo === 'hidraulico_pistoes') {
            if (temp < 55) vgRecomendado = '46';
            else if (temp < 75) vgRecomendado = '68';
            else vgRecomendado = '100';
        } else if (tipo === 'mancal_deslizamento') {
             if (temp < 50) vgRecomendado = '68';
            else if (temp < 70) vgRecomendado = '100';
            else vgRecomendado = '150';
        }

        // Exibe o resultado
        calculatorResultDiv.innerHTML = `
            <h3>Viscosidade Recomendada:</h3>
            <p>A viscosidade ideal para a sua aplicação é:</p>
            <p class="recommended-vg">ISO VG ${vgRecomendado}</p>
        `;
        calculatorResultDiv.classList.remove('hidden');
    }

    // =======================================================
    //          LÓGICA DO BUSCADOR DE EQUIVALENTES
    // =======================================================
    function popularMarcas() {
        const marcas = new Set();
        tabelaSimilaridade.forEach(grupo => {
            Object.keys(grupo.PRODUTOS).forEach(marca => marcas.add(marca));
        });
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
                const produtoInfo = {
                    nome: grupo.PRODUTOS[marcaSelecionada].NOME,
                    grupoIndex: index
                };
                produtos.push(produtoInfo);
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

        resultsContainer.innerHTML = '';

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
            <ul class="results-list">
        `;

        if (Object.keys(substitutos).length === 0) {
            htmlResultados += `<p>Nenhum equivalente direto encontrado em nossa base de dados.</p>`;
        } else {
            for (const marcaSubstituto in substitutos) {
                const produtoSubstituto = substitutos[marcaSubstituto];
                
                const compativeis = matrizCompatibilidade[produtoOriginal.BASE] || [];
                const eCompativel = compativeis.includes(produtoSubstituto.BASE);
                const compatibilidadeHTML = eCompativel 
                    ? `<span class="compat-ok">Compatível para Mistura</span>`
                    : `<span class="compat-nok">Incompatível para Mistura (Exige Flushing)</span>`;

                htmlResultados += `
                    <li>
                        <div class="product-details">
                            <span class="brand">${marcaSubstituto}:</span>
                            <span class="product">${produtoSubstituto.NOME}</span>
                            <span class="tech-info">Base: ${produtoSubstituto.BASE} | ISO VG: ${grupo.ISO_VG}</span>
                        </div>
                        <div class="compatibility-info">${compatibilidadeHTML}</div>
                    </li>
                `;
            }
        }
        
        htmlResultados += `</ul>`;
        
        htmlResultados += `
            <div class="warning-message">
                <strong>ATENÇÃO:</strong> A compatibilidade de mistura é uma referência. Sempre confirme na ficha técnica (TDS) e siga as boas práticas de lubrificação. Em caso de troca de base (ex: Mineral para Sintético), o flushing do sistema é altamente recomendado.
            </div>
        `;
        resultsContainer.innerHTML = htmlResultados;
    }

    // =======================================================
    //          EVENT LISTENERS (OUVINTES DE EVENTOS)
    // =======================================================
    
    // Para a Calculadora
    calculateButton.addEventListener('click', calcularViscosidade);

    // Para o Buscador de Equivalentes
    marcaSelect.addEventListener('change', () => {
        popularProdutosPorMarca(marcaSelect.value);
        resultsContainer.innerHTML = '';
    });
    searchButton.addEventListener('click', encontrarSubstitutos);

    // =======================================================
    //          INICIALIZAÇÃO DA APLICAÇÃO
    // =======================================================
    popularMarcas();
    popularProdutosPorMarca(''); 
});

// script.js

import { tabelaSimilaridade, matrizCompatibilidade } from './data/database.js';

document.addEventListener('DOMContentLoaded', () => {
    const marcaSelect = document.getElementById('marca-select');
    const oleoSelect = document.getElementById('oleo-select');
    const searchButton = document.getElementById('search-button');
    const resultsContainer = document.getElementById('results-container');

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
                // Armazenamos o índice do grupo e o nome do produto para referência futura
                const produtoInfo = {
                    nome: grupo.PRODUTOS[marcaSelecionada].NOME,
                    grupoIndex: index
                };
                produtos.push(produtoInfo);
            }
        });
        
        // Ordena os produtos pelo nome
        produtos.sort((a, b) => a.nome.localeCompare(b.nome));

        produtos.forEach(produto => {
            const opt = document.createElement('option');
            // O valor agora é o índice do grupo na tabela, para fácil recuperação
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
        
        // Clona o objeto de produtos para manipulação segura
        const substitutos = { ...grupo.PRODUTOS };
        delete substitutos[marcaOriginal]; // Remove o produto original da lista de substitutos

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
                
                // Lógica simples de compatibilidade para exibição
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

    marcaSelect.addEventListener('change', () => {
        popularProdutosPorMarca(marcaSelect.value);
        resultsContainer.innerHTML = '';
    });

    searchButton.addEventListener('click', encontrarSubstitutos);

    popularMarcas();
    popularProdutosPorMarca(''); // Inicia o select de produtos como desabilitado
});

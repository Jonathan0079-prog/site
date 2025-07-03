// js/script.js

import { tabelaSimilaridade, matrizCompatibilidade } from '../data/database.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- SELEÇÃO DE ELEMENTOS DOM ---
    const applicationSelect = document.getElementById('application-select');
    const marcaSelect = document.getElementById('marca-select');
    const oleoSelect = document.getElementById('oleo-select');
    const searchButton = document.getElementById('search-button');
    const resultsContainer = document.getElementById('results-container');
    
    const modal = document.getElementById('compatibility-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalCloseButton = document.getElementById('modal-close-button');

    const accordionHeaders = document.querySelectorAll('.accordion-header');

    // --- LÓGICA DA BASE DE CONHECIMENTO ---
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            header.classList.toggle('active');
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // --- LÓGICA DA MODAL ---
    function exibirModalCompatibilidade(info) {
        modalTitle.textContent = info.status;
        modalTitle.className = `status-${info.status.toLowerCase()}`;
        modalDescription.textContent = info.descricao;
        modal.classList.remove('hidden');
    }

    function fecharModal() {
        modal.classList.add('hidden');
    }

    // --- LÓGICA DO BUSCADOR (ATUALIZADA) ---

    function resetSelect(select, message, disabled = true) {
        select.innerHTML = `<option value="">${message}</option>`;
        select.disabled = disabled;
    }

    function popularAplicacoes() {
        const aplicacoes = [...new Set(tabelaSimilaridade.map(item => item.APLICACAO))];
        aplicacoes.sort().forEach(app => {
            const option = document.createElement('option');
            option.value = app;
            option.textContent = app;
            applicationSelect.appendChild(option);
        });
    }

    function popularMarcas(aplicacaoSelecionada) {
        resetSelect(marcaSelect, '-- Selecione uma aplicação --');
        resetSelect(oleoSelect, '-- Selecione uma marca --');
        
        if (!aplicacaoSelecionada) return;

        const marcas = new Set();
        tabelaSimilaridade
            .filter(item => item.APLICACAO === aplicacaoSelecionada)
            .forEach(grupo => {
                Object.keys(grupo.PRODUTOS).forEach(marca => marcas.add(marca));
            });

        marcaSelect.innerHTML = '<option value="">-- Selecione a Marca --</option>';
        Array.from(marcas).sort().forEach(marca => {
            const option = document.createElement('option');
            option.value = marca;
            option.textContent = marca;
            marcaSelect.appendChild(option);
        });
        marcaSelect.disabled = false;
    }

    function popularProdutos(aplicacaoSelecionada, marcaSelecionada) {
        resetSelect(oleoSelect, '-- Selecione uma marca --');

        if (!marcaSelecionada) return;

        const produtos = [];
        tabelaSimilaridade
            .filter(item => item.APLICACAO === aplicacaoSelecionada)
            .forEach((grupo, index) => {
                if (grupo.PRODUTOS[marcaSelecionada]) {
                    produtos.push({
                        nome: grupo.PRODUTOS[marcaSelecionada].NOME,
                        grupoIndex: tabelaSimilaridade.indexOf(grupo) // Garante o índice correto do array original
                    });
                }
            });

        oleoSelect.innerHTML = '<option value="">-- Selecione o Produto --</option>';
        produtos.sort((a, b) => a.nome.localeCompare(b.nome)).forEach(produto => {
            const opt = document.createElement('option');
            opt.value = produto.grupoIndex;
            opt.textContent = produto.nome;
            oleoSelect.appendChild(opt);
        });
        oleoSelect.disabled = false;
    }
    
    function encontrarSubstitutos() {
        resultsContainer.innerHTML = '';
        const marcaSelecionada = marcaSelect.value;
        const grupoIndex = oleoSelect.value;
        if (!marcaSelecionada || !grupoIndex) {
            resultsContainer.innerHTML = `<p class="error-message">Por favor, selecione uma aplicação, marca e produto.</p>`;
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
                <h4>Seu Produto: ${produtoOriginal.NOME} (${marcaOriginal})</h4>
                <p><strong>Aplicação:</strong> ${grupo.APLICACAO}</p>
                <div class="tech-data-grid">
                    <div class="tech-data-item"><span class="label">ISO VG / NLGI</span><span class="value">${grupo.ISO_VG}</span></div>
                    <div class="tech-data-item"><span class="label">BASE</span><span class="value">${produtoOriginal.BASE}</span></div>
                    <div class="tech-data-item"><span class="label">ÍNDICE VISC.</span><span class="value">${produtoOriginal.IV}</span></div>
                    <div class="tech-data-item"><span class="label">P. FULGOR</span><span class="value">${produtoOriginal.PONTO_FULGOR}°C</span></div>
                    <div class="tech-data-item"><span class="label">P. FLUIDEZ</span><span class="value">${produtoOriginal.PONTO_FLUIDEZ}°C</span></div>
                </div>
            </div>
            <h4 class="equivalents-title">Produtos Equivalentes Recomendados:</h4>
            <ul class="results-list">`;
        
        if (Object.keys(substitutos).length === 0) {
             htmlResultados += `<li>Nenhum equivalente direto encontrado na base de dados.</li>`;
        } else {
            for (const marcaSubstituto in substitutos) {
                const produtoSubstituto = substitutos[marcaSubstituto];
                const infoCompat = matrizCompatibilidade[produtoOriginal.BASE]?.[produtoSubstituto.BASE] || { status: "Desconhecido", descricao: "A compatibilidade entre estas bases não está registrada." };
                const statusClass = `compat-${infoCompat.status.toLowerCase()}`;
                const statusText = infoCompat.status.replace("_", " ");

                htmlResultados += `
                    <li>
                        <div class="list-item-header">
                            <div class="product-details">
                                <span class="brand">${marcaSubstituto}:</span>
                                <span class="product">${produtoSubstituto.NOME}</span>
                            </div>
                            <div class="compatibility-info ${statusClass}">
                                <span>${statusText}</span>
                                <i class="fas fa-info-circle info-icon" data-compat-info='${JSON.stringify(infoCompat)}'></i>
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
        
        htmlResultados += `</ul><div class="warning-message"><strong>ATENÇÃO:</strong> A compatibilidade de mistura é uma referência. Sempre confirme na ficha técnica (TDS).</div>`;
        resultsContainer.innerHTML = htmlResultados;

        document.querySelectorAll('.info-icon').forEach(icon => {
            icon.addEventListener('click', (e) => {
                const info = JSON.parse(e.currentTarget.getAttribute('data-compat-info'));
                exibirModalCompatibilidade(info);
            });
        });
    }
    
    // --- EVENT LISTENERS ---
    applicationSelect.addEventListener('change', () => {
        popularMarcas(applicationSelect.value);
        resultsContainer.innerHTML = '';
    });
    
    marcaSelect.addEventListener('change', () => {
        popularProdutos(applicationSelect.value, marcaSelect.value);
        resultsContainer.innerHTML = '';
    });

    searchButton.addEventListener('click', encontrarSubstitutos);
    modalCloseButton.addEventListener('click', fecharModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) fecharModal(); });

    // --- INICIALIZAÇÃO ---
    popularAplicacoes();
});

// js/script.js

// O caminho agora sobe um nível (../) para encontrar a pasta 'data'
import { tabelaSimilaridade, matrizCompatibilidade } from '../data/database.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- SELEÇÃO DE ELEMENTOS DOM ---
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

    // --- LÓGICA DO BUSCADOR ---
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
            oleoSelect.innerHTML = '<option value="">-- Primeiro selecione uma marca --</option>';
            return;
        }
        oleoSelect.disabled = false;
        oleoSelect.innerHTML = '<option value="">-- Selecione o Produto --</option>';
        
        const produtos = [];
        tabelaSimilaridade.forEach((grupo, index) => {
            if (grupo.PRODUTOS[marcaSelecionada]) {
                produtos.push({ nome: grupo.PRODUTOS[marcaSelecionada].NOME, grupoIndex: index });
            }
        });

        produtos.sort((a, b) => a.nome.localeCompare(b.nome)).forEach(produto => {
            const opt = document.createElement('option');
            opt.value = produto.grupoIndex;
            opt.textContent = produto.nome;
            oleoSelect.appendChild(opt);
        });
    }
    
    function encontrarSubstitutos() {
        resultsContainer.innerHTML = '';
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
    marcaSelect.addEventListener('change', () => {
        popularProdutosPorMarca(marcaSelect.value);
        resultsContainer.innerHTML = '';
    });
    searchButton.addEventListener('click', encontrarSubstitutos);
    modalCloseButton.addEventListener('click', fecharModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) fecharModal(); });

    // --- INICIALIZAÇÃO ---
    popularMarcas();
});

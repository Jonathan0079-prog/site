// js/script.js (da página principal do SGL)

import { tabelaSimilaridade, matrizCompatibilidade } from '../data/database.js';

// --- BASE DE DADOS PARA OS ARTIGOS TÉCNICOS ---
const baseDeConhecimento = [
    {
        titulo: "O que é Viscosidade (ISO VG)?",
        conteudo: `
            <p>A viscosidade é a propriedade mais importante de um lubrificante. Ela mede a resistência do fluido ao escoamento. Em termos simples, é a "grossura" do óleo.</p>
            <ul>
                <li><strong>Óleos de baixa viscosidade (finos):</strong> Escoam facilmente (ex: água). São ideais para altas velocidades e baixas cargas.</li>
                <li><strong>Óleos de alta viscosidade (grossos):</strong> Escoam lentamente (ex: mel). São necessários para baixas velocidades e altas cargas, onde precisam de suportar mais pressão.</li>
            </ul>
            <p>O <strong>ISO VG (International Standards Organization Viscosity Grade)</strong> é um sistema de classificação que define a viscosidade cinemática de um óleo industrial a 40°C. Um óleo "ISO VG 46" tem uma viscosidade de 46 centistokes (cSt) a 40°C, com uma tolerância de ±10%. Escolher o ISO VG correto, conforme a recomendação do fabricante e as condições de operação, é crucial para a proteção e eficiência do equipamento.</p>
        `
    },
    {
        titulo: "Tipos de Óleo Base: Mineral vs. Sintético",
        conteudo: `
            <p>O óleo base compõe a maior parte do lubrificante e determina as suas características fundamentais.</p>
            <p><strong>Óleo Mineral:</strong> Derivado do petróleo bruto, é o tipo mais comum e económico. É excelente para uma vasta gama de aplicações industriais padrão. No entanto, possui menor resistência a temperaturas extremas e oxidação em comparação com os sintéticos.</p>
            <p><strong>Óleo Sintético (PAO - Polialfaolefina):</strong> Produzido em laboratório, oferece performance superior. Possui excelente estabilidade térmica, alto índice de viscosidade (varia menos com a temperatura) e maior vida útil. É ideal para condições severas de operação (temperaturas muito altas ou muito baixas). É compatível com óleos minerais.</p>
            <p><strong>Óleo Sintético (PAG - Polialquileno Glicol):</strong> Outro tipo de sintético com altíssima performance, especialmente em aplicações de engrenagens sem-fim. Possui lubricidade natural superior, mas é <strong>INCOMPATÍVEL</strong> com óleos minerais e PAO. A mistura pode causar a formação de borra e gel, levando a falhas catastróficas. Exige limpeza completa (flushing) do sistema antes da troca.</p>
        `
    },
    {
        titulo: "A Importância do Flushing (Limpeza do Sistema)",
        conteudo: `
            <p>O flushing é o processo de circulação de um fluido de limpeza pelo sistema para remover verniz, borra, contaminantes e resíduos do óleo antigo antes de introduzir o novo lubrificante.</p>
            <p><strong>Quando o Flushing é OBRIGATÓRIO?</strong></p>
            <ul>
                <li><strong>Troca de base incompatível:</strong> Ao mudar de um óleo mineral ou PAO para um óleo PAG (ou vice-versa). Como visto na nossa ferramenta, a mistura é proibida e destrutiva.</li>
                <li><strong>Alta contaminação:</strong> Quando o óleo antigo está severamente degradado, oxidado ou contaminado com água, partículas ou outros fluidos.</li>
                <li><strong>Falha de componente:</strong> Após uma falha de bomba, rolamento ou engrenagem, para remover as partículas metálicas geradas.</li>
            </ul>
            <p>Ignorar o flushing nestas situações é como tomar banho e vestir a mesma roupa suja. O novo óleo será imediatamente contaminado, a sua vida útil será drasticamente reduzida e o risco de uma nova falha permanece elevado.</p>
        `
    }
];


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

    const accordionContainer = document.querySelector('.accordion');

    // --- LÓGICA DA BASE DE CONHECIMENTO (NOVA) ---
    function popularBaseDeConhecimento() {
        if (!accordionContainer) return;

        baseDeConhecimento.forEach(item => {
            const accordionItem = document.createElement('div');
            accordionItem.className = 'accordion-item';

            const button = document.createElement('button');
            button.className = 'accordion-header';
            button.innerHTML = `
                ${item.titulo}
                <i class="fas fa-chevron-down"></i>
            `;

            const content = document.createElement('div');
            content.className = 'accordion-content';
            content.innerHTML = item.conteudo;

            accordionItem.appendChild(button);
            accordionItem.appendChild(content);
            accordionContainer.appendChild(accordionItem);

            button.addEventListener('click', () => {
                // Fecha todos os outros
                document.querySelectorAll('.accordion-header').forEach(b => {
                    if (b !== button) {
                        b.classList.remove('active');
                        const c = b.nextElementSibling;
                        if (c) c.style.maxHeight = null;
                    }
                });
                // Alterna o atual
                button.classList.toggle('active');
                const contentDiv = button.nextElementSibling;
                if (contentDiv.style.maxHeight) {
                    contentDiv.style.maxHeight = null;
                } else {
                    contentDiv.style.maxHeight = contentDiv.scrollHeight + "px";
                }
            });
        });
    }

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
    function resetSelect(select, message, disabled = true) {
        select.innerHTML = `<option value="">${message}</option>`;
        select.disabled = disabled;
    }

    function popularAplicacoes() {
        resetSelect(applicationSelect, '-- Selecione a Aplicação --', false);
        resetSelect(marcaSelect, '-- Selecione a Marca --');
        resetSelect(oleoSelect, '-- Selecione o Produto --');
        const aplicacoes = [...new Set(tabelaSimilaridade.map(item => item.APLICACAO))];
        aplicacoes.sort().forEach(app => {
            const option = document.createElement('option');
            option.value = app;
            option.textContent = app;
            applicationSelect.appendChild(option);
        });
    }

    function popularMarcas(aplicacaoSelecionada) {
        resetSelect(marcaSelect, '-- Selecione a Marca --');
        resetSelect(oleoSelect, '-- Selecione o Produto --');
        if (!aplicacaoSelecionada) return;

        const marcas = new Set();
        tabelaSimilaridade
            .filter(item => item.APLICACAO === aplicacaoSelecionada)
            .forEach(grupo => {
                Object.keys(grupo.PRODUTOS).forEach(marca => marcas.add(marca));
            });

        Array.from(marcas).sort().forEach(marca => {
            const option = document.createElement('option');
            option.value = marca;
            option.textContent = marca;
            marcaSelect.appendChild(option);
        });
        marcaSelect.disabled = false;
    }

    function popularProdutos(aplicacaoSelecionada, marcaSelecionada) {
        resetSelect(oleoSelect, '-- Selecione o Produto --');
        if (!marcaSelecionada) return;

        const produtos = [];
        tabelaSimilaridade
            .filter(item => item.APLICACAO === aplicacaoSelecionada)
            .forEach((grupo) => {
                if (grupo.PRODUTOS[marcaSelecionada]) {
                    const grupoIndexOriginal = tabelaSimilaridade.findIndex(originalGrupo => originalGrupo === grupo);
                    produtos.push({
                        nome: grupo.PRODUTOS[marcaSelecionada].NOME,
                        grupoIndex: grupoIndexOriginal
                    });
                }
            });

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
    });
    
    marcaSelect.addEventListener('change', () => {
        popularProdutos(applicationSelect.value, marcaSelect.value);
    });

    searchButton.addEventListener('click', encontrarSubstitutos);
    modalCloseButton.addEventListener('click', fecharModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) fecharModal(); });

    // --- INICIALIZAÇÃO ---
    popularAplicacoes();
    popularBaseDeConhecimento(); // Chama a nova função para criar os artigos
});

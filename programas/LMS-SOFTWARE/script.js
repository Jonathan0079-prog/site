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
    const justificationText = document.getElementById('calculator-justification');
    const findOilsButton = document.getElementById('find-oils-button');

    const modal = document.getElementById('compatibility-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalCloseButton = document.getElementById('modal-close-button');

    const equipmentForm = document.getElementById('equipment-form');
    const equipmentOilSelect = document.getElementById('equipment-oil');
    const planTableBody = document.querySelector('#plan-table tbody');


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
        const temp = parseFloat(tempOperacaoInput.value);
        const tipo = tipoEquipamentoSelect.value;
        if (isNaN(temp) || !tipo) {
            alert('Por favor, preencha todos os campos da calculadora.');
            return;
        }
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
        justificationText.textContent = justification;
        findOilsButton.classList.remove('hidden');
        calculatorResultDiv.classList.remove('hidden');
        findOilsButton.onclick = () => buscarPorViscosidade(vgRecomendado, calculatorSearchResultsContainer);
    }

    function buscarPorViscosidade(viscosidade, container) {
        const gruposEncontrados = tabelaSimilaridade.filter(grupo => grupo.ISO_VG === viscosidade);
        container.innerHTML = '';
        if (gruposEncontrados.length === 0) {
            container.innerHTML = `<p class="error-message">Nenhum óleo com viscosidade ISO VG ${viscosidade} encontrado na base de dados.</p>`;
            return;
        }
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

    // =======================================================
    //          LÓGICA DO BUSCADOR DE EQUIVALENTES
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
        resultsContainer.innerHTML = '';
        calculatorSearchResultsContainer.innerHTML = '';
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
        
        if (Object.keys(substitutos).length === 0) {
             htmlResultados += `<p>Nenhum equivalente direto encontrado.</p>`;
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
                const info = JSON.parse(e.target.getAttribute('data-compat-info'));
                exibirModalCompatibilidade(info);
            });
        });
    }

    // =======================================================
    //          LÓGICA DO PLANO DE LUBRIFICAÇÃO
    // =======================================================
    let planItems = [];

    function popularOleosDoPlano() {
        const todosOsOleos = new Set();
        tabelaSimilaridade.forEach(grupo => {
            for (const marca in grupo.PRODUTOS) {
                const oleoId = `${grupo.PRODUTOS[marca].NOME} (${marca})`;
                todosOsOleos.add(oleoId);
            }
        });
        const oleosOrdenados = Array.from(todosOsOleos).sort();
        oleosOrdenados.forEach(oleo => {
            const option = document.createElement('option');
            option.value = oleo;
            option.textContent = oleo;
            equipmentOilSelect.appendChild(option);
        });
    }

    function adicionarItemAoPlano(event) {
        event.preventDefault();
        const equipmentName = document.getElementById('equipment-name').value;
        const equipmentOil = document.getElementById('equipment-oil').value;
        const changeInterval = parseInt(document.getElementById('change-interval').value);
        const startDateString = document.getElementById('start-date').value;
        const startDate = new Date(startDateString + 'T00:00:00');

        if (!equipmentName || !equipmentOil || isNaN(changeInterval) || isNaN(startDate.getTime())) {
            alert('Por favor, preencha todos os campos do plano de lubrificação.');
            return;
        }

        const hoursPerDay = 8;
        const daysToNextChange = changeInterval / hoursPerDay;
        const nextChangeDate = new Date(startDate);
        nextChangeDate.setDate(startDate.getDate() + Math.round(daysToNextChange));
        const newItem = {
            id: Date.now(),
            name: equipmentName,
            oil: equipmentOil,
            nextChange: nextChangeDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
        };
        planItems.push(newItem);
        renderizarTabelaPlano();
        equipmentForm.reset();
    }

    function removerItemDoPlano(itemId) {
        planItems = planItems.filter(item => item.id !== itemId);
        renderizarTabelaPlano();
    }

    function renderizarTabelaPlano() {
        planTableBody.innerHTML = '';
        if (planItems.length === 0) {
            planTableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Nenhum equipamento no plano ainda.</td></tr>`;
            return;
        }
        planItems.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.oil}</td>
                <td>${item.nextChange}</td>
                <td>
                    <button class="action-btn" data-id="${item.id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            `;
            planTableBody.appendChild(row);
        });
        document.querySelectorAll('#plan-table .action-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.getAttribute('data-id'));
                removerItemDoPlano(id);
            });
        });
    }

    // =======================================================
    //          EVENT LISTENERS GERAIS
    // =======================================================
    equipmentForm.addEventListener('submit', adicionarItemAoPlano);
    calculateButton.addEventListener('click', calcularViscosidade);
    marcaSelect.addEventListener('change', () => { popularProdutosPorMarca(marcaSelect.value); resultsContainer.innerHTML = ''; });
    searchButton.addEventListener('click', encontrarSubstitutos);
    modalCloseButton.addEventListener('click', fecharModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) fecharModal(); });

    // =======================================================
    //          INICIALIZAÇÃO DA APLICAÇÃO
    // =======================================================
    popularMarcas();
    popularProdutosPorMarca('');
    popularOleosDoPlano();
    renderizarTabelaPlano();
});

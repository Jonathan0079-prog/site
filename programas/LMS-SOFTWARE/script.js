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
        resultsContainer.innerHTML = '';
        calculatorSearchResultsContainer.innerHTML = '';
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
// data/database.js

// ATUALIZAÇÃO: Base de dados massivamente expandida e reorganizada com base na "Tabela de Similaridade" fornecida.
export const tabelaSimilaridade = [
  // --- SISTEMAS HIDRÁULICOS E CIRCULATÓRIOS ---
  {
    APLICACAO: "HIDRÁULICO & CIRCULATÓRIO (MINERAL)",
    ISO_VG: "32",
    PRODUTOS: {
      MOBIL: { NOME: "DTE 24", BASE: "MINERAL", IV: "98", PONTO_FULGOR: "220", PONTO_FLUIDEZ: "-27" },
      SHELL: { NOME: "TELLUS S2 M 32", BASE: "MINERAL", IV: "100", PONTO_FULGOR: "225", PONTO_FLUIDEZ: "-30" },
      CASTROL: { NOME: "HYSPIN AWS 32", BASE: "MINERAL", IV: "102", PONTO_FULGOR: "210", PONTO_FLUIDEZ: "-30" },
      PETROBRAS: { NOME: "LUBRAX INDUSTRIAL HLP 32", BASE: "MINERAL", IV: "97", PONTO_FULGOR: "218", PONTO_FLUIDEZ: "-24" },
      TEXACO: { NOME: "RANDO HD 32", BASE: "MINERAL", IV: "100", PONTO_FULGOR: "220", PONTO_FLUIDEZ: "-33" },
      YPF: { NOME: "HIDRAULICO B 32", BASE: "MINERAL", IV: "96", PONTO_FULGOR: "215", PONTO_FLUIDEZ: "-25" },
      TOTAL: { NOME: "AZOLLA ZS 32", BASE: "MINERAL", IV: "100", PONTO_FULGOR: "226", PONTO_FLUIDEZ: "-30" },
      FUCHS: { NOME: "RENOLIN B 10", BASE: "MINERAL", IV: "105", PONTO_FULGOR: "200", PONTO_FLUIDEZ: "-27" },
      PETRONAS: { NOME: "TUTELA HONOR HLP 32", BASE: "MINERAL", IV: "98", PONTO_FULGOR: "210", PONTO_FLUIDEZ: "-24" }
    }
  },
  {
    APLICACAO: "HIDRÁULICO & CIRCULATÓRIO (MINERAL)",
    ISO_VG: "46",
    PRODUTOS: {
      MOBIL: { NOME: "DTE 25", BASE: "MINERAL", IV: "98", PONTO_FULGOR: "224", PONTO_FLUIDEZ: "-27" },
      SHELL: { NOME: "TELLUS S2 M 46", BASE: "MINERAL", IV: "105", PONTO_FULGOR: "230", PONTO_FLUIDEZ: "-30" },
      CASTROL: { NOME: "HYSPIN AWS 46", BASE: "MINERAL", IV: "102", PONTO_FULGOR: "228", PONTO_FLUIDEZ: "-29" },
      PETROBRAS: { NOME: "LUBRAX INDUSTRIAL HLP 46", BASE: "MINERAL", IV: "97", PONTO_FULGOR: "220", PONTO_FLUIDEZ: "-24" },
      TEXACO: { NOME: "RANDO HD 46", BASE: "MINERAL", IV: "100", PONTO_FULGOR: "226", PONTO_FLUIDEZ: "-33" },
      YPF: { NOME: "HIDRAULICO B 46", BASE: "MINERAL", IV: "96", PONTO_FULGOR: "222", PONTO_FLUIDEZ: "-25" },
      TOTAL: { NOME: "AZOLLA ZS 46", BASE: "MINERAL", IV: "100", PONTO_FULGOR: "232", PONTO_FLUIDEZ: "-30" },
      FUCHS: { NOME: "RENOLIN B 15", BASE: "MINERAL", IV: "105", PONTO_FULGOR: "210", PONTO_FLUIDEZ: "-24" },
      PETRONAS: { NOME: "TUTELA HONOR HLP 46", BASE: "MINERAL", IV: "98", PONTO_FULGOR: "220", PONTO_FLUIDEZ: "-24" }
    }
  },
  {
    APLICACAO: "HIDRÁULICO & CIRCULATÓRIO (MINERAL)",
    ISO_VG: "68",
    PRODUTOS: {
      MOBIL: { NOME: "DTE 26", BASE: "MINERAL", IV: "98", PONTO_FULGOR: "236", PONTO_FLUIDEZ: "-24" },
      SHELL: { NOME: "TELLUS S2 M 68", BASE: "MINERAL", IV: "103", PONTO_FULGOR: "245", PONTO_FLUIDEZ: "-27" },
      CASTROL: { NOME: "HYSPIN AWS 68", BASE: "MINERAL", IV: "101", PONTO_FULGOR: "240", PONTO_FLUIDEZ: "-25" },
      PETROBRAS: { NOME: "LUBRAX INDUSTRIAL HLP 68", BASE: "MINERAL", IV: "97", PONTO_FULGOR: "230", PONTO_FLUIDEZ: "-21" },
      TEXACO: { NOME: "RANDO HD 68", BASE: "MINERAL", IV: "99", PONTO_FULGOR: "242", PONTO_FLUIDEZ: "-30" },
      YPF: { NOME: "HIDRAULICO B 68", BASE: "MINERAL", IV: "95", PONTO_FULGOR: "238", PONTO_FLUIDEZ: "-23" },
      TOTAL: { NOME: "AZOLLA ZS 68", BASE: "MINERAL", IV: "98", PONTO_FULGOR: "244", PONTO_FLUIDEZ: "-27" },
      FUCHS: { NOME: "RENOLIN B 20", BASE: "MINERAL", IV: "100", PONTO_FULGOR: "240", PONTO_FLUIDEZ: "-21" },
      PETRONAS: { NOME: "TUTELA HONOR HLP 68", BASE: "MINERAL", IV: "98", PONTO_FULGOR: "230", PONTO_FLUIDEZ: "-21" }
    }
  },
  
  // --- REDUTORES E ENGRENAGENS ---
  {
    APLICACAO: "REDUTORES E ENGRENAGENS (MINERAL)",
    ISO_VG: "150",
    PRODUTOS: {
        MOBIL: { NOME: "MOBILGEAR 600 XP 150", BASE: "MINERAL", IV: "97", PONTO_FULGOR: "230", PONTO_FLUIDEZ: "-24" },
        SHELL: { NOME: "OMALA S2 GX 150", BASE: "MINERAL", IV: "97", PONTO_FULGOR: "240", PONTO_FLUIDEZ: "-21" },
        CASTROL: { NOME: "ALPHA SP 150", BASE: "MINERAL", IV: "95", PONTO_FULGOR: "230", PONTO_FLUIDEZ: "-24" },
        PETROBRAS: { NOME: "LUBRAX INDUSTRIAL CLP 150", BASE: "MINERAL", IV: "95", PONTO_FULGOR: "232", PONTO_FLUIDEZ: "-18" },
        TEXACO: { NOME: "MEROPA 150", BASE: "MINERAL", IV: "96", PONTO_FULGOR: "240", PONTO_FLUIDEZ: "-24" },
        TOTAL: { NOME: "CARTER EP 150", BASE: "MINERAL", IV: "95", PONTO_FULGOR: "248", PONTO_FLUIDEZ: "-27" },
        FUCHS: { NOME: "RENOLIN CLP 150", BASE: "MINERAL", IV: "96", PONTO_FULGOR: "235", PONTO_FLUIDEZ: "-24" },
        PETRONAS: { NOME: "TUTELA EP 150", BASE: "MINERAL", IV: "95", PONTO_FULGOR: "230", PONTO_FLUIDEZ: "-15" }
    }
  },
  {
    APLICACAO: "REDUTORES E ENGRENAGENS (MINERAL)",
    ISO_VG: "220",
    PRODUTOS: {
      MOBIL: { NOME: "MOBILGEAR 600 XP 220", BASE: "MINERAL", IV: "97", PONTO_FULGOR: "240", PONTO_FLUIDEZ: "-24" },
      SHELL: { NOME: "OMALA S2 GX 220", BASE: "MINERAL", IV: "97", PONTO_FULGOR: "250", PONTO_FLUIDEZ: "-18" },
      CASTROL: { NOME: "ALPHA SP 220", BASE: "MINERAL", IV: "95", PONTO_FULGOR: "245", PONTO_FLUIDEZ: "-21" },
      PETROBRAS: { NOME: "LUBRAX INDUSTRIAL CLP 220", BASE: "MINERAL", IV: "95", PONTO_FULGOR: "242", PONTO_FLUIDEZ: "-15" },
      TEXACO: { NOME: "MEROPA 220", BASE: "MINERAL", IV: "96", PONTO_FULGOR: "248", PONTO_FLUIDEZ: "-21" },
      TOTAL: { NOME: "CARTER EP 220", BASE: "MINERAL", IV: "95", PONTO_FULGOR: "252", PONTO_FLUIDEZ: "-24" },
      FUCHS: { NOME: "RENOLIN CLP 220", BASE: "MINERAL", IV: "96", PONTO_FULGOR: "240", PONTO_FLUIDEZ: "-21" },
      PETRONAS: { NOME: "TUTELA EP 220", BASE: "MINERAL", IV: "95", PONTO_FULGOR: "240", PONTO_FLUIDEZ: "-15" }
    }
  },
  {
    APLICACAO: "REDUTORES E ENGRENAGENS (SINTÉTICO PAO)",
    ISO_VG: "220",
    PRODUTOS: {
      MOBIL: { NOME: "MOBILGEAR SHC XMP 220", BASE: "SINTÉTICO (PAO)", IV: "152", PONTO_FULGOR: "250", PONTO_FLUIDEZ: "-48" },
      SHELL: { NOME: "OMALA S4 GXV 220", BASE: "SINTÉTICO (PAO)", IV: "153", PONTO_FULGOR: "262", PONTO_FLUIDEZ: "-45" },
      TEXACO: { NOME: "PINNACLE EP 220", BASE: "SINTÉTICO (PAO)", IV: "155", PONTO_FULGOR: "255", PONTO_FLUIDEZ: "-47" },
      TOTAL: { NOME: "CARTER SH 220", BASE: "SINTÉTICO (PAO)", IV: "153", PONTO_FULGOR: "258", PONTO_FLUIDEZ: "-51" }
    }
  },
  {
    APLICACAO: "REDUTORES E ENGRENAGENS (SINTÉTICO PAG)",
    ISO_VG: "220",
    PRODUTOS: {
      MOBIL: { NOME: "MOBIL GLYGOYLE 220", BASE: "SINTÉTICO (PAG)", IV: "220", PONTO_FULGOR: "270", PONTO_FLUIDEZ: "-39" },
      SHELL: { NOME: "OMALA S4 WE 220", BASE: "SINTÉTICO (PAG)", IV: "235", PONTO_FULGOR: "285", PONTO_FLUIDEZ: "-42" },
      TEXACO: { NOME: "SYNLUBE CLP 220", BASE: "SINTÉTICO (PAG)", IV: "225", PONTO_FULGOR: "275", PONTO_FLUIDEZ: "-40" },
      TOTAL: { NOME: "CARTER SY 220", BASE: "SINTÉTICO (PAG)", IV: "230", PONTO_FULGOR: "280", PONTO_FLUIDEZ: "-36" }
    }
  },
  
  // --- TURBINAS A GÁS E VAPOR ---
  {
    APLICACAO: "TURBINAS A GÁS E VAPOR (MINERAL)",
    ISO_VG: "32",
    PRODUTOS: {
      MOBIL: { NOME: "DTE 732", BASE: "MINERAL", IV: "107", PONTO_FULGOR: "220", PONTO_FLUIDEZ: "-30" },
      SHELL: { NOME: "TURBO T 32", BASE: "MINERAL", IV: "110", PONTO_FULGOR: "215", PONTO_FLUIDEZ: "-33" },
      TEXACO: { NOME: "GST OIL 32", BASE: "MINERAL", IV: "108", PONTO_FULGOR: "218", PONTO_FLUIDEZ: "-30" },
      TOTAL: { NOME: "PRESLIA 32", BASE: "MINERAL", IV: "105", PONTO_FULGOR: "222", PONTO_FLUIDEZ: "-27" },
      PETRONAS: { NOME: "TUTELA T 32", BASE: "MINERAL", IV: "100", PONTO_FULGOR: "210", PONTO_FLUIDEZ: "-24" }
    }
  },
  
  // --- COMPRESSORES DE AR ---
  {
    APLICACAO: "COMPRESSOR DE AR PARAFUSO (MINERAL)",
    ISO_VG: "46",
    PRODUTOS: {
      MOBIL: { NOME: "RARUS 425", BASE: "MINERAL", IV: "97", PONTO_FULGOR: "236", PONTO_FLUIDEZ: "-27" },
      SHELL: { NOME: "CORENA S2 P 46", BASE: "MINERAL", IV: "98", PONTO_FULGOR: "230", PONTO_FLUIDEZ: "-30" },
      TEXACO: { NOME: "COMPRESSOR OIL EP 46", BASE: "MINERAL", IV: "95", PONTO_FULGOR: "235", PONTO_FLUIDEZ: "-25" },
      TOTAL: { NOME: "DACNIS 46", BASE: "MINERAL", IV: "97", PONTO_FULGOR: "228", PONTO_FLUIDEZ: "-24" },
      PETRONAS: { NOME: "TUTELA COM C 46", BASE: "MINERAL", IV: "96", PONTO_FULGOR: "220", PONTO_FLUIDEZ: "-21" }
    }
  },

  // --- GUIAS E BARRAMENTOS ---
  {
      APLICACAO: "GUIAS E BARRAMENTOS",
      ISO_VG: "68",
      PRODUTOS: {
          MOBIL: { NOME: "VACTRA Nº 2", BASE: "MINERAL", IV: "N/A", PONTO_FULGOR: "230", PONTO_FLUIDEZ: "-15" },
          SHELL: { NOME: "TONNA S2 M 68", BASE: "MINERAL", IV: "N/A", PONTO_FULGOR: "225", PONTO_FLUIDEZ: "-18" },
          CASTROL: { NOME: "MAGNA SW 68", BASE: "MINERAL", IV: "N/A", PONTO_FULGOR: "220", PONTO_FLUIDEZ: "-12" },
          PETROBRAS: { NOME: "LUBRAX INDUSTRIAL GBA 2", BASE: "MINERAL", IV: "N/A", PONTO_FULGOR: "224", PONTO_FLUIDEZ: "-12" },
          TOTAL: { NOME: "DROSERA MS 68", BASE: "MINERAL", IV: "N/A", PONTO_FULGOR: "232", PONTO_FLUIDEZ: "-18" },
          PETRONAS: { NOME: "TUTELA G 68", BASE: "MINERAL", IV: "N/A", PONTO_FULGOR: "220", PONTO_FLUIDEZ: "-15" }
      }
  },
  
  // --- GRAXAS ---
  {
    APLICACAO: "GRAXA DE LÍTIO MULTIUSO",
    ISO_VG: "NLGI 2", // Usamos NLGI para graxas
    PRODUTOS: {
      MOBIL: { NOME: "MOBILUX EP 2", BASE: "LÍTIO", IV: "N/A", PONTO_FULGOR: "N/A", PONTO_FLUIDEZ: "N/A" },
      SHELL: { NOME: "GADUS S2 V220 2", BASE: "LÍTIO", IV: "N/A", PONTO_FULGOR: "N/A", PONTO_FLUIDEZ: "N/A" },
      TEXACO: { NOME: "MULTIFAK EP 2", BASE: "LÍTIO", IV: "N/A", PONTO_FULGOR: "N/A", PONTO_FLUIDEZ: "N/A" },
      TOTAL: { NOME: "MULTIS EP 2", BASE: "LÍTIO", IV: "N/A", PONTO_FULGOR: "N/A", PONTO_FLUIDEZ: "N/A" },
      PETRONAS: { NOME: "TUTELA MR 2", BASE: "LÍTIO", IV: "N/A", PONTO_FULGOR: "N/A", PONTO_FLUIDEZ: "N/A" }
    }
  },
  {
    APLICACAO: "GRAXA DE COMPLEXO DE LÍTIO ALTA TEMPERATURA",
    ISO_VG: "NLGI 2",
    PRODUTOS: {
      MOBIL: { NOME: "MOBILGREASE XHP 222", BASE: "COMPLEXO DE LÍTIO", IV: "N/A", PONTO_FULGOR: "N/A", PONTO_FLUIDEZ: "N/A" },
      SHELL: { NOME: "GADUS S3 V220C 2", BASE: "COMPLEXO DE LÍTIO", IV: "N/A", PONTO_FULGOR: "N/A", PONTO_FLUIDEZ: "N/A" },
      TEXACO: { NOME: "STARPLEX EP 2", BASE: "COMPLEXO DE LÍTIO", IV: "N/A", PONTO_FULGOR: "N/A", PONTO_FLUIDEZ: "N/A" },
      TOTAL: { NOME: "CERAN WR 2", BASE: "COMPLEXO DE CÁLCIO", IV: "N/A", PONTO_FULGOR: "N/A", PONTO_FLUIDEZ: "N/A" }, // Exceção de base
      PETRONAS: { NOME: "TUTELA WBLC", BASE: "COMPLEXO DE LÍTIO", IV: "N/A", PONTO_FULGOR: "N/A", PONTO_FLUIDEZ: "N/A" }
    }
  }
];

// Matriz de compatibilidade (sem alterações)
export const matrizCompatibilidade = {
    "MINERAL": {
        "MINERAL": { "status": "OK", "descricao": "Óleos de mesma base (Mineral) são totalmente compatíveis. A mistura é segura, desde que a viscosidade e a aplicação sejam as mesmas." },
        "SINTÉTICO (PAO)": { "status": "CUIDADO", "descricao": "Bases Minerais e Sintéticas (PAO) são geralmente compatíveis, mas a mistura pode afetar o desempenho dos aditivos. Recomenda-se limitar a mistura a no máximo 10% ou realizar um flushing para garantir a performance." },
        "SINTÉTICO (PAG)": { "status": "INCOMPATÍVEL", "descricao": "Mistura PROIBIDA. Óleos Minerais e Sintéticos (PAG) são quimicamente incompatíveis. A mistura resultará em formação de borra, gel, e perda total da capacidade de lubrificação, causando falha catastrófica no equipamento. O flushing completo do sistema é OBRIGATÓRIO." }
    },
    "SINTÉTICO (PAO)": {
        "MINERAL": { "status": "CUIDADO", "descricao": "Bases Sintéticas (PAO) e Minerais são geralmente compatíveis, mas a mistura pode reduzir o desempenho do óleo sintético. Recomenda-se limitar a mistura a no máximo 10% ou realizar um flushing para garantir a performance." },
        "SINTÉTICO (PAO)": { "status": "OK", "descricao": "Óleos de mesma base (Sintético PAO) são totalmente compatíveis. A mistura é segura." },
        "SINTÉTICO (PAG)": { "status": "INCOMPATÍVEL", "descricao": "Mistura PROIBIDA. Óleos Sintéticos (PAO) e (PAG) são quimicamente incompatíveis e não devem ser misturados sob nenhuma circunstância. O flushing completo do sistema é OBRIGATÓRIO." }
    },
    "SINTÉTICO (PAG)": {
        "MINERAL": { "status": "INCOMPATÍVEL", "descricao": "Mistura PROIBIDA. Óleos Sintéticos (PAG) e Minerais são quimicamente incompatíveis. A mistura resultará em formação de borra e gel, causando falha catastrófica no equipamento. O flushing completo do sistema é OBRIGATÓRIO." },
        "SINTÉTICO (PAO)": { "status": "INCOMPATÍVEL", "descricao": "Mistura PROIBIDA. Óleos Sintéticos (PAG) e (PAO) são quimicamente incompatíveis e não devem ser misturados sob nenhuma circunstância. O flushing completo do sistema é OBRIGATÓRIO." },
        "SINTÉTICO (PAG)": { "status": "OK", "descricao": "Óleos de mesma base (Sintético PAG) são totalmente compatíveis. A mistura é segura." }
    },
    "LÍTIO": {
        "LÍTIO": { "status": "OK", "descricao": "Graxas de mesma base (Lítio) são geralmente compatíveis. No entanto, sempre verifique a compatibilidade dos espessantes e aditivos." },
        "COMPLEXO DE LÍTIO": { "status": "CUIDADO", "descricao": "A mistura é possível, mas pode haver uma leve alteração nas propriedades, como o ponto de gota. Monitore a consistência da graxa após a mistura." }
    },
    "COMPLEXO DE LÍTIO": {
        "LÍTIO": { "status": "CUIDADO", "descricao": "A mistura é possível, mas pode haver uma leve alteração nas propriedades, como o ponto de gota. Monitore a consistência da graxa após a mistura." },
        "COMPLEXO DE LÍTIO": { "status": "OK", "descricao": "Graxas de mesma base (Complexo de Lítio) são totalmente compatíveis." }
    }
};

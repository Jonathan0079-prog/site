// script.js

import { tabelaSimilaridade, matrizCompatibilidade } from './data/database.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- Seleção de Elementos DOM ---
    // Buscador
    const marcaSelect = document.getElementById('marca-select');
    const oleoSelect = document.getElementById('oleo-select');
    const searchButton = document.getElementById('search-button');
    const resultsContainer = document.getElementById('results-container');
    const calculatorSearchResultsContainer = document.getElementById('calculator-search-results-container');
    
    // Calculadora
    const tempOperacaoInput = document.getElementById('temp-operacao');
    const tipoEquipamentoSelect = document.getElementById('tipo-equipamento');
    const calculateButton = document.getElementById('calculate-button');
    const calculatorResultDiv = document.getElementById('calculator-result');
    const findOilsButton = document.getElementById('find-oils-button');

    // Modal
    const modal = document.getElementById('compatibility-modal');
    const modalCloseButton = document.getElementById('modal-close-button');

    // Planner
    const equipmentForm = document.getElementById('equipment-form');
    const equipmentOilSelect = document.getElementById('equipment-oil');
    const planTableBody = document.querySelector('#plan-table tbody');


    // =======================================================
    //          LÓGICA DO PLANO DE LUBRIFICAÇÃO
    // =======================================================
    let planItems = []; // Array para armazenar os itens do plano

    function popularOleosDoPlano() {
        const todosOsOleos = new Set();
        tabelaSimilaridade.forEach(grupo => {
            for (const marca in grupo.PRODUTOS) {
                // Adiciona uma string única para identificar o óleo e seu grupo
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
        event.preventDefault(); // Impede o recarregamento da página

        const equipmentName = document.getElementById('equipment-name').value;
        const equipmentOil = document.getElementById('equipment-oil').value;
        const changeInterval = parseInt(document.getElementById('change-interval').value);
        const startDate = new Date(document.getElementById('start-date').value);

        if (isNaN(startDate.getTime())) {
            alert('Por favor, insira uma data de início válida.');
            return;
        }

        // Calcula a próxima data de troca
        const workDaysInYear = 250; // Aproximação
        const hoursPerDay = 8; // Aproximação
        const daysToNextChange = changeInterval / hoursPerDay;
        const nextChangeDate = new Date(startDate);
        nextChangeDate.setDate(startDate.getDate() + Math.round(daysToNextChange));

        const newItem = {
            id: Date.now(), // ID único
            name: equipmentName,
            oil: equipmentOil,
            nextChange: nextChangeDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
        };

        planItems.push(newItem);
        renderizarTabelaPlano();
        equipmentForm.reset(); // Limpa o formulário
    }

    function removerItemDoPlano(itemId) {
        planItems = planItems.filter(item => item.id !== itemId);
        renderizarTabelaPlano();
    }

    function renderizarTabelaPlano() {
        planTableBody.innerHTML = ''; // Limpa a tabela

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

        // Adiciona event listener para os botões de remover
        document.querySelectorAll('.action-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                // Pega o ID do elemento pai, o botão
                const id = parseInt(e.currentTarget.getAttribute('data-id'));
                removerItemDoPlano(id);
            });
        });
    }

    // =======================================================
    //          OUTRAS FUNÇÕES (Buscador, Calculadora, Modal)
    // =======================================================
    // ... (todas as outras funções que já tínhamos, como calcularViscosidade, popularMarcas, etc. continuam aqui, sem alterações)
    // Por questão de brevidade, elas não serão repetidas aqui, mas devem permanecer no seu arquivo.
    // O código abaixo é uma representação compactada delas.
    
    function fecharModal() { modal.classList.add('hidden'); }
    function exibirModalCompatibilidade(info) { /* ... */ }
    function calcularViscosidade() { /* ... */ }
    function buscarPorViscosidade(viscosidade) { /* ... */ }
    function popularMarcas() { /* ... */ }
    function popularProdutosPorMarca(marcaSelecionada) { /* ... */ }
    function encontrarSubstitutos() { /* ... */ }
    function exibirResultados(grupo, marcaOriginal) { /* ... */ }


    // =======================================================
    //          EVENT LISTENERS GERAIS
    // =======================================================
    // Planner
    equipmentForm.addEventListener('submit', adicionarItemAoPlano);

    // Outros
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

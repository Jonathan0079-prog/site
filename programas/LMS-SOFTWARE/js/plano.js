// js/plano.js

import { tabelaSimilaridade } from '../data/database.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- SELEÇÃO DE ELEMENTOS DOM ---
    const equipmentForm = document.getElementById('equipment-form');
    const equipmentOilSelect = document.getElementById('equipment-oil');
    const planTableBody = document.querySelector('#plan-table tbody');
    let planItems = [];

    // --- LÓGICA DO PLANNER ---
    function popularOleosDoPlano() {
        // ... (código da função sem alterações)
    }

    function adicionarItemAoPlano(event) {
        // ... (código da função sem alterações)
    }

    function removerItemDoPlano(itemId) {
        // ... (código da função sem alterações)
    }

    function renderizarTabelaPlano() {
        // ... (código da função sem alterações)
    }

    // --- EVENT LISTENERS ---
    equipmentForm.addEventListener('submit', adicionarItemAoPlano);

    // --- INICIALIZAÇÃO ---
    popularOleosDoPlano();
    renderizarTabelaPlano();
});

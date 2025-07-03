// js/script.js

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
        // ... (código da função sem alterações)
    }

    function popularProdutosPorMarca(marcaSelecionada) {
        // ... (código da função sem alterações)
    }
    
    function encontrarSubstitutos() {
        // ... (código da função sem alterações)
    }

    function exibirResultados(grupo, marcaOriginal) {
        // ... (código da função sem alterações)
    }
    
    // --- EVENT LISTENERS ---
    marcaSelect.addEventListener('change', () => popularProdutosPorMarca(marcaSelect.value));
    searchButton.addEventListener('click', encontrarSubstitutos);
    modalCloseButton.addEventListener('click', fecharModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) fecharModal(); });

    // --- INICIALIZAÇÃO ---
    popularMarcas();
    popularProdutosPorMarca('');
});

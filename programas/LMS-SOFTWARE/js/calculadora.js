// js/calculadora.js

import { tabelaSimilaridade } from '../data/database.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- SELEÇÃO DE ELEMENTOS DOM ---
    const tempOperacaoInput = document.getElementById('temp-operacao');
    const tipoEquipamentoSelect = document.getElementById('tipo-equipamento');
    const calculateButton = document.getElementById('calculate-button');
    const calculatorResultDiv = document.getElementById('calculator-result');
    const recommendedVgText = document.getElementById('recommended-vg-text');
    const justificationText = document.getElementById('calculator-justification');
    const findOilsButton = document.getElementById('find-oils-button');
    const calculatorSearchResultsContainer = document.getElementById('calculator-search-results-container');
    
    // --- NOVOS ELEMENTOS DOM PARA PROJETOS SALVOS ---
    const projectNameInput = document.getElementById('project-name');
    const saveProjectBtn = document.getElementById('save-project-btn');
    const savedProjectsSelect = document.getElementById('saved-projects-select');
    const loadProjectBtn = document.getElementById('load-project-btn');
    const deleteProjectBtn = document.getElementById('delete-project-btn');

    let savedProjects = JSON.parse(localStorage.getItem('calculadoraVGProjects')) || [];

    // --- LÓGICA DE PROJETOS SALVOS (NOVA) ---
    function populateSavedProjects() {
        savedProjectsSelect.innerHTML = '<option value="">-- Nenhum projeto salvo --</option>';
        if (savedProjects.length > 0) {
            savedProjects.forEach((project, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = project.name;
                savedProjectsSelect.appendChild(option);
            });
        }
    }

    function saveProject() {
        const name = projectNameInput.value.trim();
        if (!name) {
            alert('Por favor, dê um nome ao projeto antes de salvar.');
            return;
        }

        const projectData = {
            name: name,
            temp: tempOperacaoInput.value,
            tipo: tipoEquipamentoSelect.value
        };

        savedProjects.push(projectData);
        localStorage.setItem('calculadoraVGProjects', JSON.stringify(savedProjects));
        
        projectNameInput.value = '';
        populateSavedProjects();
        alert(`Projeto "${name}" salvo com sucesso!`);
    }

    function loadProject() {
        const projectIndex = savedProjectsSelect.value;
        if (projectIndex === "") {
            alert("Por favor, selecione um projeto para carregar.");
            return;
        }

        const project = savedProjects[projectIndex];
        tempOperacaoInput.value = project.temp;
        tipoEquipamentoSelect.value = project.tipo;
        
        // Opcional: recalcular e mostrar os resultados automaticamente ao carregar
        calculateButton.click();
    }

    function deleteProject() {
        const projectIndex = savedProjectsSelect.value;
        if (projectIndex === "") {
            alert("Por favor, selecione um projeto para apagar.");
            return;
        }

        const projectName = savedProjects[projectIndex].name;
        if (confirm(`Tem a certeza que deseja apagar o projeto "${projectName}"?`)) {
            savedProjects.splice(projectIndex, 1);
            localStorage.setItem('calculadoraVGProjects', JSON.stringify(savedProjects));
            populateSavedProjects();
            alert(`Projeto "${projectName}" apagado.`);
        }
    }

    // --- LÓGICA DA CALCULADORA (SEM ALTERAÇÕES) ---
    function calcularViscosidade() {
        // ... (código da função sem alterações)
    }

    function buscarPorViscosidade(viscosidade, container) {
        // ... (código da função sem alterações)
    }

    // --- EVENT LISTENERS ---
    calculateButton.addEventListener('click', calcularViscosidade);
    saveProjectBtn.addEventListener('click', saveProject);
    loadProjectBtn.addEventListener('click', loadProject);
    deleteProjectBtn.addEventListener('click', deleteProject);

    // --- INICIALIZAÇÃO ---
    populateSavedProjects();
});

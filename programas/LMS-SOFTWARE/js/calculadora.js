// js/calculadora.js

// O caminho agora sobe um nível (../) para encontrar a pasta 'data'
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

    // --- LÓGICA DA CALCULADORA ---
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

    // --- EVENT LISTENERS ---
    calculateButton.addEventListener('click', calcularViscosidade);
});

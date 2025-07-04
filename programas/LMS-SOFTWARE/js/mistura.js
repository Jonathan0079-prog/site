// js/mistura.js

document.addEventListener('DOMContentLoaded', () => {
    // --- SELEÇÃO DE ELEMENTOS DOM ---
    const viscosity1Input = document.getElementById('viscosity1');
    const percentage1Input = document.getElementById('percentage1');
    const viscosity2Input = document.getElementById('viscosity2');
    const calculateBlendButton = document.getElementById('calculate-blend-button');
    const blendResultDiv = document.getElementById('blend-result');
    const blendResultText = document.getElementById('blend-result-text');

    // Verifica se todos os elementos existem antes de continuar
    if (
        !viscosity1Input ||
        !percentage1Input ||
        !viscosity2Input ||
        !calculateBlendButton ||
        !blendResultDiv ||
        !blendResultText
    ) {
        console.error('Erro: Um ou mais elementos do DOM não foram encontrados.');
        return;
    }

    /**
     * Calcula a viscosidade da mistura usando a equação de Arrhenius.
     * A viscosidade deve ser convertida para uma escala logarítmica (log-log) para o cálculo.
     * v = Viscosidade Cinemática em centistokes (cSt)
     */
    function calculateBlendViscosity() {
        const v1 = parseFloat(viscosity1Input.value);
        const p1 = parseFloat(percentage1Input.value) / 100; // Converte para decimal
        const v2 = parseFloat(viscosity2Input.value);

        if (isNaN(v1) || isNaN(p1) || isNaN(v2)) {
            alert('Por favor, preencha todos os campos com valores numéricos.');
            return;
        }

        if (p1 < 0 || p1 > 1) {
            alert('A percentagem do Óleo 1 deve estar entre 0 e 100.');
            return;
        }

        // A equação de Arrhenius para mistura de viscosidades usa uma escala log-log.
        // log(log(v+0.8)) = p1 * log(log(v1+0.8)) + (1-p1) * log(log(v2+0.8))
        // Onde 'v' é a viscosidade cinemática em cSt. A constante 0.8 é um fator de correção empírico.

        // Passo 1: Calcular os termos log-log para cada óleo
        const logLogV1 = Math.log(Math.log(v1 + 0.8));
        const logLogV2 = Math.log(Math.log(v2 + 0.8));

        // Passo 2: Calcular a média ponderada na escala log-log
        const weightedLogLog = (p1 * logLogV1) + ((1 - p1) * logLogV2);

        // Passo 3: Reverter o cálculo para obter a viscosidade da mistura
        // Primeiro, o exponencial para reverter o primeiro log
        const innerValue = Math.exp(weightedLogLog);
        // Segundo, o exponencial para reverter o segundo log e subtrair a constante
        const blendViscosity = Math.exp(innerValue) - 0.8;

        displayResult(blendViscosity);
    }

    function displayResult(viscosity) {
        if (isNaN(viscosity)) {
            blendResultText.textContent = 'Erro no cálculo.';
        } else {
            blendResultText.textContent = `~ ${viscosity.toFixed(2)} cSt a 40°C`;
        }
        blendResultDiv.classList.remove('hidden');
    }

    // --- EVENT LISTENER ---
    calculateBlendButton.addEventListener('click', calculateBlendViscosity);
});

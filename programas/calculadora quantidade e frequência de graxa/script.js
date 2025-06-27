document.addEventListener('DOMContentLoaded', () => {
    // Seletores dos Elementos do Formulário
    const outerDiameterInput = document.getElementById('outer-diameter');
    const innerDiameterInput = document.getElementById('inner-diameter');
    const widthInput = document.getElementById('width');
    const rpmInput = document.getElementById('rpm');
    const tempInput = document.getElementById('temp');
    const contaminationSelect = document.getElementById('contamination');
    const vibrationSelect = document.getElementById('vibration');
    const shaftPositionSelect = document.getElementById('shaft-position');
    const lubricationPointSelect = document.getElementById('lubrication-point');
    const calculateBtn = document.getElementById('calculate-btn');
    const resetButton = document.getElementById('reset-btn');
    
    // Seletores dos Elementos de Resultado e Erro
    const resultsDiv = document.getElementById('results');
    const errorMessageDiv = document.getElementById('error-message');
    const initialFillFactorSpan = document.getElementById('initial-fill-factor');
    const initialGreaseSpan = document.getElementById('initial-grease');
    const greaseQuantitySpan = document.getElementById('grease-quantity');
    const greaseFrequencySpan = document.getElementById('grease-frequency');
    const greaseDensitySpan = document.getElementById('grease-density');

    // Valor de densidade de referência utilizado
    const assumedGreaseDensity = 0.93; // g/cm³

    calculateBtn.addEventListener('click', () => {
        // Obter os valores dos inputs e converter para números
        const outerDiameter = parseFloat(outerDiameterInput.value);
        const innerDiameter = parseFloat(innerDiameterInput.value);
        const width = parseFloat(widthInput.value);
        const rpm = parseFloat(rpmInput.value);
        const temp = parseFloat(tempInput.value);
        const contaminationFactor = parseFloat(contaminationSelect.value);
        const vibrationFactor = parseFloat(vibrationSelect.value);
        const shaftPositionFactor = parseFloat(shaftPositionSelect.value);
        const initialFillFactor = parseFloat(lubricationPointSelect.value);

        // Validar se os inputs são números válidos e positivos
        const inputs = [outerDiameter, innerDiameter, width, rpm, temp];
        if (inputs.some(isNaN) || inputs.some(v => v <= 0)) {
            errorMessageDiv.textContent = 'Por favor, preencha todos os campos com valores numéricos positivos.';
            errorMessageDiv.style.display = 'block'; // Mostra a mensagem de erro
            resultsDiv.style.display = 'none'; // Esconde os resultados
            return;
        }
        
        // Se a validação passou, esconde a mensagem de erro
        errorMessageDiv.style.display = 'none';
        
        // --- Cálculo da Quantidade de Graxa ---
        const relubricationQuantity = 0.005 * outerDiameter * width;
        const initialGreaseQuantity = initialFillFactor * outerDiameter * width; 
        
        // --- Cálculo da Frequência de Relubrificação ---
        const baseFrequency = Math.pow((1000000 / (rpm * innerDiameter)), 0.5);
        const tempReference = 70;
        let tempFactor = 1;
        if (temp > tempReference) {
            const tempDifference = temp - tempReference;
            tempFactor = Math.pow(0.5, tempDifference / 15);
        }
        const adjustedFrequency = baseFrequency * tempFactor * contaminationFactor * vibrationFactor * shaftPositionFactor;
        
        // --- Exibir os resultados ---
        initialFillFactorSpan.textContent = `${initialFillFactor.toFixed(2)}`;
        initialGreaseSpan.textContent = `${initialGreaseQuantity.toFixed(2)}`;
        greaseQuantitySpan.textContent = `${relubricationQuantity.toFixed(2)}`;
        greaseFrequencySpan.textContent = `${adjustedFrequency.toFixed(0)}`; // Frequência em horas, sem decimais
        greaseDensitySpan.textContent = `${assumedGreaseDensity.toFixed(2)} g/cm³`;
        
        resultsDiv.style.display = 'block';
    });

    resetButton.addEventListener('click', () => {
        // Zera os campos de input
        outerDiameterInput.value = '';
        innerDiameterInput.value = '';
        widthInput.value = '';
        rpmInput.value = '';
        tempInput.value = '';
        
        // Reseta os dropdowns para a opção padrão
        contaminationSelect.value = '1.0';
        vibrationSelect.value = '1.0';
        shaftPositionSelect.value = '1.0';
        lubricationPointSelect.value = '0.03';

        // Oculta a seção de resultados e a de erro
        resultsDiv.style.display = 'none';
        errorMessageDiv.style.display = 'none';
        
        // Zera os textos dos spans (opcional, mas boa prática)
        initialFillFactorSpan.textContent = '-';
        initialGreaseSpan.textContent = '-';
        greaseQuantitySpan.textContent = '-';
        greaseFrequencySpan.textContent = '-';
        greaseDensitySpan.textContent = '-';
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const outerDiameterInput = document.getElementById('outer-diameter');
    const innerDiameterInput = document.getElementById('inner-diameter');
    const widthInput = document.getElementById('width');
    const rpmInput = document.getElementById('rpm');
    const tempInput = document.getElementById('temp');
    const contaminationSelect = document.getElementById('contamination');
    const vibrationSelect = document.getElementById('vibration');
    const shaftPositionSelect = document.getElementById('shaft-position');
    const calculateBtn = document.getElementById('calculate-btn');
    const resetButton = document.getElementById('reset-btn'); // Novo botão de reset
    const resultsDiv = document.getElementById('results');
    
    // Referências aos elementos de resultado
    const greaseDensitySpan = document.getElementById('grease-density');
    const initialGreaseSpan = document.getElementById('initial-grease');
    const greaseQuantitySpan = document.getElementById('grease-quantity');
    const greaseFrequencySpan = document.getElementById('grease-frequency');

    // Define a densidade de referência que a fórmula utiliza
    const assumedGreaseDensity = 0.93; // g/cm³ (Valor médio comum)

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

        // Validar se os inputs são números válidos e positivos
        if (isNaN(outerDiameter) || isNaN(innerDiameter) || isNaN(width) || isNaN(rpm) || isNaN(temp) || outerDiameter <= 0 || innerDiameter <= 0 || width <= 0 || rpm <= 0 || temp < 0) {
            alert('Por favor, preencha todos os campos com valores numéricos válidos e positivos.');
            resultsDiv.style.display = 'none';
            return;
        }
        
        // --- Cálculo da Quantidade de Graxa ---
        // Fórmula para relubrificação (recarga): G = 0.005 * D * B
        const relubricationQuantity = 0.005 * outerDiameter * width;

        // Fórmula para a graxa inicial: Baseado no volume interno do rolamento (~30-50%)
        const initialGreaseQuantity = relubricationQuantity * 2.5; 
        
        // --- Cálculo da Frequência de Relubrificação ---
        // 1. Frequência base sem fatores de correção
        const baseFrequency = Math.pow((1000000 / (rpm * innerDiameter)), 0.5);

        // 2. Fator de correção de temperatura (ajuste exponencial)
        const tempReference = 70; // Temperatura de referência
        let tempFactor = 1;
        if (temp > tempReference) {
            const tempDifference = temp - tempReference;
            // Reduz a frequência pela metade a cada 15°C acima da referência
            tempFactor = Math.pow(0.5, tempDifference / 15);
        }

        // 3. Frequência ajustada com todos os fatores de correção
        const adjustedFrequency = baseFrequency * tempFactor * contaminationFactor * vibrationFactor * shaftPositionFactor;
        
        // --- Exibir os resultados ---
        greaseDensitySpan.textContent = `${assumedGreaseDensity.toFixed(2)} g/cm³ (valor de referência)`;
        initialGreaseSpan.textContent = initialGreaseQuantity.toFixed(2);
        greaseQuantitySpan.textContent = relubricationQuantity.toFixed(2);
        greaseFrequencySpan.textContent = adjustedFrequency.toFixed(2);
        
        // Tornar a div de resultados visível
        resultsDiv.style.display = 'block';
    });

    // Adiciona o evento de clique para o botão de zerar
    resetButton.addEventListener('click', () => {
        // Zera os campos de input
        outerDiameterInput.value = '';
        innerDiameterInput.value = '';
        widthInput.value = '';
        rpmInput.value = '';
        tempInput.value = '';
        
        // Reseta os dropdowns para a opção padrão (Fator 1.0)
        contaminationSelect.value = '1.0';
        vibrationSelect.value = '1.0';
        shaftPositionSelect.value = '1.0';

        // Oculta a seção de resultados
        resultsDiv.style.display = 'none';

        // Opcional: Zera o conteúdo dos spans de resultado
        greaseDensitySpan.textContent = '-';
        initialGreaseSpan.textContent = '-';
        greaseQuantitySpan.textContent = '-';
        greaseFrequencySpan.textContent = '-';
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const outerDiameterInput = document.getElementById('outer-diameter');
    const innerDiameterInput = document.getElementById('inner-diameter');
    const widthInput = document.getElementById('width');
    const rpmInput = document.getElementById('rpm');
    const tempInput = document.getElementById('temp');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultsDiv = document.getElementById('results');
    const greaseQuantitySpan = document.getElementById('grease-quantity');
    const greaseFrequencySpan = document.getElementById('grease-frequency');

    calculateBtn.addEventListener('click', () => {
        // Obter os valores dos inputs e converter para números
        const outerDiameter = parseFloat(outerDiameterInput.value);
        const innerDiameter = parseFloat(innerDiameterInput.value);
        const width = parseFloat(widthInput.value);
        const rpm = parseFloat(rpmInput.value);
        const temp = parseFloat(tempInput.value);

        // Validar se os inputs são números válidos e positivos
        if (isNaN(outerDiameter) || isNaN(innerDiameter) || isNaN(width) || isNaN(rpm) || isNaN(temp) || outerDiameter <= 0 || innerDiameter <= 0 || width <= 0 || rpm <= 0 || temp < 0) {
            alert('Por favor, preencha todos os campos com valores numéricos válidos e positivos.');
            resultsDiv.style.display = 'none';
            return;
        }
        
        // --- Cálculo da Quantidade de Graxa ---
        // Fórmula: G = 0.005 * D * B
        const greaseQuantity = 0.005 * outerDiameter * width;
        
        // --- Cálculo da Frequência de Relubrificação ---
        // Fórmula de frequência base (ajustada para um fator de temperatura)
        // A fórmula original pode variar, esta é uma adaptação comum.
        const baseFrequency = Math.pow((1000000 / (rpm * innerDiameter)), 0.5);

        // Fator de correção de temperatura (ajuste exponencial)
        // A cada 15°C acima de 70°C, a vida útil da graxa é reduzida pela metade
        const tempReference = 70; // Temperatura de referência para vida útil padrão
        let tempFactor = 1;
        if (temp > tempReference) {
            const tempDifference = temp - tempReference;
            tempFactor = Math.pow(0.5, tempDifference / 15);
        }

        const greaseFrequency = baseFrequency * tempFactor;
        
        // --- Exibir os resultados ---
        greaseQuantitySpan.textContent = greaseQuantity.toFixed(2);
        greaseFrequencySpan.textContent = greaseFrequency.toFixed(2);
        
        // Tornar a div de resultados visível
        resultsDiv.style.display = 'block';
    });
});

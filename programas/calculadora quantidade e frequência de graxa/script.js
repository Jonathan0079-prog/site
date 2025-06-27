document.addEventListener('DOMContentLoaded', () => {
    // Referências aos elementos do DOM
    const outerDiameterInput = document.getElementById('outer-diameter');
    const innerDiameterInput = document.getElementById('inner-diameter');
    const widthInput = document.getElementById('width');
    const rpmInput = document.getElementById('rpm');
    const tempInput = document.getElementById('temp');
    const contaminationSelect = document.getElementById('contamination');
    const vibrationSelect = document.getElementById('vibration');
    const shaftPositionSelect = document.getElementById('shaft-position');

    // Botões
    const calculateBtn = document.getElementById('calcular-btn');
    const clearBtn = document.getElementById('limpar-btn');

    // Contêiner e campos de resultado
    const resultsContainer = document.getElementById('resultado-container');
    const initialGreaseSpan = document.getElementById('initial-grease');
    const greaseQuantitySpan = document.getElementById('grease-quantity');
    const greaseFrequencySpan = document.getElementById('grease-frequency');

    // Função para calcular os resultados
    calculateBtn.addEventListener('click', () => {
        const outerDiameter = parseFloat(outerDiameterInput.value);
        const innerDiameter = parseFloat(innerDiameterInput.value);
        const width = parseFloat(widthInput.value);
        const rpm = parseFloat(rpmInput.value);
        const temp = parseFloat(tempInput.value);
        const contaminationFactor = parseFloat(contaminationSelect.value);
        const vibrationFactor = parseFloat(vibrationSelect.value);
        const shaftPositionFactor = parseFloat(shaftPositionSelect.value);

        // Validação dos campos
        if (isNaN(outerDiameter) || isNaN(innerDiameter) || isNaN(width) || isNaN(rpm) || isNaN(temp) || outerDiameter <= 0 || innerDiameter <= 0 || width <= 0 || rpm <= 0) {
            alert('Por favor, preencha todos os campos com valores numéricos válidos e positivos.');
            resultsContainer.classList.add('hidden'); // Esconde resultados se houver erro
            return;
        }
        
        // --- Cálculos ---
        const relubricationQuantity = 0.005 * outerDiameter * width;
        const initialGreaseQuantity = relubricationQuantity * 2.5; 
        const baseFrequency = Math.pow((1000000 / (rpm * innerDiameter)), 0.5);
        const tempReference = 70;
        let tempFactor = 1;
        if (temp > tempReference) {
            const tempDifference = temp - tempReference;
            tempFactor = Math.pow(0.5, tempDifference / 15);
        }
        const adjustedFrequency = baseFrequency * tempFactor * contaminationFactor * vibrationFactor * shaftPositionFactor;
        
        // --- Exibição dos resultados ---
        initialGreaseSpan.textContent = initialGreaseQuantity.toFixed(2);
        greaseQuantitySpan.textContent = relubricationQuantity.toFixed(2);
        greaseFrequencySpan.textContent = adjustedFrequency.toFixed(0); // Frequência em horas inteiras
        
        // Mostra o contêiner de resultados
        resultsContainer.classList.remove('hidden');
    });

    // Função para limpar os dados
    clearBtn.addEventListener('click', () => {
        // Limpa todos os campos de input
        outerDiameterInput.value = '';
        innerDiameterInput.value = '';
        widthInput.value = '';
        rpmInput.value = '';
        tempInput.value = '';

        // Reseta os campos de seleção
        contaminationSelect.selectedIndex = 0;
        vibrationSelect.selectedIndex = 0;
        shaftPositionSelect.selectedIndex = 0;

        // Esconde e reseta a área de resultados
        resultsContainer.classList.add('hidden');
    });
});

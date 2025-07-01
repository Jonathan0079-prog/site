document.addEventListener('DOMContentLoaded', () => {

    // Selecionando todos os elementos do DOM necessários
    const inputs = {
        inputLow: document.getElementById('inputLow'),
        inputHigh: document.getElementById('inputHigh'),
        outputLow: document.getElementById('outputLow'),
        outputHigh: document.getElementById('outputHigh'),
        calcInputPv: document.getElementById('calcInputPv'),
        calcOutputSignal: document.getElementById('calcOutputSignal'),
        calcInputSignal: document.getElementById('calcInputSignal'),
        calcOutputPv: document.getElementById('calcOutputPv'),
    };

    const errorContainer = document.getElementById('erro-container');
    const errorMsg = document.getElementById('erro-msg');

    // Função para mostrar ou esconder erros
    const showError = (message) => {
        errorMsg.textContent = message;
        errorContainer.classList.remove('hidden');
    };

    const hideError = () => {
        errorContainer.classList.add('hidden');
    };

    // Função principal de cálculo
    const calculate = () => {
        hideError();

        // Obtendo e convertendo os valores das faixas para números
        const iL = parseFloat(inputs.inputLow.value);
        const iH = parseFloat(inputs.inputHigh.value);
        const oL = parseFloat(inputs.outputLow.value);
        const oH = parseFloat(inputs.outputHigh.value);
        
        // Verificação para evitar divisão por zero
        if (iL === iH || isNaN(iL) || isNaN(iH)) {
            showError('A faixa de entrada (Mínimo e Máximo) não pode ser igual ou vazia.');
            return;
        }

        // --- Cálculo de Processo para Sinal ---
        const pvValue = parseFloat(inputs.calcInputPv.value);
        if (!isNaN(pvValue)) {
            const signal = oL + (pvValue - iL) * (oH - oL) / (iH - iL);
            inputs.calcOutputSignal.value = signal.toFixed(4); // Exibe com 4 casas decimais
        }

        // --- Cálculo de Sinal para Processo ---
        const signalValue = parseFloat(inputs.calcInputSignal.value);
         if (!isNaN(signalValue)) {
            const pv = iL + (signalValue - oL) * (iH - iL) / (oH - oL);
            inputs.calcOutputPv.value = pv.toFixed(4); // Exibe com 4 casas decimais
        }
    };
    
    // Adiciona o listener de evento 'input' para todos os campos
    // Isso faz o cálculo ser refeito a cada alteração
    for (const key in inputs) {
        if (inputs.hasOwnProperty(key)) {
            // Ignora os campos de resultado que são 'readonly'
            if (!inputs[key].readOnly) {
                 inputs[key].addEventListener('input', calculate);
            }
        }
    }

    // Executa um cálculo inicial ao carregar a página
    calculate();
});

document.addEventListener('DOMContentLoaded', () => {

    const inputs = {
        inputLow: document.getElementById('inputLow'),
        inputHigh: document.getElementById('inputHigh'),
        outputLow: document.getElementById('outputLow'),
        outputHigh: document.getElementById('outputHigh'),
        calcInputPv: document.getElementById('calcInputPv'),
        calcInputSignal: document.getElementById('calcInputSignal'),
        calcInputBits: document.getElementById('calcInputBits'),
    };

    const errorContainer = document.getElementById('erro-container');
    const errorMsg = document.getElementById('erro-msg');

    const BITS_MAX = 65535;
    const BITS_MIN = 0;

    const showError = (message) => {
        errorMsg.textContent = message;
        errorContainer.classList.remove('hidden');
    };

    const hideError = () => {
        errorContainer.classList.add('hidden');
    };
    
    // Função unificada de cálculo
    const calculate = (source) => {
        hideError();

        const iL = parseFloat(inputs.inputLow.value);
        const iH = parseFloat(inputs.inputHigh.value);
        const oL = parseFloat(inputs.outputLow.value);
        const oH = parseFloat(inputs.outputHigh.value);
        
        if (iL === iH || isNaN(iL) || isNaN(iH)) {
            showError('A faixa de entrada (Mínimo e Máximo) não pode ser igual ou vazia.');
            return;
        }

        let pv = NaN, signal = NaN, bits = NaN;

        // Calcula os 3 valores baseado em qual campo foi alterado
        if (source === 'pv' && inputs.calcInputPv.value !== '') {
            pv = parseFloat(inputs.calcInputPv.value);
            signal = oL + (pv - iL) * (oH - oL) / (iH - iL);
            bits = BITS_MIN + (pv - iL) * (BITS_MAX - BITS_MIN) / (iH - iL);
        } else if (source === 'signal' && inputs.calcInputSignal.value !== '') {
            signal = parseFloat(inputs.calcInputSignal.value);
            pv = iL + (signal - oL) * (iH - iL) / (oH - oL);
            bits = BITS_MIN + (pv - iL) * (BITS_MAX - BITS_MIN) / (iH - iL);
        } else if (source === 'bits' && inputs.calcInputBits.value !== '') {
            bits = parseFloat(inputs.calcInputBits.value);
            // Limita o valor de bits para o cálculo reverso
            bits = Math.max(BITS_MIN, Math.min(BITS_MAX, bits)); 
            pv = iL + (bits - BITS_MIN) * (iH - iL) / (BITS_MAX - BITS_MIN);
            signal = oL + (pv - iL) * (oH - oL) / (iH - iL);
        }

        // Atualiza os campos que não foram a fonte da alteração
        if (source !== 'pv') {
            inputs.calcInputPv.value = isNaN(pv) ? '' : pv.toFixed(4);
        }
        if (source !== 'signal') {
            inputs.calcInputSignal.value = isNaN(signal) ? '' : signal.toFixed(4);
        }
        if (source !== 'bits') {
            // Limita e arredonda o valor de bits
            let finalBits = Math.round(bits);
            finalBits = Math.max(BITS_MIN, Math.min(BITS_MAX, finalBits));
            inputs.calcInputBits.value = isNaN(finalBits) ? '' : finalBits;
        }
    };
    
    // Adiciona listeners para os campos de faixa e de entrada
    Object.values(inputs).forEach(input => {
        input.addEventListener('input', (e) => {
            const sourceId = e.target.id;
            if (sourceId.includes('calcInputPv')) {
                calculate('pv');
            } else if (sourceId.includes('calcInputSignal')) {
                calculate('signal');
            } else if (sourceId.includes('calcInputBits')) {
                calculate('bits');
            } else {
                // Se um campo de faixa for alterado, recalcula tudo baseado no processo
                calculate('pv');
            }
        });
    });
});

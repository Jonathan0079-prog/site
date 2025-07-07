document.addEventListener('DOMContentLoaded', () => {

    const gear1 = document.getElementById('gear1');
    const gear2 = document.getElementById('gear2');
    const dentesZ1_input = document.getElementById('dentes-z1');
    const dentesZ2_input = document.getElementById('dentes-z2');
    const rpmEntrada_input = document.getElementById('rpm-entrada');
    const calcularBtn = document.getElementById('calcular-btn');
    const resultadoContainer = document.getElementById('resultado-container');
    const erroContainer = document.getElementById('erro-container');
    const resultadoRelacaoEl = document.getElementById('resultado-relacao');
    const resultadoRpmEl = document.getElementById('resultado-rpm');

    function updateButtonState() {
        const z1 = parseInt(dentesZ1_input.value);
        const z2 = parseInt(dentesZ2_input.value);
        const rpmEntrada = rpmEntrada_input.value;

        if (z1 > 0 && z2 > 0 && rpmEntrada) {
            calcularBtn.disabled = false;
        } else {
            calcularBtn.disabled = true;
        }
    }

    function calcularAnimar() {
        const z1 = parseInt(dentesZ1_input.value);
        const z2 = parseInt(dentesZ2_input.value);
        const rpmEntrada = parseInt(rpmEntrada_input.value) || 0;

        if (isNaN(z1) || isNaN(z2) || z1 <= 0 || z2 <= 0) {
            erroContainer.classList.remove('hidden');
            resultadoContainer.classList.add('hidden');
            gear1.style.animationPlayState = 'paused';
            gear2.style.animationPlayState = 'paused';
            return;
        }

        erroContainer.classList.add('hidden');

        const relacao = z2 / z1;
        const rpmSaida = rpmEntrada / relacao;

        resultadoRelacaoEl.textContent = relacao.toFixed(2) + ' : 1';
        resultadoRpmEl.textContent = rpmSaida.toFixed(0);
        resultadoContainer.classList.remove('hidden');

        const tamanhoBase = 80;
        if (z1 > z2) {
            gear2.style.width = tamanhoBase + 'px';
            gear2.style.height = tamanhoBase + 'px';
            gear1.style.width = tamanhoBase * (z1 / z2) + 'px';
            gear1.style.height = tamanhoBase * (z1 / z2) + 'px';
        } else {
            gear1.style.width = tamanhoBase + 'px';
            gear1.style.height = tamanhoBase + 'px';
            gear2.style.width = tamanhoBase * relacao + 'px';
            gear2.style.height = tamanhoBase * relacao + 'px';
        }

        if (rpmEntrada > 0) {
            const duracao1 = 60 / rpmEntrada;
            const duracao2 = 60 / rpmSaida;

            gear1.style.animationDuration = duracao1 + 's';
            gear2.style.animationDuration = duracao2 + 's';
            
            gear2.style.animationDirection = 'reverse';

            gear1.style.animationPlayState = 'running';
            gear2.style.animationPlayState = 'running';
        } else {
            gear1.style.animationPlayState = 'paused';
            gear2.style.animationPlayState = 'paused';
        }
    }

    dentesZ1_input.addEventListener('input', updateButtonState);
    dentesZ2_input.addEventListener('input', updateButtonState);
    rpmEntrada_input.addEventListener('input', updateButtonState);

    calcularBtn.addEventListener('click', calcularAnimar);

    updateButtonState();
});

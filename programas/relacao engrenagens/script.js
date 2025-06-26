document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENTOS DO DOM ---
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

    // --- FUNÇÃO DE CÁLCULO E ANIMAÇÃO ---
    function calcularAnimar() {
        // Pega os valores dos inputs e converte para número
        const z1 = parseInt(dentesZ1_input.value);
        const z2 = parseInt(dentesZ2_input.value);
        const rpmEntrada = parseInt(rpmEntrada_input.value) || 0; // Se for nulo, considera 0

        // Validação dos inputs de dentes
        if (isNaN(z1) || isNaN(z2) || z1 <= 0 || z2 <= 0) {
            erroContainer.classList.remove('hidden');
            resultadoContainer.classList.add('hidden');
            // Pausa a animação se os valores forem inválidos
            gear1.style.animationPlayState = 'paused';
            gear2.style.animationPlayState = 'paused';
            return;
        }

        // Esconde a mensagem de erro se os valores forem válidos
        erroContainer.classList.add('hidden');

        // --- CÁLCULOS ---
        const relacao = z2 / z1;
        const rpmSaida = rpmEntrada / relacao;

        // --- ATUALIZAÇÃO DOS RESULTADOS ---
        resultadoRelacaoEl.textContent = relacao.toFixed(2) + ' : 1';
        resultadoRpmEl.textContent = rpmSaida.toFixed(0);
        resultadoContainer.classList.remove('hidden');

        // --- ATUALIZAÇÃO DA ANIMAÇÃO ---
        
        // Ajusta o tamanho das engrenagens visualmente baseado no número de dentes
        // A escala é relativa para que não fiquem gigantes na tela
        const tamanhoBase = 80; // Tamanho base em pixels para a menor engrenagem
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

        // Se o RPM de entrada for maior que 0, calcula a duração e inicia a animação
        if (rpmEntrada > 0) {
            // A duração da animação é inversamente proporcional ao RPM
            // Fórmula: Duração (s) = 60 / RPM
            const duracao1 = 60 / rpmEntrada;
            const duracao2 = 60 / rpmSaida;

            // Define a duração da animação para cada engrenagem
            gear1.style.animationDuration = duracao1 + 's';
            gear2.style.animationDuration = duracao2 + 's';
            
            // Define o sentido de rotação oposto para a segunda engrenagem
            gear2.style.animationDirection = 'reverse';

            // Inicia a animação
            gear1.style.animationPlayState = 'running';
            gear2.style.animationPlayState = 'running';
        } else {
            // Se o RPM for 0, pausa a animação
            gear1.style.animationPlayState = 'paused';
            gear2.style.animationPlayState = 'paused';
        }
    }

    // --- EVENT LISTENER ---
    calcularBtn.addEventListener('click', calcularAnimar);
});

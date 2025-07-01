// Espera o documento HTML ser completamente carregado para executar o script
document.addEventListener('DOMContentLoaded', function() {
    inicializarApp();
});

/**
 * Função principal que configura todos os eventos da aplicação.
 */
function inicializarApp() {
    // [MELHORIA 4: LIMPAR RESULTADOS]
    // Seleciona todos os campos de input numérico
    const inputs = document.querySelectorAll('.campo-calculo');

    // Adiciona um evento a cada campo: ao digitar, o resultado anterior some
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            // Encontra o painel da calculadora pai deste input
            const painelPai = input.closest('.calculadora');
            if (painelPai) {
                // Encontra a div de resultado dentro do painel e a esconde
                const divResultado = painelPai.querySelector('.resultado');
                if (divResultado) {
                    divResultado.style.display = 'none';
                    // Remove a classe de animação para que possa ser aplicada novamente
                    divResultado.classList.remove('fade-in'); 
                }
            }
        });
    });
}

/**
 * Mostra a calculadora selecionada e esconde as outras.
 * @param {string} idCalculadora O ID do elemento da calculadora a ser mostrado.
 */
function mostrarCalculadora(idCalculadora) {
    document.querySelectorAll('.calculadora').forEach(calc => {
        calc.classList.add('hidden');
    });
    document.querySelectorAll('.nav-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(idCalculadora).classList.remove('hidden');
    document.getElementById('btn-nav-' + idCalculadora.split('-')[1]).classList.add('active');
}

/**
 * Exibe uma mensagem de resultado (sucesso ou erro) na div apropriada.
 * @param {string} idElemento O ID da div de resultado.
 * @param {string} htmlConteudo O HTML a ser inserido na div.
 * @param {boolean} isErro True se a mensagem for de erro.
 */
function exibirResultado(idElemento, htmlConteudo, isErro = false) {
    const el = document.getElementById(idElemento);
    el.innerHTML = htmlConteudo;
    el.style.display = 'block';
    el.className = 'resultado'; // Reseta as classes
    
    // Adiciona a classe de erro ou sucesso e a animação de fade-in
    el.classList.add(isErro ? 'erro' : 'sucesso');
    el.classList.add('fade-in'); // [MELHORIA 3: FEEDBACK VISUAL]
}

// --- Funções de Cálculo (sem alteração na lógica matemática) ---

function calcularVelocidadeDireta() {
    const n_motor = parseFloat(document.getElementById('direto-n-motor').value);
    const i_redutor = parseFloat(document.getElementById('direto-i-redutor').value);
    const d_rolo = parseFloat(document.getElementById('direto-d-rolo').value);
    const resultadoEl = 'resultado-direto';

    if (isNaN(n_motor) || isNaN(i_redutor) || isNaN(d_rolo)) {
        exibirResultado(resultadoEl, '<p><strong>Erro:</strong> Por favor, preencha todos os campos com valores numéricos.</p>', true);
        return;
    }
    if (i_redutor <= 0 || d_rolo <= 0) {
        exibirResultado(resultadoEl, '<p><strong>Erro:</strong> A relação de redução e o diâmetro do rolo devem ser maiores que zero.</p>', true);
        return;
    }

    const rpm_rolo = n_motor / i_redutor;
    const v_correia_m_min = (Math.PI * d_rolo * rpm_rolo) / 1000;

    const htmlResultado = `
        <p>Rotação no Eixo do Rolo: <strong>${rpm_rolo.toFixed(2)} RPM</strong></p>
        <p>Velocidade da Correia: <strong>${v_correia_m_min.toFixed(2)} m/min</strong></p>
    `;
    exibirResultado(resultadoEl, htmlResultado);
}

function calcularVelocidadeIndireta() {
    const n_motor = parseFloat(document.getElementById('indireto-n-motor').value);
    const d_polia_motora = parseFloat(document.getElementById('indireto-d-polia-motora').value);
    const d_polia_movida = parseFloat(document.getElementById('indireto-d-polia-movida').value);
    const i_redutor = parseFloat(document.getElementById('indireto-i-redutor').value);
    const d_rolo = parseFloat(document.getElementById('indireto-d-rolo').value);
    const resultadoEl = 'resultado-indireto';

    if (isNaN(n_motor) || isNaN(d_polia_motora) || isNaN(d_polia_movida) || isNaN(i_redutor) || isNaN(d_rolo)) {
        exibirResultado(resultadoEl, '<p><strong>Erro:</strong> Por favor, preencha todos os campos com valores numéricos.</p>', true);
        return;
    }
    if (d_polia_movida <= 0 || i_redutor <= 0 || d_rolo <= 0 || d_polia_motora <= 0) {
        exibirResultado(resultadoEl, '<p><strong>Erro:</strong> Todos os diâmetros e a relação de redução devem ser maiores que zero.</p>', true);
        return;
    }
    
    const n_entrada_redutor = n_motor * (d_polia_motora / d_polia_movida);
    const rpm_rolo = n_entrada_redutor / i_redutor;
    const v_correia_m_min = (Math.PI * d_rolo * rpm_rolo) / 1000;

    const htmlResultado = `
        <p>Rotação na Entrada do Redutor: <strong>${n_entrada_redutor.toFixed(2)} RPM</strong></p>
        <p>Rotação no Eixo do Rolo: <strong>${rpm_rolo.toFixed(2)} RPM</strong></p>
        <p>Velocidade da Correia: <strong>${v_correia_m_min.toFixed(2)} m/min</strong></p>
    `;
    exibirResultado(resultadoEl, htmlResultado);
}
        
function calcularComprimentoBobina() {
    const d_externo = parseFloat(document.getElementById('bobina-d-externo').value);
    const d_interno = parseFloat(document.getElementById('bobina-d-interno').value);
    const e_correia = parseFloat(document.getElementById('bobina-e-correia').value);
    const resultadoEl = 'resultado-bobina';
    
    if (isNaN(d_externo) || isNaN(d_interno) || isNaN(e_correia)) {
        exibirResultado(resultadoEl, '<p><strong>Erro:</strong> Por favor, preencha todos os campos com valores numéricos.</p>', true);
        return;
    }
    if (e_correia <= 0) {
         exibirResultado(resultadoEl, '<p><strong>Erro:</strong> A espessura da correia deve ser maior que zero.</p>', true);
        return;
    }
     if (d_externo <= d_interno) {
        exibirResultado(resultadoEl, '<p><strong>Erro Lógico:</strong> O diâmetro externo deve ser maior que o diâmetro interno.</p>', true);
        return;
    }

    const numerador = Math.PI * (Math.pow(d_externo, 2) - Math.pow(d_interno, 2));
    const denominador = 4 * e_correia * 1000;
    const comprimento_metros = numerador / denominador;

    const htmlResultado = `
        <p>Comprimento estimado da correia: <strong>${comprimento_metros.toFixed(2)} metros</strong></p>
    `;
    exibirResultado(resultadoEl, htmlResultado);
}

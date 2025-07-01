// ===================================================================
// === SETUP INICIAL E GERENCIAMENTO DE EVENTOS
// ===================================================================

// Espera o documento HTML ser completamente carregado para executar o script
document.addEventListener('DOMContentLoaded', function() {
    inicializarApp();
});

/**
 * Função principal que configura todos os eventos da aplicação ao carregar.
 */
function inicializarApp() {
    // --- Configura eventos para as CALCULADORAS ---
    const inputsCalculadora = document.querySelectorAll('.campo-calculo');
    inputsCalculadora.forEach(input => {
        // Adiciona um evento a cada campo: ao digitar, o resultado anterior some
        input.addEventListener('input', function() {
            const painelPai = input.closest('.calculadora');
            if (painelPai) {
                const divResultado = painelPai.querySelector('.resultado');
                if (divResultado) {
                    divResultado.style.display = 'none';
                    divResultado.classList.remove('fade-in'); 
                }
            }
        });
    });
}


// ===================================================================
// === FUNÇÕES DE NAVEGAÇÃO E EXIBIÇÃO
// ===================================================================

/**
 * Mostra a calculadora/painel principal selecionado e esconde os outros.
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
    // Encontra o botão que controla este painel e o ativa
    // Ex: idCalculadora = 'calc-inverso-direto' -> split = ['calc', 'inverso', 'direto']
    // -> slice(1) = ['inverso', 'direto'] -> join('-') = 'inverso-direto'
    const btnIdSuffix = idCalculadora.split('-').slice(1).join('-');
    document.getElementById('btn-nav-' + btnIdSuffix).classList.add('active');
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
    
    el.classList.add(isErro ? 'erro' : 'sucesso');
    el.classList.add('fade-in');
}


// ===================================================================
// === LÓGICA DAS CALCULADORAS DE CORREIA TRANSPORTADORA
// ===================================================================

function calcularVelocidadeDireta() {
    const n_motor = parseFloat(document.getElementById('direto-n-motor').value);
    const i_redutor = parseFloat(document.getElementById('direto-i-redutor').value);
    const d_rolo = parseFloat(document.getElementById('direto-d-rolo').value);
    const t_volta = parseFloat(document.getElementById('direto-t-volta').value);
    const resultadoEl = 'resultado-direto';

    if (isNaN(n_motor) || isNaN(i_redutor) || isNaN(d_rolo) || isNaN(t_volta)) {
        exibirResultado(resultadoEl, '<p><strong>Erro:</strong> Por favor, preencha todos os campos com valores numéricos.</p>', true);
        return;
    }
    if (i_redutor <= 0 || d_rolo <= 0 || t_volta <= 0) {
        exibirResultado(resultadoEl, '<p><strong>Erro:</strong> A relação, o diâmetro e o tempo de volta devem ser maiores que zero.</p>', true);
        return;
    }

    const rpm_rolo = n_motor / i_redutor;
    const v_correia_m_min = (Math.PI * d_rolo * rpm_rolo) / 1000;
    const comprimento_total = (v_correia_m_min / 60) * t_volta;

    const htmlResultado = `
        <p>Rotação no Eixo do Rolo: <strong>${rpm_rolo.toFixed(2)} RPM</strong></p>
        <p>Velocidade da Correia: <strong>${v_correia_m_min.toFixed(2)} m/min</strong></p>
        <p style="border-top: 1px solid #ccc; padding-top: 10px; margin-top: 10px;">Comprimento Total da Correia: <strong>${comprimento_total.toFixed(2)} metros</strong></p>
    `;
    exibirResultado(resultadoEl, htmlResultado);
}

function calcularVelocidadeIndireta() {
    const n_motor = parseFloat(document.getElementById('indireto-n-motor').value);
    const d_polia_motora = parseFloat(document.getElementById('indireto-d-polia-motora').value);
    const d_polia_movida = parseFloat(document.getElementById('indireto-d-polia-movida').value);
    const i_redutor = parseFloat(document.getElementById('indireto-i-redutor').value);
    const d_rolo = parseFloat(document.getElementById('indireto-d-rolo').value);
    const t_volta = parseFloat(document.getElementById('indireto-t-volta').value);
    const resultadoEl = 'resultado-indireto';

    if (isNaN(n_motor) || isNaN(d_polia_motora) || isNaN(d_polia_movida) || isNaN(i_redutor) || isNaN(d_rolo) || isNaN(t_volta)) {
        exibirResultado(resultadoEl, '<p><strong>Erro:</strong> Por favor, preencha todos os campos com valores numéricos.</p>', true);
        return;
    }
    if (d_polia_movida <= 0 || i_redutor <= 0 || d_rolo <= 0 || d_polia_motora <= 0 || t_volta <= 0) {
        exibirResultado(resultadoEl, '<p><strong>Erro:</strong> Todos os diâmetros, a relação e o tempo de volta devem ser maiores que zero.</p>', true);
        return;
    }
    
    const n_entrada_redutor = n_motor * (d_polia_motora / d_polia_movida);
    const rpm_rolo = n_entrada_redutor / i_redutor;
    const v_correia_m_min = (Math.PI * d_rolo * rpm_rolo) / 1000;
    const comprimento_total = (v_correia_m_min / 60) * t_volta;

    const htmlResultado = `
        <p>Rotação na Entrada do Redutor: <strong>${n_entrada_redutor.toFixed(2)} RPM</strong></p>
        <p>Rotação no Eixo do Rolo: <strong>${rpm_rolo.toFixed(2)} RPM</strong></p>
        <p>Velocidade da Correia: <strong>${v_correia_m_min.toFixed(2)} m/min</strong></p>
        <p style="border-top: 1px solid #ccc; padding-top: 10px; margin-top: 10px;">Comprimento Total da Correia: <strong>${comprimento_total.toFixed(2)} metros</strong></p>
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

// ===================================================================
// === LÓGICA DAS CALCULADORAS INVERSAS
// ===================================================================

function calcularRedutorDireto() {
    const v_correia = parseFloat(document.getElementById('inv-direto-velocidade').value);
    const n_motor = parseFloat(document.getElementById('inv-direto-n-motor').value);
    const d_rolo = parseFloat(document.getElementById('inv-direto-d-rolo').value);
    const resultadoEl = 'resultado-inverso-direto';

    if (isNaN(v_correia) || isNaN(n_motor) || isNaN(d_rolo)) {
        exibirResultado(resultadoEl, '<p><strong>Erro:</strong> Por favor, preencha todos os campos com valores numéricos.</p>', true);
        return;
    }
    if (v_correia <= 0 || n_motor <= 0 || d_rolo <= 0) {
        exibirResultado(resultadoEl, '<p><strong>Erro:</strong> Velocidade, rotação do motor e diâmetro do rolo devem ser maiores que zero.</p>', true);
        return;
    }

    // Passo 1: Descobrir a rotação do rolo a partir da velocidade da correia
    const rpm_rolo = (v_correia * 1000) / (Math.PI * d_rolo);

    // Passo 2: Descobrir a relação de redução
    const i_redutor = n_motor / rpm_rolo;

    const htmlResultado = `
        <p>Rotação Calculada do Rolo: <strong>${rpm_rolo.toFixed(2)} RPM</strong></p>
        <p style="border-top: 1px solid #ccc; padding-top: 10px; margin-top: 10px;">Relação de Redução Teórica: <strong>${i_redutor.toFixed(2)} : 1</strong></p>
        <p class="aviso-pratico"><strong>Nota:</strong> Este é o valor teórico. Procure por um redutor com a relação padrão de mercado mais próxima (ex: 15:1, 20:1, 30:1).</p>
    `;
    exibirResultado(resultadoEl, htmlResultado);
}

function calcularRedutorComPolias() {
    const v_correia = parseFloat(document.getElementById('inv-polias-velocidade').value);
    const n_motor = parseFloat(document.getElementById('inv-polias-n-motor').value);
    const d_polia_motora = parseFloat(document.getElementById('inv-polias-d-polia-motora').value);
    const d_polia_movida = parseFloat(document.getElementById('inv-polias-d-polia-movida').value);
    const d_rolo = parseFloat(document.getElementById('inv-polias-d-rolo').value);
    const resultadoEl = 'resultado-inverso-polias';

    if (isNaN(v_correia) || isNaN(n_motor) || isNaN(d_polia_motora) || isNaN(d_polia_movida) || isNaN(d_rolo)) {
        exibirResultado(resultadoEl, '<p><strong>Erro:</strong> Por favor, preencha todos os campos com valores numéricos.</p>', true);
        return;
    }
    if (v_correia <= 0 || n_motor <= 0 || d_polia_motora <= 0 || d_polia_movida <= 0 || d_rolo <= 0) {
        exibirResultado(resultadoEl, '<p><strong>Erro:</strong> Todos os valores devem ser maiores que zero.</p>', true);
        return;
    }

    // Passo 1: Descobrir a rotação do rolo a partir da velocidade da correia
    const rpm_rolo = (v_correia * 1000) / (Math.PI * d_rolo);

    // Passo 2: Calcular a rotação que chega ao redutor (após a transmissão por polias)
    const n_entrada_redutor = n_motor * (d_polia_motora / d_polia_movida);

    // Passo 3: Descobrir a relação de redução
    const i_redutor = n_entrada_redutor / rpm_rolo;

    const htmlResultado = `
        <p>Rotação Calculada do Rolo: <strong>${rpm_rolo.toFixed(2)} RPM</strong></p>
        <p>Rotação na Entrada do Redutor: <strong>${n_entrada_redutor.toFixed(2)} RPM</strong></p>
        <p style="border-top: 1px solid #ccc; padding-top: 10px; margin-top: 10px;">Relação de Redução Teórica: <strong>${i_redutor.toFixed(2)} : 1</strong></p>
        <p class="aviso-pratico"><strong>Nota:</strong> Este é o valor teórico. Procure por um redutor com a relação padrão de mercado mais próxima (ex: 15:1, 20:1, 30:1).</p>
    `;
    exibirResultado(resultadoEl, htmlResultado);
}

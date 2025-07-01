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

    // --- Configura eventos para o CONVERSOR DE UNIDADES ---
    const inputsConversor = document.querySelectorAll('.conversor-input, .conversor-select');
    inputsConversor.forEach(el => {
        // 'input' para o campo de número, 'change' para os selects
        const eventType = el.tagName === 'INPUT' ? 'input' : 'change';
        el.addEventListener(eventType, converterUnidades);
    });
    
    // Dispara a primeira conversão ao carregar a página para mostrar um valor inicial
    converterUnidades();
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
    // Encontra o botão que controla este painel pelo seu ID e o ativa
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
// === LÓGICA DO CONVERSOR DE UNIDADES
// ===================================================================

// Objeto que armazena todos os fatores de conversão para uma unidade base.
// A unidade base é a referência para todos os outros cálculos na mesma categoria.
const FATORES = {
    comprimento: { // Base: Metro (m)
        'm': 1, 'km': 1000, 'cm': 0.01, 'mm': 0.001, 'in': 0.0254, 'ft': 0.3048, 'mi': 1609.34
    },
    massa: { // Base: Quilograma (kg)
        'kg': 1, 'g': 0.001, 't': 1000, 'lb': 0.453592, 'oz': 0.0283495
    },
    pressao: { // Base: Pascal (Pa)
        'pa': 1, 'kpa': 1000, 'bar': 100000, 'psi': 6894.76, 'atm': 101325, 'kgfcm2': 98066.5
    },
    area: { // Base: Metro Quadrado (m²)
        'm2': 1, 'km2': 1000000, 'ha': 10000, 'ft2': 0.092903, 'ac': 4046.86
    },
    volume: { // Base: Metro Cúbico (m³)
        'm3': 1, 'l': 0.001, 'ml': 0.000001, 'gal': 0.00378541, 'ft3': 0.0283168
    }
};

/**
 * Mostra o painel de conversão selecionado dentro da aba do conversor.
 * @param {string} idPainel O ID do painel a ser mostrado.
 */
function mostrarPainelConversao(idPainel) {
    document.querySelectorAll('.painel-conversao').forEach(painel => {
        painel.classList.add('hidden');
    });
    document.querySelectorAll('.sub-nav-button').forEach(btn => {
        btn.classList.remove('active');
    });

    const painelAtivo = document.getElementById(idPainel);
    painelAtivo.classList.remove('hidden');
    document.querySelector(`.sub-nav-button[onclick="mostrarPainelConversao('${idPainel}')"]`).classList.add('active');
    
    converterUnidades();
}

/**
 * Função central que realiza a conversão de unidades em tempo real.
 */
function converterUnidades() {
    const painelAtivo = document.querySelector('.painel-conversao:not(.hidden)');
    if (!painelAtivo) return;

    const prefixo = painelAtivo.id.split('-')[1]; 
    const categoria = prefixo === 'comp' ? 'comprimento' : prefixo;

    const inputValor = document.getElementById(`${prefixo}-valor`);
    const selectDe = document.getElementById(`${prefixo}-de`);
    const selectPara = document.getElementById(`${prefixo}-para`);
    const inputResultado = document.getElementById(`${prefixo}-resultado`);

    const valor = parseFloat(inputValor.value);
    if (isNaN(valor)) {
        inputResultado.value = '...';
        return;
    }
    
    const unidadeDe = selectDe.value;
    const unidadePara = selectPara.value;
    
    // Lógica da conversão:
    // 1. Converte o valor de entrada para a unidade base
    const valorBase = valor * FATORES[categoria][unidadeDe];
    // 2. Converte o valor base para a unidade de destino
    const valorFinal = valorBase / FATORES[categoria][unidadePara];

    // Formata o número para exibição, usando notação científica se for muito pequeno
    if (valorFinal < 0.0001 && valorFinal > 0) {
        inputResultado.value = valorFinal.toExponential(4);
    } else {
        // Usa toLocaleString para formatação local e limita as casas decimais.
        inputResultado.value = valorFinal.toLocaleString(undefined, { 
            minimumFractionDigits: 0, 
            maximumFractionDigits: 6 
        });
    }
}

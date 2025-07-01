// Objeto central com todos os fatores de conversão.
// A chave de cada objeto é a unidade base (metro, quilograma, pascal, etc.).
// Todos os outros valores são multiplicadores para converter PARA a unidade base.
const fatoresDeConversao = {
    comprimento: {
        m: 1,
        km: 1000,
        cm: 0.01,
        mm: 0.001,
        in: 0.0254,
        ft: 0.3048,
        mi: 1609.34
    },
    massa: {
        kg: 1,
        g: 0.001,
        t: 1000,
        lb: 0.453592,
        oz: 0.0283495
    },
    pressao: {
        pa: 1,
        bar: 100000,
        kpa: 1000,
        psi: 6894.76,
        atm: 101325,
        kgfcm2: 98066.5
    },
    area: {
        m2: 1,
        km2: 1000000,
        ha: 10000,
        ft2: 0.092903,
        ac: 4046.86
    },
    volume: {
        l: 1,
        m3: 1000,
        ml: 0.001,
        gal: 3.78541,
        ft3: 28.3168
    }
};

// Objeto para mapear o nome da categoria ao seu prefixo de ID.
// Esta é a principal correção para garantir que os elementos sejam encontrados corretamente.
const mapeamentoCategoria = {
    comprimento: { prefixo: 'comp' },
    massa: { prefixo: 'massa' },
    pressao: { prefixo: 'pressao' },
    area: { prefixo: 'area' },
    volume: { prefixo: 'volume' }
};


// Função para mostrar o painel correto e atualizar o botão ativo
function mostrarPainelConversao(idDoPainel) {
    // Esconde todos os painéis
    document.querySelectorAll('.painel-conversao').forEach(painel => {
        painel.classList.add('hidden');
    });

    // Remove a classe 'active' de todos os botões
    document.querySelectorAll('.sub-nav-button').forEach(button => {
        button.classList.remove('active');
    });

    // Mostra o painel selecionado
    document.getElementById(idDoPainel).classList.remove('hidden');

    // Adiciona a classe 'active' ao botão correspondente
    document.querySelector(`button[onclick="mostrarPainelConversao('${idDoPainel}')"]`).classList.add('active');
    
    // Extrai o nome da categoria do ID do painel (ex: 'comprimento')
    const categoria = idDoPainel.replace('painel-', '');
    // Realiza a conversão para o painel que acabou de ser exibido
    converter(categoria);
}

// Função de conversão genérica (CORRIGIDA)
function converter(categoria) {
    // Usa o objeto de mapeamento para obter o prefixo correto
    const prefixo = mapeamentoCategoria[categoria].prefixo;

    // Monta os IDs dos elementos com base no prefixo correto
    const valorInput = document.getElementById(`${prefixo}-valor`);
    const deSelect = document.getElementById(`${prefixo}-de`);
    const paraSelect = document.getElementById(`${prefixo}-para`);
    const resultadoInput = document.getElementById(`${prefixo}-resultado`);

    // Verifica se todos os elementos foram encontrados antes de prosseguir
    if (!valorInput || !deSelect || !paraSelect || !resultadoInput) {
        console.error(`Erro: Um ou mais elementos não foram encontrados para a categoria '${categoria}' com o prefixo '${prefixo}'.`);
        return;
    }

    const valor = parseFloat(valorInput.value);
    const deUnidade = deSelect.value;
    const paraUnidade = paraSelect.value;
    
    if (isNaN(valor)) {
        resultadoInput.value = '';
        return;
    }

    const fatores = fatoresDeConversao[categoria];
    const valorNaBase = valor * fatores[deUnidade];
    const resultado = valorNaBase / fatores[paraUnidade];

    // Formata o número para evitar resultados excessivamente longos
    if (resultado === 0) {
        resultadoInput.value = 0;
    } else if (resultado < 0.0001 || resultado > 10000000) {
        resultadoInput.value = resultado.toExponential(4); // Notação científica para números muito grandes/pequenos
    } else {
        resultadoInput.value = parseFloat(resultado.toPrecision(7)); // Precisão normal para outros casos
    }
}

// Adiciona os "ouvintes de eventos" para todos os painéis
function inicializarConversores() {
    // Itera sobre as chaves do nosso objeto de mapeamento
    Object.keys(mapeamentoCategoria).forEach(categoria => {
        const prefixo = mapeamentoCategoria[categoria].prefixo;
        const valorInput = document.getElementById(`${prefixo}-valor`);
        const deSelect = document.getElementById(`${prefixo}-de`);
        const paraSelect = document.getElementById(`${prefixo}-para`);

        // Adiciona um listener que chama a função de conversão sempre que um valor ou select for alterado
        [valorInput, deSelect, paraSelect].forEach(element => {
            if (element) {
                element.addEventListener('input', () => converter(categoria));
                element.addEventListener('change', () => converter(categoria));
            }
        });
    });
}

// Inicializa os conversores e realiza a primeira conversão ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    inicializarConversores();
    converter('comprimento'); // Calcula o valor inicial para o painel de comprimento
});

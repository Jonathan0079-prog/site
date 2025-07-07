// Aguarda o carregamento completo do conteúdo da página antes de executar o script
document.addEventListener('DOMContentLoaded', () => {

    // Seleciona os elementos da página com os quais vamos interagir
    const inputSpec = document.getElementById('bearing-spec');
    const calculateBtn = document.getElementById('calculate-btn');
    const clearBtn = document.getElementById('clear-btn');
    const resultDisplay = document.getElementById('result-display');
    const themeToggle = document.getElementById('theme-toggle-checkbox');

    /**
     * Função principal que calcula o diâmetro do furo do rolamento.
     */
    function performCalculation() {
        const spec = inputSpec.value.trim();
        inputSpec.classList.remove('invalid'); // Remove a classe de erro, se houver

        // 1. Validação de entrada
        if (spec.length < 2) {
            displayResult('Erro: A especificação deve ter pelo menos 2 caracteres.', 'error');
            inputSpec.classList.add('invalid');
            return;
        }

        const boreCodeStr = spec.slice(-2);
        const boreCodeInt = parseInt(boreCodeStr, 10);

        if (isNaN(boreCodeInt)) {
            displayResult('Erro: Os 2 últimos caracteres devem ser numéricos.', 'error');
            inputSpec.classList.add('invalid');
            return;
        }

        // 2. Lógica de cálculo conforme o padrão ISO
        let diameter = null;

        switch (boreCodeInt) {
            case 0:
                diameter = 10;
                break;
            case 1:
                diameter = 12;
                break;
            case 2:
                diameter = 15;
                break;
            case 3:
                diameter = 17;
                break;
            default:
                if (boreCodeInt >= 4 && boreCodeInt <= 96) {
                    diameter = boreCodeInt * 5;
                }
        }

        // 3. Exibição do resultado
        if (diameter !== null) {
            const message = `Para a especificação '${spec}' (código ${boreCodeStr})`;
            displayResult(message, 'success', `${diameter} mm`);
        } else {
            const message = `O código '${boreCodeStr}' não segue a regra padrão ou está fora do intervalo comum (00-96).`;
            displayResult(message, 'warning', 'Verificar');
        }
    }

    /**
     * Função para exibir o resultado formatado na tela.
     * @param {string} label - O texto descritivo do resultado.
     * @param {'success'|'error'|'warning'} type - O tipo de resultado para estilização.
     * @param {string} [value='-'] - O valor principal a ser exibido.
     */
    function displayResult(label, type, value = '-') {
        resultDisplay.innerHTML = `
            <div class="result-item ${type}">
                <span class="label">${label}</span>
                <span class="value">${value}</span>
            </div>
        `;
    }

    /**
     * Função para limpar os campos de entrada e o resultado.
     */
    function clearFields() {
        inputSpec.value = '';
        inputSpec.classList.remove('invalid');
        displayResult('Aguardando cálculo...', '', '-');
        inputSpec.focus(); // Coloca o cursor de volta no campo de entrada
    }
    
    /**
     * Função para alternar o tema da página.
     */
    function toggleTheme() {
        document.body.classList.toggle('dark-theme');
        // Opcional: Salvar a preferência do usuário no localStorage
        if (document.body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    }
    
    /**
     * Função para carregar o tema salvo pelo usuário.
     */
    function loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggle.checked = true;
        }
    }


    // --- Event Listeners (Ouvintes de Eventos) ---

    // Carrega o tema salvo ao iniciar a página
    loadTheme();
    
    // Adiciona o evento de clique ao botão de calcular
    calculateBtn.addEventListener('click', performCalculation);
    
    // Adiciona o evento de clique ao botão de limpar
    clearBtn.addEventListener('click', clearFields);
    
    // Adiciona o evento de troca ao seletor de tema
    themeToggle.addEventListener('change', toggleTheme);

    // Permite que o usuário pressione "Enter" para calcular
    inputSpec.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            performCalculation();
        }
    });
});

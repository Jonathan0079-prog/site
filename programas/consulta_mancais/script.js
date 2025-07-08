// Espera o conteúdo da página carregar completamente antes de executar o script
document.addEventListener('DOMContentLoaded', () => {

    // --- BASE DE DADOS (convertida para um objeto JavaScript) ---
    const DB_MANCAIS = {
        "SN 518": {
            designacao_completa: "Mancal Bipartido SN / SNL / SNAL 518",
            descricao: "Mancal bipartido padrão para montagem com rolamentos autocompensadores em eixo de 80 mm (com bucha) ou 90 mm (com assento cilíndrico). A montagem com bucha é a mais comum.",
            dimensoes: {
                "Diâmetro do Eixo (com bucha)": "80 mm",
                "Altura do Centro do Eixo (a)": "100 mm",
                "Distância entre Furos da Base (J)": "290 mm",
                "Comprimento da Base (L)": "345 mm",
                "Largura da Base (A1)": "100 mm",
                "Diâmetro do Alojamento (Da)": "160 mm",
                "Parafuso da Base (recomendado)": "M20 (4x)"
            },
            rolamentos_compativeis: [
                { tipo: "Autocompensador de Esferas", rolamento: "1218 K", bucha: "H 218", anel_fixacao: "FRB 16.2/160", obs: "Para cargas leves a normais e velocidades mais altas." },
                { tipo: "Autocompensador de Esferas", rolamento: "2218 K", bucha: "H 318", anel_fixacao: "FRB 11.2/160", obs: "Para cargas normais e velocidades moderadas." },
                { tipo: "Autocompensador de Rolos", rolamento: "22218 K / EK", bucha: "H 318", anel_fixacao: "FRB 11.2/160", obs: "Aplicação mais comum. Cargas radiais e axiais pesadas." },
                { tipo: "Autocompensador de Rolos", rolamento: "23218 K / CK", bucha: "H 2318", anel_fixacao: "FRB 6.25/160", obs: "Para cargas radiais e axiais muito pesadas. Série mais robusta." }
            ],
            vedacoes_compativeis: [
                { designacao: "TSNA 518 C", tipo: "Vedação de Feltro", aplicacao: "Uso geral, lubrificação a graxa." },
                { designacao: "TSNA 518 A", tipo: "Vedação V-Ring (Borracha)", aplicacao: "Proteção adicional contra poeira e umidade." },
                { designacao: "TSNA 518 G", tipo: "Vedação de Labirinto", aplicacao: "Altas velocidades e/ou altas temperaturas." },
                { designacao: "TSNA 518 S", tipo: "Vedação Taconite", aplicacao: "Ambientes extremamente contaminados (mineração, cimento)." },
                { designacao: "ASNH 518-615", tipo: "Tampa Cega (Fechada)", aplicacao: "Para fechar a extremidade de um eixo não passante." }
            ],
            notas_tecnicas: [
                "Para uma montagem fixa (que restringe o movimento axial), use dois anéis de fixação (FRB). Para uma montagem livre, não use anéis.",
                "A lubrificação recomendada é a graxa. Verifique o manual do fabricante para o tipo e quantidade corretos.",
                "O torque de aperto dos parafusos da base e da tampa do mancal é crucial para a vida útil do rolamento."
            ]
        },
        "SN 519": {
            designacao_completa: "Mancal Bipartido SN / SNL / SNAL 519",
            descricao: "Mancal bipartido padrão para montagem com rolamentos autocompensadores em eixo de 85 mm (com bucha) ou 95 mm (com assento cilíndrico).",
            dimensoes: {
                "Diâmetro do Eixo (com bucha)": "85 mm",
                "Altura do Centro do Eixo (a)": "105 mm",
                "Distância entre Furos da Base (J)": "300 mm",
                "Comprimento da Base (L)": "365 mm",
                "Largura da Base (A1)": "105 mm",
                "Diâmetro do Alojamento (Da)": "170 mm",
                "Parafuso da Base (recomendado)": "M20 (4x)"
            },
            rolamentos_compativeis: [
                { tipo: "Autocompensador de Rolos", rolamento: "22219 K / EK", bucha: "H 319", anel_fixacao: "FRB 12.5/170", obs: "Aplicação mais comum para cargas pesadas." }
            ],
            vedacoes_compativeis: [
                { designacao: "TSNA 519 C", tipo: "Vedação de Feltro", aplicacao: "Uso geral." },
                { designacao: "ASNH 519", tipo: "Tampa Cega (Fechada)", aplicacao: "Para fechar a extremidade de um eixo não passante." }
            ],
            notas_tecnicas: [
                "Sempre consulte o catálogo do fabricante para obter as informações mais atualizadas."
            ]
        }
        // ADICIONE NOVOS MANCAIS AQUI SEGUINDO A MESMA ESTRUTURA
    };

    // Seleciona os elementos do HTML com os quais vamos interagir
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('results-container');

    // Função para exibir a lista inicial de mancais disponíveis
    function displayAvailableMancais() {
        const availableKeys = Object.keys(DB_MANCAIS);
        const listItems = availableKeys.map(key => `<li>${key}</li>`).join('');
        
        resultsContainer.innerHTML = `
            <div class="mancais-disponiveis">
                <strong>Mancais na base de dados:</strong>
                <ul>
                    ${listItems}
                </ul>
            </div>
        `;
    }

    // Função que gera o HTML para exibir os dados de um mancal
    function displayMancalData(mancal) {
        // Gera as linhas da tabela de dimensões
        const dimensoesRows = Object.entries(mancal.dimensoes)
            .map(([chave, valor]) => `<tr><td>${chave}</td><td>${valor}</td></tr>`)
            .join('');

        // Gera as linhas da tabela de rolamentos
        const rolamentosRows = mancal.rolamentos_compativeis
            .map(r => `<tr><td>${r.rolamento}</td><td>${r.bucha}</td><td>${r.anel_fixacao}</td><td>${r.obs}</td></tr>`)
            .join('');

        // Gera as linhas da tabela de vedações
        const vedacoesRows = mancal.vedacoes_compativeis
            .map(v => `<tr><td>${v.designacao}</td><td>${v.tipo}</td><td>${v.aplicacao}</td></tr>`)
            .join('');
        
        // Gera a lista de notas técnicas
        const notasList = mancal.notas_tecnicas
            .map(nota => `<li>${nota}</li>`)
            .join('');

        // Monta o HTML final com todos os dados
        resultsContainer.innerHTML = `
            <div class="mancal-info">
                <h2 class="section-title">${mancal.designacao_completa}</h2>
                <p>${mancal.descricao}</p>

                <h3 class="section-title">Especificações Dimensionais</h3>
                <table>
                    <thead><tr><th>Parâmetro</th><th>Valor</th></tr></thead>
                    <tbody>${dimensoesRows}</tbody>
                </table>

                <h3 class="section-title">Tabela de Rolamentos Compatíveis</h3>
                <table>
                    <thead><tr><th>Rolamento</th><th>Bucha</th><th>Anel Fixação</th><th>Observação</th></tr></thead>
                    <tbody>${rolamentosRows}</tbody>
                </table>

                <h3 class="section-title">Tabela de Vedações Compatíveis</h3>
                <table>
                    <thead><tr><th>Designação</th><th>Tipo</th><th>Aplicação</th></tr></thead>
                    <tbody>${vedacoesRows}</tbody>
                </table>
                
                <h3 class="section-title">Notas Técnicas</h3>
                <ul>${notasList}</ul>
            </div>
        `;
    }

    // Função para exibir uma mensagem de erro
    function displayError(searchTerm) {
        resultsContainer.innerHTML = `
            <div class="error-message">
                <p>O mancal '${searchTerm}' não foi encontrado na base de dados.</p>
            </div>
        `;
    }

    // Adiciona um "escutador" ao formulário para o evento de "submit" (envio)
    searchForm.addEventListener('submit', (event) => {
        // Previne o comportamento padrão do formulário, que é recarregar a página
        event.preventDefault(); 
        
        // Pega o valor digitado, remove espaços e converte para maiúsculas
        const searchTerm = searchInput.value.trim().toUpperCase();

        if (searchTerm) {
            // Verifica se o termo pesquisado existe como uma chave na nossa base de dados
            if (DB_MANCAIS[searchTerm]) {
                displayMancalData(DB_MANCAIS[searchTerm]);
            } else {
                displayError(searchTerm);
            }
        } else {
            // Se o usuário clicar em buscar sem digitar nada, mostra a lista inicial
            displayAvailableMancais();
        }
    });

    // Exibe a lista de mancais disponíveis assim que a página carrega
    displayAvailableMancais();
});

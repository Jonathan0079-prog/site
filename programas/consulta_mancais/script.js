document.addEventListener('DOMContentLoaded', () => {

    // --- BASE DE DADOS GIGANTE ---
    // A nomenclatura SN, SNL, SNH é frequentemente intercambiável para fins de compatibilidade de rolamentos.
    // Usaremos SNL como padrão para a série 500/600.
    const DB_MANCAIS = {
        // =================================================================================
        // SÉRIE SNL (Padrão para eixos pequenos e médios)
        // =================================================================================
        "SNL 505": {
            tipo: "Bipartido Padrão",
            designacao_completa: "Mancal Bipartido SNL 505",
            eixo_mm: 20,
            rolamentos_compativeis: [
                { tipo: "Autocompensador de Esferas", rolamento: "1205 K", bucha: "H 205" },
                { tipo: "Autocompensador de Rolos", rolamento: "22205 K", bucha: "H 305" }
            ],
            vedacoes_compativeis: ["TSN 505 L", "TSN 505 S"]
        },
        "SNL 506": {
            tipo: "Bipartido Padrão",
            designacao_completa: "Mancal Bipartido SNL 506",
            eixo_mm: 25,
            rolamentos_compativeis: [
                { tipo: "Autocompensador de Esferas", rolamento: "1206 K", bucha: "H 206" },
                { tipo: "Autocompensador de Rolos", rolamento: "22206 K", bucha: "H 306" }
            ],
            vedacoes_compativeis: ["TSN 506 L", "TSN 506 S"]
        },
        "SNL 507": {
            tipo: "Bipartido Padrão",
            designacao_completa: "Mancal Bipartido SNL 507",
            eixo_mm: 30,
            rolamentos_compativeis: [
                { tipo: "Autocompensador de Esferas", rolamento: "1207 K", bucha: "H 207" },
                { tipo: "Autocompensador de Rolos", rolamento: "22207 K", bucha: "H 307" }
            ],
            vedacoes_compativeis: ["TSN 507 L", "TSN 507 S"]
        },
        "SNL 508": {
            tipo: "Bipartido Padrão",
            designacao_completa: "Mancal Bipartido SNL 508",
            eixo_mm: 35, // Atenção: eixo para rol. esferas
            rolamentos_compativeis: [
                { tipo: "Autocompensador de Esferas", rolamento: "1208 K", bucha: "H 208", eixo: 35 },
                { tipo: "Autocompensador de Rolos", rolamento: "22208 K", bucha: "H 308", eixo: 35 }
            ],
            vedacoes_compativeis: ["TSN 508 L", "TSN 508 S"]
        },
        "SNL 509": {
            tipo: "Bipartido Padrão",
            designacao_completa: "Mancal Bipartido SNL 509",
            eixo_mm: 40,
            rolamentos_compativeis: [
                { tipo: "Autocompensador de Esferas", rolamento: "1209 K", bucha: "H 209" },
                { tipo: "Autocompensador de Rolos", rolamento: "22209 K", bucha: "H 309" }
            ],
            vedacoes_compativeis: ["TSN 509 L", "TSN 509 S"]
        },
        "SNL 510": {
            tipo: "Bipartido Padrão",
            designacao_completa: "Mancal Bipartido SNL 510",
            eixo_mm: 45,
            rolamentos_compativeis: [
                { tipo: "Autocompensador de Esferas", rolamento: "1210 K", bucha: "H 210" },
                { tipo: "Autocompensador de Rolos", rolamento: "22210 K", bucha: "H 310" }
            ],
            vedacoes_compativeis: ["TSN 510 L", "TSN 510 S"]
        },
        "SNL 511": {
            tipo: "Bipartido Padrão",
            designacao_completa: "Mancal Bipartido SNL 511",
            eixo_mm: 50,
            rolamentos_compativeis: [
                { tipo: "Autocompensador de Esferas", rolamento: "1211 K", bucha: "H 211" },
                { tipo: "Autocompensador de Rolos", rolamento: "22211 K", bucha: "H 311" }
            ],
            vedacoes_compativeis: ["TSN 511 L", "TSN 511 S"]
        },
        "SNL 512": {
            tipo: "Bipartido Padrão",
            designacao_completa: "Mancal Bipartido SNL 512",
            eixo_mm: 55,
            rolamentos_compativeis: [
                { tipo: "Autocompensador de Esferas", rolamento: "1212 K", bucha: "H 212" },
                { tipo: "Autocompensador de Rolos", rolamento: "22212 K", bucha: "H 312" }
            ],
            vedacoes_compativeis: ["TSN 512 L", "TSN 512 S"]
        },
        "SNL 513": {
            tipo: "Bipartido Padrão",
            designacao_completa: "Mancal Bipartido SNL 513",
            eixo_mm: 60,
            rolamentos_compativeis: [
                { tipo: "Autocompensador de Esferas", rolamento: "1213 K", bucha: "H 213" },
                { tipo: "Autocompensador de Rolos", rolamento: "22213 K", bucha: "H 313" }
            ],
            vedacoes_compativeis: ["TSN 513 L", "TSN 513 S"]
        },
        "SNL 515": {
            tipo: "Bipartido Padrão",
            designacao_completa: "Mancal Bipartido SNL 515",
            eixo_mm: 65,
            rolamentos_compativeis: [
                { tipo: "Autocompensador de Esferas", rolamento: "1215 K", bucha: "H 215" },
                { tipo: "Autocompensador de Rolos", rolamento: "22215 K", bucha: "H 315" }
            ],
            vedacoes_compativeis: ["TSN 515 L", "TSN 515 S"]
        },
        "SNL 516": {
            tipo: "Bipartido Padrão",
            designacao_completa: "Mancal Bipartido SNL 516",
            eixo_mm: 70,
            rolamentos_compativeis: [
                { tipo: "Autocompensador de Esferas", rolamento: "1216 K", bucha: "H 216" },
                { tipo: "Autocompensador de Rolos", rolamento: "22216 K", bucha: "H 316" }
            ],
            vedacoes_compativeis: ["TSN 516 L", "TSN 516 S"]
        },
        "SNL 517": {
            tipo: "Bipartido Padrão",
            designacao_completa: "Mancal Bipartido SNL 517",
            eixo_mm: 75,
            rolamentos_compativeis: [
                { tipo: "Autocompensador de Esferas", rolamento: "1217 K", bucha: "H 217" },
                { tipo: "Autocompensador de Rolos", rolamento: "22217 K", bucha: "H 317" }
            ],
            vedacoes_compativeis: ["TSN 517 L", "TSN 517 S"]
        },
        "SNL 518": {
            tipo: "Bipartido Padrão",
            designacao_completa: "Mancal Bipartido SNL 518",
            eixo_mm: 80,
            rolamentos_compativeis: [
                { tipo: "Autocompensador de Esferas", rolamento: "1218 K", bucha: "H 218" },
                { tipo: "Autocompensador de Rolos", rolamento: "22218 K", bucha: "H 318" }
            ],
            vedacoes_compativeis: ["TSN 518 L", "TSN 518 S"]
        },
        "SNL 520": {
            tipo: "Bipartido Padrão",
            designacao_completa: "Mancal Bipartido SNL 520",
            eixo_mm: 90,
            rolamentos_compativeis: [
                { tipo: "Autocompensador de Esferas", rolamento: "1220 K", bucha: "H 220" },
                { tipo: "Autocompensador de Rolos", rolamento: "22220 K", bucha: "H 320" }
            ],
            vedacoes_compativeis: ["TSN 520 L", "TSN 520 S"]
        },
        "SNL 522": {
            tipo: "Bipartido Padrão",
            designacao_completa: "Mancal Bipartido SNL 522",
            eixo_mm: 100,
            rolamentos_compativeis: [
                { tipo: "Autocompensador de Esferas", rolamento: "1222 K", bucha: "H 222" },
                { tipo: "Autocompensador de Rolos", rolamento: "22222 K", bucha: "H 322" }
            ],
            vedacoes_compativeis: ["TSN 522 L", "TSN 522 S"]
        },
        "SNL 524": {
            tipo: "Bipartido Padrão",
            designacao_completa: "Mancal Bipartido SNL 524",
            eixo_mm: 110,
            rolamentos_compativeis: [
                { tipo: "Autocompensador de Rolos", rolamento: "22224 K", bucha: "H 324" }
            ],
            vedacoes_compativeis: ["TSN 524 L", "TSN 524 S"]
        },
        "SNL 526": {
            tipo: "Bipartido Padrão",
            designacao_completa: "Mancal Bipartido SNL 526",
            eixo_mm: 115,
            rolamentos_compativeis: [
                { tipo: "Autocompensador de Rolos", rolamento: "22226 K", bucha: "H 3126" }
            ],
            vedacoes_compativeis: ["TSN 526 L", "TSN 526 S"]
        },
        "SNL 528": {
            tipo: "Bipartido Padrão",
            designacao_completa: "Mancal Bipartido SNL 528",
            eixo_mm: 125,
            rolamentos_compativeis: [
                { tipo: "Autocompensador de Rolos", rolamento: "22228 K", bucha: "H 3128" }
            ],
            vedacoes_compativeis: ["TSN 528 L", "TSN 528 S"]
        },
        "SNL 530": {
            tipo: "Bipartido Padrão",
            designacao_completa: "Mancal Bipartido SNL 530",
            eixo_mm: 135,
            rolamentos_compativeis: [
                { tipo: "Autocompensador de Rolos", rolamento: "22230 K", bucha: "H 3130" }
            ],
            vedacoes_compativeis: ["TSN 530 L", "TSN 530 S"]
        },
        "SNL 532": {
            tipo: "Bipartido Padrão",
            designacao_completa: "Mancal Bipartido SNL 532",
            eixo_mm: 150,
            rolamentos_compativeis: [
                { tipo: "Autocompensador de Rolos", rolamento: "22232 K", bucha: "H 3132" }
            ],
            vedacoes_compativeis: ["TSN 532 L", "TSN 532 S"]
        },
        // =================================================================================
        // SÉRIE SD (Heavy-Duty para eixos grandes)
        // =================================================================================
        "SD 3134": {
            tipo: "Bipartido Pesado",
            designacao_completa: "Mancal Bipartido SD 3134",
            eixo_mm: 150,
            rolamentos_compativeis: [
                { tipo: "Autocompensador de Rolos", rolamento: "23134 K", bucha: "H 3134" }
            ],
            vedacoes_compativeis: ["TSN 3134 L", "TSN 3134 S"]
        },
        "SD 3136": {
            tipo: "Bipartido Pesado",
            designacao_completa: "Mancal Bipartido SD 3136",
            eixo_mm: 160,
            rolamentos_compativeis: [
                { tipo: "Autocompensador de Rolos", rolamento: "23136 K", bucha: "H 3136" }
            ],
            vedacoes_compativeis: ["TSN 3136 L", "TSN 3136 S"]
        },
        "SD 3138": {
            tipo: "Bipartido Pesado",
            designacao_completa: "Mancal Bipartido SD 3138",
            eixo_mm: 170,
            rolamentos_compativeis: [
                { tipo: "Autocompensador de Rolos", rolamento: "23138 K", bucha: "H 3138" }
            ],
            vedacoes_compativeis: ["TSN 3138 L", "TSN 3138 S"]
        },
        // =================================================================================
        // SÉRIE FYT / FLT (Unidades Flangeadas com rolamento de inserção - Y-Bearing)
        // =================================================================================
        "FYT 20 TF": {
            tipo: "Unidade Flangeada Quadrada",
            designacao_completa: "Mancal Flangeado FYT 20 TF",
            eixo_mm: 20,
            unidade_rolamento: {
                rolamento_inserido: "YAR 204-2F",
                metodo_fixacao: "Parafusos de fixação (set screw)"
            },
            notas_tecnicas: "Vedações são parte integrante do rolamento inserido."
        },
        "FYT 25 TF": {
            tipo: "Unidade Flangeada Quadrada",
            designacao_completa: "Mancal Flangeado FYT 25 TF",
            eixo_mm: 25,
            unidade_rolamento: {
                rolamento_inserido: "YAR 205-2F",
                metodo_fixacao: "Parafusos de fixação (set screw)"
            },
            notas_tecnicas: "Vedações são parte integrante do rolamento inserido."
        },
        "FYT 30 TF": {
            tipo: "Unidade Flangeada Quadrada",
            designacao_completa: "Mancal Flangeado FYT 30 TF",
            eixo_mm: 30,
            unidade_rolamento: {
                rolamento_inserido: "YAR 206-2F",
                metodo_fixacao: "Parafusos de fixação (set screw)"
            },
            notas_tecnicas: "Vedações são parte integrante do rolamento inserido."
        },
        "FLT 20 TF": {
            tipo: "Unidade Flangeada Oval",
            designacao_completa: "Mancal Flangeado FLT 20 TF",
            eixo_mm: 20,
            unidade_rolamento: {
                rolamento_inserido: "YAR 204-2F",
                metodo_fixacao: "Parafusos de fixação (set screw)"
            },
            notas_tecnicas: "Vedações são parte integrante do rolamento inserido. Carcaça oval de 2 furos."
        },

    };

    // Seleciona os elementos do HTML
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('results-container');
    const yearSpan = document.getElementById('current-year');

    // Define o ano atual no rodapé
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Exibe a lista inicial de mancais
    function displayAvailableMancais() {
        const availableKeys = Object.keys(DB_MANCAIS);
        const listItems = availableKeys.map(key => `<li>${key}</li>`).join('');
        resultsContainer.innerHTML = `
            <div class="mancais-disponiveis">
                <strong>Mancais na base de dados:</strong>
                <ul>${listItems}</ul>
            </div>`;
    }

    // *** FUNÇÃO DE EXIBIÇÃO INTELIGENTE ***
    // Agora ela verifica o tipo de mancal e mostra os dados corretos.
    function displayMancalData(mancal) {
        let detailsHtml = `
            <div class="mancal-info">
                <h2 class="section-title">${mancal.designacao_completa}</h2>
                <p><strong>Tipo:</strong> ${mancal.tipo}</p>
                <p><strong>Diâmetro do Eixo Padrão:</strong> ${mancal.eixo_mm} mm</p>
            </div>`;

        // Lógica condicional: Se for um mancal bipartido (com rolamentos compatíveis)
        if (mancal.rolamentos_compativeis) {
            const rolamentosRows = mancal.rolamentos_compativeis
                .map(r => `<tr><td>${r.tipo}</td><td>${r.rolamento}</td><td>${r.bucha}</td></tr>`)
                .join('');
            
            const vedacoesRows = mancal.vedacoes_compativeis
                .map(v => `<tr><td>${v}</td></tr>`).join('');

            detailsHtml += `
                <h3 class="section-title">Combinações de Rolamentos e Buchas</h3>
                <table>
                    <thead><tr><th>Tipo de Rolamento</th><th>Designação do Rolamento</th><th>Bucha de Fixação</th></tr></thead>
                    <tbody>${rolamentosRows}</tbody>
                </table>
                <h3 class="section-title">Vedações Compatíveis</h3>
                <table>
                    <thead><tr><th>Designação da Vedação</th></tr></thead>
                    <tbody>${vedacoesRows}</tbody>
                </table>`;
        }

        // Lógica condicional: Se for uma unidade flangeada (com rolamento inserido)
        if (mancal.unidade_rolamento) {
            detailsHtml += `
                <h3 class="section-title">Especificação da Unidade</h3>
                <table>
                    <thead><tr><th>Componente</th><th>Designação</th></tr></thead>
                    <tbody>
                        <tr><td>Rolamento de Inserção</td><td>${mancal.unidade_rolamento.rolamento_inserido}</td></tr>
                        <tr><td>Método de Fixação no Eixo</td><td>${mancal.unidade_rolamento.metodo_fixacao}</td></tr>
                    </tbody>
                </table>`;
        }
        
        // Adiciona notas técnicas se existirem
        if (mancal.notas_tecnicas) {
             detailsHtml += `
                <h3 class="section-title">Notas Técnicas</h3>
                <p>${mancal.notas_tecnicas}</p>`;
        }

        resultsContainer.innerHTML = detailsHtml;
    }

    // Função para exibir mensagem de erro
    function displayError(searchTerm) {
        resultsContainer.innerHTML = `
            <div class="error-message">
                <p>O mancal '${searchTerm}' não foi encontrado na base de dados.</p>
            </div>`;
    }

    // Evento de submit do formulário
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const searchTerm = searchInput.value.trim().toUpperCase();

        if (searchTerm) {
            if (DB_MANCAIS[searchTerm]) {
                displayMancalData(DB_MANCAIS[searchTerm]);
            } else {
                displayError(searchTerm);
            }
        } else {
            displayAvailableMancais();
        }
    });

    // Carrega a lista inicial ao abrir a página
    displayAvailableMancais();
});

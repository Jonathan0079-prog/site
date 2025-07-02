// Aguarda o conteúdo da página ser totalmente carregado para executar o script
document.addEventListener('DOMContentLoaded', () => {

    // =================================================================================
    // BASE DE DADOS DE SIMILARIDADE DE LUBRIFICANTES
    // =================================================================================
    const tabelaSimilaridade = [
        // --- ÓLEOS HIDRÁULICOS (MINERAL - TIPO HLP) ---
        {
            "APLICACAO": "SISTEMA HIDRÁULICO (MINERAL HLP - ISO VG 10)",
            "MOBIL": "DTE 10 EXCEL 10", "SHELL": "TELLUS S2 M 10", "CASTROL": "HYSPIN AWS 10", "PETROBRAS": "LUBRAX INDUSTRIAL HLP 10", "YPF": "HIDRAULICO B 10", "TOTAL": "AZOLLA ZS 10", "PETRONAS": "HIDRAULIC 10", "FUCHS": "RENOLIN B 10", "CHEVRON": "RANDO HD 10", "IPIRANGA": "IPITUR AW 10"
        },
        {
            "APLICACAO": "SISTEMA HIDRÁULICO (MINERAL HLP - ISO VG 22)",
            "MOBIL": "DTE 22", "SHELL": "TELLUS S2 M 22", "CASTROL": "HYSPIN AWS 22", "PETROBRAS": "LUBRAX INDUSTRIAL HLP 22", "YPF": "HIDRAULICO B 22", "TOTAL": "AZOLLA ZS 22", "PETRONAS": "HIDRAULIC 22", "FUCHS": "RENOLIN B 22", "CHEVRON": "RANDO HD 22", "IPIRANGA": "IPITUR AW 22"
        },
        {
            "APLICACAO": "SISTEMA HIDRÁULICO (MINERAL HLP - ISO VG 32)",
            "MOBIL": "DTE 24", "SHELL": "TELLUS S2 M 32", "CASTROL": "HYSPIN AWS 32", "PETROBRAS": "LUBRAX INDUSTRIAL HLP 32", "YPF": "HIDRAULICO B 32", "TOTAL": "AZOLLA ZS 32", "PETRONAS": "HIDRAULIC 32", "FUCHS": "RENOLIN B 32", "CHEVRON": "RANDO HD 32", "IPIRANGA": "IPITUR AW 32"
        },
        {
            "APLICACAO": "SISTEMA HIDRÁULICO (MINERAL HLP - ISO VG 46)",
            "MOBIL": "DTE 25", "SHELL": "TELLUS S2 M 46", "CASTROL": "HYSPIN AWS 46", "PETROBRAS": "LUBRAX INDUSTRIAL HLP 46", "YPF": "HIDRAULICO B 46", "TOTAL": "AZOLLA ZS 46", "PETRONAS": "HIDRAULIC 46", "FUCHS": "RENOLIN B 46", "CHEVRON": "RANDO HD 46", "IPIRANGA": "IPITUR AW 46"
        },
        {
            "APLICACAO": "SISTEMA HIDRÁULICO (MINERAL HLP - ISO VG 68)",
            "MOBIL": "DTE 26", "SHELL": "TELLUS S2 M 68", "CASTROL": "HYSPIN AWS 68", "PETROBRAS": "LUBRAX INDUSTRIAL HLP 68", "YPF": "HIDRAULICO B 68", "TOTAL": "AZOLLA ZS 68", "PETRONAS": "HIDRAULIC 68", "FUCHS": "RENOLIN B 68", "CHEVRON": "RANDO HD 68", "IPIRANGA": "IPITUR AW 68"
        },
        {
            "APLICACAO": "SISTEMA HIDRÁULICO (MINERAL HLP - ISO VG 100)",
            "MOBIL": "DTE 27", "SHELL": "TELLUS S2 M 100", "CASTROL": "HYSPIN AWS 100", "PETROBRAS": "LUBRAX INDUSTRIAL HLP 100", "YPF": "HIDRAULICO B 100", "TOTAL": "AZOLLA ZS 100", "PETRONAS": "HIDRAULIC 100", "FUCHS": "RENOLIN B 100", "CHEVRON": "RANDO HD 100", "IPIRANGA": "IPITUR AW 100"
        },
        // --- ÓLEOS HIDRÁULICOS (ALTO ÍNDICE DE VISCOSIDADE - HVLP) ---
        {
            "APLICACAO": "SISTEMA HIDRÁULICO (ALTO IV - ISO VG 46)",
            "MOBIL": "DTE 10 EXCEL 46", "SHELL": "TELLUS S2 V 46", "CASTROL": "HYSPIN AWH-M 46", "PETROBRAS": "LUBRAX INDUSTRIAL HVI 46", "YPF": "HIDRAULICO BVI 46", "TOTAL": "EQUIVIS ZS 46", "PETRONAS": "HIDRAULIC HV 46", "FUCHS": "RENOLIN B HVI 46", "CHEVRON": "RANDO HDZ 46", "IPIRANGA": "IPITUR HV 46"
        },
        {
            "APLICACAO": "SISTEMA HIDRÁULICO (ALTO IV - ISO VG 68)",
            "MOBIL": "DTE 10 EXCEL 68", "SHELL": "TELLUS S2 V 68", "CASTROL": "HYSPIN AWH-M 68", "PETROBRAS": "LUBRAX INDUSTRIAL HVI 68", "YPF": "HIDRAULICO BVI 68", "TOTAL": "EQUIVIS ZS 68", "PETRONAS": "HIDRAULIC HV 68", "FUCHS": "RENOLIN B HVI 68", "CHEVRON": "RANDO HDZ 68", "IPIRANGA": "IPITUR HV 68"
        },
        // --- ÓLEOS PARA REDUTORES E ENGRENAGENS (MINERAL - TIPO CLP) ---
        {
            "APLICACAO": "REDUTORES E ENGRENAGENS (MINERAL CLP - ISO VG 68)",
            "MOBIL": "MOBILGEAR 600 XP 68", "SHELL": "OMALA S2 GX 68", "CASTROL": "ALPHA SP 68", "PETROBRAS": "LUBRAX INDUSTRIAL CLP 68", "YPF": "ENGRAX H 68", "TOTAL": "CARTER EP 68", "PETRONAS": "GEAR FL 68", "FUCHS": "RENOLIN CLP 68", "CHEVRON": "MEROPA 68", "IPIRANGA": "IPIGEAR CLP 68"
        },
        {
            "APLICACAO": "REDUTORES E ENGRENAGENS (MINERAL CLP - ISO VG 100)",
            "MOBIL": "MOBILGEAR 600 XP 100", "SHELL": "OMALA S2 GX 100", "CASTROL": "ALPHA SP 100", "PETROBRAS": "LUBRAX INDUSTRIAL CLP 100", "YPF": "ENGRAX H 100", "TOTAL": "CARTER EP 100", "PETRONAS": "GEAR FL 100", "FUCHS": "RENOLIN CLP 100", "CHEVRON": "MEROPA 100", "IPIRANGA": "IPIGEAR CLP 100"
        },
        {
            "APLICACAO": "REDUTORES E ENGRENAGENS (MINERAL CLP - ISO VG 150)",
            "MOBIL": "MOBILGEAR 600 XP 150", "SHELL": "OMALA S2 GX 150", "CASTROL": "ALPHA SP 150", "PETROBRAS": "LUBRAX INDUSTRIAL CLP 150", "YPF": "ENGRAX H 150", "TOTAL": "CARTER EP 150", "PETRONAS": "GEAR FL 150", "FUCHS": "RENOLIN CLP 150", "CHEVRON": "MEROPA 150", "IPIRANGA": "IPIGEAR CLP 150"
        },
        {
            "APLICACAO": "REDUTORES E ENGRENAGENS (MINERAL CLP - ISO VG 220)",
            "MOBIL": "MOBILGEAR 600 XP 220", "SHELL": "OMALA S2 GX 220", "CASTROL": "ALPHA SP 220", "PETROBRAS": "LUBRAX INDUSTRIAL CLP 220", "YPF": "ENGRAX H 220", "TOTAL": "CARTER EP 220", "PETRONAS": "GEAR FL 220", "FUCHS": "RENOLIN CLP 220", "CHEVRON": "MEROPA 220", "IPIRANGA": "IPIGEAR CLP 220"
        },
        {
            "APLICACAO": "REDUTORES E ENGRENAGENS (MINERAL CLP - ISO VG 320)",
            "MOBIL": "MOBILGEAR 600 XP 320", "SHELL": "OMALA S2 GX 320", "CASTROL": "ALPHA SP 320", "PETROBRAS": "LUBRAX INDUSTRIAL CLP 320", "YPF": "ENGRAX H 320", "TOTAL": "CARTER EP 320", "PETRONAS": "GEAR FL 320", "FUCHS": "RENOLIN CLP 320", "CHEVRON": "MEROPA 320", "IPIRANGA": "IPIGEAR CLP 320"
        },
        {
            "APLICACAO": "REDUTORES E ENGRENAGENS (MINERAL CLP - ISO VG 460)",
            "MOBIL": "MOBILGEAR 600 XP 460", "SHELL": "OMALA S2 GX 460", "CASTROL": "ALPHA SP 460", "PETROBRAS": "LUBRAX INDUSTRIAL CLP 460", "YPF": "ENGRAX H 460", "TOTAL": "CARTER EP 460", "PETRONAS": "GEAR FL 460", "FUCHS": "RENOLIN CLP 460", "CHEVRON": "MEROPA 460", "IPIRANGA": "IPIGEAR CLP 460"
        },
        {
            "APLICACAO": "REDUTORES E ENGRENAGENS (MINERAL CLP - ISO VG 680)",
            "MOBIL": "MOBILGEAR 600 XP 680", "SHELL": "OMALA S2 GX 680", "CASTROL": "ALPHA SP 680", "PETROBRAS": "LUBRAX INDUSTRIAL CLP 680", "YPF": "ENGRAX H 680", "TOTAL": "CARTER EP 680", "PETRONAS": "GEAR FL 680", "FUCHS": "RENOLIN CLP 680", "CHEVRON": "MEROPA 680", "IPIRANGA": "IPIGEAR CLP 680"
        },
        // --- ÓLEOS PARA REDUTORES E ENGRENAGENS (SINTÉTICO - PAO) ---
        {
            "APLICACAO": "REDUTORES E ENGRENAGENS (SINTÉTICO PAO - ISO VG 150)",
            "MOBIL": "MOBILGEAR SHC XMP 150", "SHELL": "OMALA S4 GXV 150", "CASTROL": "ALPHASYN EP 150", "PETROBRAS": "LUBRAX SYNTGEAR 150", "YPF": "HELIX S 150", "TOTAL": "CARTER SH 150", "PETRONAS": "GEAR SYG 150", "FUCHS": "RENOLIN UNISYN CLP 150", "CHEVRON": "CETUS PAO 150", "IPIRANGA": "IPIGEAR SYNT 150"
        },
        {
            "APLICACAO": "REDUTORES E ENGRENAGENS (SINTÉTICO PAO - ISO VG 220)",
            "MOBIL": "MOBILGEAR SHC XMP 220", "SHELL": "OMALA S4 GXV 220", "CASTROL": "ALPHASYN EP 220", "PETROBRAS": "LUBRAX SYNTGEAR 220", "YPF": "HELIX S 220", "TOTAL": "CARTER SH 220", "PETRONAS": "GEAR SYG 220", "FUCHS": "RENOLIN UNISYN CLP 220", "CHEVRON": "CETUS PAO 220", "IPIRANGA": "IPIGEAR SYNT 220"
        },
        {
            "APLICACAO": "REDUTORES E ENGRENAGENS (SINTÉTICO PAO - ISO VG 320)",
            "MOBIL": "MOBILGEAR SHC XMP 320", "SHELL": "OMALA S4 GXV 320", "CASTROL": "ALPHASYN EP 320", "PETROBRAS": "LUBRAX SYNTGEAR 320", "YPF": "HELIX S 320", "TOTAL": "CARTER SH 320", "PETRONAS": "GEAR SYG 320", "FUCHS": "RENOLIN UNISYN CLP 320", "CHEVRON": "CETUS PAO 320", "IPIRANGA": "IPIGEAR SYNT 320"
        },
        {
            "APLICACAO": "REDUTORES E ENGRENAGENS (SINTÉTICO PAO - ISO VG 460)",
            "MOBIL": "MOBILGEAR SHC XMP 460", "SHELL": "OMALA S4 GXV 460", "CASTROL": "ALPHASYN EP 460", "PETROBRAS": "LUBRAX SYNTGEAR 460", "YPF": "HELIX S 460", "TOTAL": "CARTER SH 460", "PETRONAS": "GEAR SYG 460", "FUCHS": "RENOLIN UNISYN CLP 460", "CHEVRON": "CETUS PAO 460", "IPIRANGA": "IPIGEAR SYNT 460"
        },
        // --- ÓLEOS PARA REDUTORES E ENGRENAGENS (SINTÉTICO - PAG) ---
        {
            "APLICACAO": "REDUTORES E ENGRENAGENS (SINTÉTICO PAG - ISO VG 220)",
            "MOBIL": "MOBIL GLYGOYLE 220", "SHELL": "OMALA S4 WE 220", "CASTROL": "ALPHASYN PG 220", "PETROBRAS": "LUBRAX SYNTGEAR PG 220", "YPF": "HELIX PG 220", "TOTAL": "CARTER SY 220", "PETRONAS": "GEAR SYN PG 220", "FUCHS": "RENOLIN PG 220", "CHEVRON": "CETUS PG 220", "IPIRANGA": "IPIGEAR SYNT PG 220"
        },
        {
            "APLICACAO": "REDUTORES E ENGRENAGENS (SINTÉTICO PAG - ISO VG 320)",
            "MOBIL": "MOBIL GLYGOYLE 320", "SHELL": "OMALA S4 WE 320", "CASTROL": "ALPHASYN PG 320", "PETROBRAS": "LUBRAX SYNTGEAR PG 320", "YPF": "HELIX PG 320", "TOTAL": "CARTER SY 320", "PETRONAS": "GEAR SYN PG 320", "FUCHS": "RENOLIN PG 320", "CHEVRON": "CETUS PG 320", "IPIRANGA": "IPIGEAR SYNT PG 320"
        },
        {
            "APLICACAO": "REDUTORES E ENGRENAGENS (SINTÉTICO PAG - ISO VG 460)",
            "MOBIL": "MOBIL GLYGOYLE 460", "SHELL": "OMALA S4 WE 460", "CASTROL": "ALPHASYN PG 460", "PETROBRAS": "LUBRAX SYNTGEAR PG 460", "YPF": "HELIX PG 460", "TOTAL": "CARTER SY 460", "PETRONAS": "GEAR SYN PG 460", "FUCHS": "RENOLIN PG 460", "CHEVRON": "CETUS PG 460", "IPIRANGA": "IPIGEAR SYNT PG 460"
        },
        // ... O resto da sua grande base de dados continua aqui ...
    ];


    // Seleção dos elementos do HTML
    const marcaSelect = document.getElementById('marca-select');
    const oleoSelect = document.getElementById('oleo-select'); // Alterado de oleo-input
    const searchButton = document.getElementById('search-button');
    const resultsContainer = document.getElementById('results-container');

    // Função para popular o dropdown de marcas dinamicamente
    function popularMarcas() {
        const marcas = new Set();
        tabelaSimilaridade.forEach(grupo => {
            Object.keys(grupo).forEach(key => {
                if (key !== 'APLICACAO') {
                    marcas.add(key);
                }
            });
        });
        const marcasOrdenadas = Array.from(marcas).sort();
        marcasOrdenadas.forEach(marca => {
            const option = document.createElement('option');
            option.value = marca;
            option.textContent = marca;
            marcaSelect.appendChild(option);
        });
    }

    // *** NOVA FUNÇÃO ***
    // Popula o dropdown de produtos com base na marca selecionada
    function popularProdutosPorMarca(marcaSelecionada) {
        // Limpa a lista de produtos anterior
        oleoSelect.innerHTML = '';
        
        if (!marcaSelecionada) {
            // Se nenhuma marca for selecionada, desabilita o campo e mostra a mensagem padrão
            oleoSelect.disabled = true;
            const option = document.createElement('option');
            option.value = "";
            option.textContent = "-- Primeiro selecione uma marca --";
            oleoSelect.appendChild(option);
        } else {
            // Se uma marca foi selecionada, habilita o campo
            oleoSelect.disabled = false;
            const option = document.createElement('option');
            option.value = "";
            option.textContent = "-- Selecione o Produto --";
            oleoSelect.appendChild(option);
            
            // Encontra todos os produtos para a marca selecionada
            const produtos = new Set();
            tabelaSimilaridade.forEach(grupo => {
                if (grupo[marcaSelecionada]) {
                    produtos.add(grupo[marcaSelecionada]);
                }
            });
            
            // Ordena os produtos e adiciona ao dropdown
            const produtosOrdenados = Array.from(produtos).sort();
            produtosOrdenados.forEach(produto => {
                const opt = document.createElement('option');
                opt.value = produto;
                opt.textContent = produto;
                oleoSelect.appendChild(opt);
            });
        }
    }
    
    // Função principal de busca (agora lê do novo select)
    function encontrarSubstitutos() {
        const marcaSelecionada = marcaSelect.value;
        const oleoSelecionado = oleoSelect.value; // Alterado de oleoInput

        resultsContainer.innerHTML = '';

        if (!marcaSelecionada || !oleoSelecionado) {
            resultsContainer.innerHTML = `<p class="error-message">Por favor, selecione uma marca e um produto.</p>`;
            return;
        }

        let encontrado = null;
        for (const grupo of tabelaSimilaridade) {
            if (grupo[marcaSelecionada] && grupo[marcaSelecionada] === oleoSelecionado) {
                encontrado = grupo;
                break;
            }
        }
        
        exibirResultados(encontrado, marcaSelecionada);
    }

    // Função para exibir os resultados (sem alteração)
    function exibirResultados(grupoEncontrado, marcaOriginal) {
        if (grupoEncontrado) {
            const substitutos = { ...grupoEncontrado };
            const aplicacao = substitutos.APLICACAO;
            delete substitutos.APLICACAO;
            delete substitutos[marcaOriginal];
            
            let htmlResultados = `
                <h3 class="results-header">Equivalentes encontrados para sua busca:</h3>
                <h4 class="results-subheader">Aplicação: ${aplicacao}</h4>
                <ul class="results-list">
            `;

            for (const marca in substitutos) {
                htmlResultados += `
                    <li>
                        <span class="brand">${marca}:</span>
                        <span class="product">${substitutos[marca]}</span>
                    </li>
                `;
            }
            htmlResultados += `</ul>`;
            
            htmlResultados += `
                <div class="warning-message">
                    <strong>ATENÇÃO:</strong> Esta lista é apenas uma referência. Antes de qualquer troca, é <strong>OBRIGATÓRIO</strong> consultar o manual do seu equipamento e comparar as fichas técnicas (TDS) de ambos os produtos.
// script.js

// 1. Importa a base de dados do arquivo separado.
import { tabelaSimilaridade } from './data/database.js';

// Aguarda o conteúdo da página ser totalmente carregado para executar o script
document.addEventListener('DOMContentLoaded', () => {
    // A PARTIR DAQUI, O CÓDIGO É O MESMO DA NOSSA ÚLTIMA VERSÃO.
    // Ele já está pronto para trabalhar com a variável importada 'tabelaSimilaridade'.

    // Seleção dos elementos do HTML
    const marcaSelect = document.getElementById('marca-select');
    const oleoSelect = document.getElementById('oleo-select');
    const searchButton = document.getElementById('search-button');
    const resultsContainer = document.getElementById('results-container');

    // Função para popular o dropdown de marcas dinamicamente
    function popularMarcas() {
        const marcas = new Set();
        tabelaSimilaridade.forEach(grupo => {
            Object.keys(grupo).forEach(key => {
                if (key !== 'APLICACAO') {
                    marcas.add(key);
                }
            });
        });
        const marcasOrdenadas = Array.from(marcas).sort();
        marcasOrdenadas.forEach(marca => {
            const option = document.createElement('option');
            option.value = marca;
            option.textContent = marca;
            marcaSelect.appendChild(option);
        });
    }

    // Popula o dropdown de produtos com base na marca selecionada
    function popularProdutosPorMarca(marcaSelecionada) {
        oleoSelect.innerHTML = '';
        
        if (!marcaSelecionada) {
            oleoSelect.disabled = true;
            const option = document.createElement('option');
            option.value = "";
            option.textContent = "-- Primeiro selecione uma marca --";
            oleoSelect.appendChild(option);
        } else {
            oleoSelect.disabled = false;
            const option = document.createElement('option');
            option.value = "";
            option.textContent = "-- Selecione o Produto --";
            oleoSelect.appendChild(option);
            
            const produtos = new Set();
            tabelaSimilaridade.forEach(grupo => {
                if (grupo[marcaSelecionada]) {
                    produtos.add(grupo[marcaSelecionada]);
                }
            });
            
            const produtosOrdenados = Array.from(produtos).sort();
            produtosOrdenados.forEach(produto => {
                const opt = document.createElement('option');
                opt.value = produto;
                opt.textContent = produto;
                oleoSelect.appendChild(opt);
            });
        }
    }
    
    // Função principal de busca
    function encontrarSubstitutos() {
        const marcaSelecionada = marcaSelect.value;
        const oleoSelecionado = oleoSelect.value;

        resultsContainer.innerHTML = '';

        if (!marcaSelecionada || !oleoSelecionado) {
            resultsContainer.innerHTML = `<p class="error-message">Por favor, selecione uma marca e um produto.</p>`;
            return;
        }

        let encontrado = null;
        for (const grupo of tabelaSimilaridade) {
            if (grupo[marcaSelecionada] && grupo[marcaSelecionada] === oleoSelecionado) {
                encontrado = grupo;
                break;
            }
        }
        
        exibirResultados(encontrado, marcaSelecionada);
    }

    // Função para exibir os resultados
    function exibirResultados(grupoEncontrado, marcaOriginal) {
        if (grupoEncontrado) {
            const substitutos = { ...grupoEncontrado };
            const aplicacao = substitutos.APLICACAO;
            delete substitutos.APLICACAO;
            delete substitutos[marcaOriginal];
            
            let htmlResultados = `
                <h3 class="results-header">Equivalentes encontrados para sua busca:</h3>
                <h4 class="results-subheader">Aplicação: ${aplicacao}</h4>
                <ul class="results-list">
            `;

            for (const marca in substitutos) {
                htmlResultados += `
                    <li>
                        <span class="brand">${marca}:</span>
                        <span class="product">${substitutos[marca]}</span>
                    </li>
                `;
            }
            htmlResultados += `</ul>`;
            
            htmlResultados += `
                <div class="warning-message">
                    <strong>ATENÇÃO:</strong> Esta lista é apenas uma referência. Antes de qualquer troca, é <strong>OBRIGATÓRIO</strong> consultar o manual do seu equipamento e comparar as fichas técnicas (TDS) de ambos os produtos.
                </div>
            `;
            resultsContainer.innerHTML = htmlResultados;
        } else {
            resultsContainer.innerHTML = `<p class="not-found-message">Nenhum produto equivalente encontrado.</p>`;
        }
    }

    // Ouve por mudanças no dropdown de MARCAS
    marcaSelect.addEventListener('change', () => {
        popularProdutosPorMarca(marcaSelect.value);
        resultsContainer.innerHTML = '';
    });

    // Adiciona o evento de clique ao botão de busca
    searchButton.addEventListener('click', encontrarSubstitutos);

    // Inicia a aplicação populando as marcas no dropdown
    popularMarcas();
});


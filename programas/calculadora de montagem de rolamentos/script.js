document.addEventListener('DOMContentLoaded', () => {

    // Dados extraídos da tabela FAG do documento (página 9)
    const dadosRolamentos = [
        { d_min: 30, d_max: 40, folga_normal: "0,035 - 0,050", folga_c3: "0,050 - 0,065", folga_c4: "0,065 - 0,085", reducao: "0,020 - 0,025", desloc_eixo: "0,35 - 0,40", desloc_bucha: "0,35 - 0,45", folga_final_normal: "0,015", folga_final_c3: "0,025", folga_final_c4: "0,040" },
        { d_min: 40, d_max: 50, folga_normal: "0,045 - 0,060", folga_c3: "0,060 - 0,080", folga_c4: "0,080 - 0,100", reducao: "0,025 - 0,030", desloc_eixo: "0,40 - 0,45", desloc_bucha: "0,45 - 0,50", folga_final_normal: "0,020", folga_final_c3: "0,030", folga_final_c4: "0,050" },
        { d_min: 50, d_max: 65, folga_normal: "0,055 - 0,075", folga_c3: "0,075 - 0,095", folga_c4: "0,095 - 0,120", reducao: "0,030 - 0,040", desloc_eixo: "0,45 - 0,60", desloc_bucha: "0,50 - 0,70", folga_final_normal: "0,025", folga_final_c3: "0,035", folga_final_c4: "0,055" },
        { d_min: 65, d_max: 80, folga_normal: "0,070 - 0,095", folga_c3: "0,095 - 0,120", folga_c4: "0,120 - 0,150", reducao: "0,040 - 0,050", desloc_eixo: "0,60 - 0,75", desloc_bucha: "0,70 - 0,85", folga_final_normal: "0,025", folga_final_c3: "0,040", folga_final_c4: "0,070" },
        { d_min: 80, d_max: 100, folga_normal: "0,080 - 0,110", folga_c3: "0,110 - 0,140", folga_c4: "0,140 - 0,180", reducao: "0,045 - 0,060", desloc_eixo: "0,70 - 0,90", desloc_bucha: "0,75 - 1,00", folga_final_normal: "0,035", folga_final_c3: "0,050", folga_final_c4: "0,080" },
        { d_min: 100, d_max: 120, folga_normal: "0,100 - 0,135", folga_c3: "0,135 - 0,170", folga_c4: "0,170 - 0,220", reducao: "0,050 - 0,070", desloc_eixo: "0,70 - 1,10", desloc_bucha: "0,80 - 1,20", folga_final_normal: "0,050", folga_final_c3: "0,065", folga_final_c4: "0,100" },
        { d_min: 120, d_max: 140, folga_normal: "0,120 - 0,160", folga_c3: "0,160 - 0,200", folga_c4: "0,200 - 0,260", reducao: "0,065 - 0,090", desloc_eixo: "1,10 - 1,40", desloc_bucha: "1,20 - 1,50", folga_final_normal: "0,055", folga_final_c3: "0,080", folga_final_c4: "0,110" },
        // ... adicione mais dados da tabela aqui se necessário
    ];

    const calcularBtn = document.getElementById('calcular-btn');
    const diametroInput = document.getElementById('diametro-rolamento');
    const resultadoContainer = document.getElementById('resultado-container');
    const erroContainer = document.getElementById('erro-container');

    calcularBtn.addEventListener('click', () => {
        const diametro = parseFloat(diametroInput.value);

        // Esconde resultados anteriores
        resultadoContainer.classList.add('hidden');
        erroContainer.classList.add('hidden');

        if (isNaN(diametro) || diametro <= 0) {
            erroContainer.querySelector('p').textContent = "Por favor, insira um valor de diâmetro válido.";
            erroContainer.classList.remove('hidden');
            return;
        }

        // Procura pelos dados correspondentes ao diâmetro
        let dadosEncontrados = null;
        for (const dados of dadosRolamentos) {
            // A lógica de busca é: maior que d_min e menor ou igual a d_max
            if (diametro > dados.d_min && diametro <= dados.d_max) {
                dadosEncontrados = dados;
                break;
            }
        }
        
        // Trata o primeiro valor da tabela (30mm)
        if (diametro === 30) {
            dadosEncontrados = dadosRolamentos[0];
        }


        if (dadosEncontrados) {
            // Preenche os resultados na tela
            document.getElementById('resultado-diametro').textContent = diametro;
            document.getElementById('folga-normal').textContent = dadosEncontrados.folga_normal;
            document.getElementById('folga-c3').textContent = dadosEncontrados.folga_c3;
            document.getElementById('folga-c4').textContent = dadosEncontrados.folga_c4;
            document.getElementById('reducao-folga').textContent = dadosEncontrados.reducao;
            document.getElementById('desloc-eixo').textContent = dadosEncontrados.desloc_eixo;
            document.getElementById('desloc-bucha').textContent = dadosEncontrados.desloc_bucha;
            document.getElementById('folga-final-normal').textContent = dadosEncontrados.folga_final_normal;
            document.getElementById('folga-final-c3').textContent = dadosEncontrados.folga_final_c3;
            document.getElementById('folga-final-c4').textContent = dadosEncontrados.folga_final_c4;

            // Mostra o container de resultados
            resultadoContainer.classList.remove('hidden');
        } else {
            // Mostra o container de erro
            erroContainer.querySelector('p').textContent = `Diâmetro de ${diametro} mm não encontrado na tabela. Verifique o valor (a tabela atual cobre de 30 a 140 mm).`;Add commentMore actions
            erroContainer.classList.remove('hidden');
        }
    });
});

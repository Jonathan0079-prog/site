document.addEventListener('DOMContentLoaded', () => {

    const calcularBtn = document.getElementById('calcular-btn');
    const diametroInput = document.getElementById('diametro-rolamento');
    const resultadoContainer = document.getElementById('resultado-container');
    const erroContainer = document.getElementById('erro-container');

    // Mapeamento dos elementos de resultado
    const resultadoDiametro = document.getElementById('resultado-diametro');
    const folgaC2 = document.getElementById('folga-c2');
    const folgaNormal = document.getElementById('folga-normal');
    const folgaC3 = document.getElementById('folga-c3');
    const folgaC4 = document.getElementById('folga-c4');
    const folgaC5 = document.getElementById('folga-c5');
    const reducaoFolga = document.getElementById('reducao-folga');
    const deslocEixo12 = document.getElementById('desloc-eixo-12');
    const deslocBucha12 = document.getElementById('desloc-bucha-12');
    const deslocBucha30 = document.getElementById('desloc-bucha-30');
    const folgaFinalNormal = document.getElementById('folga-final-normal');
    const folgaFinalC3 = document.getElementById('folga-final-c3');
    const folgaFinalC4 = document.getElementById('folga-final-c4');

    // Dados da tabela FAG expandidos para cobrir toda a faixa das imagens
    const tabelaDados = [
        { d_max: 24, folga_c2: '0.02 - 0.035', folga_normal: '0.03 - 0.055', folga_c3: '0.045 - 0.065', folga_c4: '0.06 - 0.085', folga_c5: '0.08 - 0.125', reducao_min: 0.01, reducao_max: 0.025, desloc_eixo: '0.25 - 0.35', desloc_bucha_12: '0.75 - 0.9', desloc_bucha_30: '0.44 - 0.54' },
        { d_max: 30, folga_c2: '0.02 - 0.035', folga_normal: '0.03 - 0.055', folga_c3: '0.045 - 0.065', folga_c4: '0.06 - 0.085', folga_c5: '0.08 - 0.125', reducao_min: 0.02, reducao_max: 0.025, desloc_eixo: '0.37 - 0.44', desloc_bucha_12: '0.95 - 1.1', desloc_bucha_30: '0.54 - 0.65' },
        { d_max: 40, folga_c2: '0.025 - 0.045', folga_normal: '0.04 - 0.065', folga_c3: '0.055 - 0.08', folga_c4: '0.075 - 0.105', folga_c5: '0.1 - 0.15', reducao_min: 0.015, reducao_max: 0.025, desloc_eixo: '0.3 - 0.4', desloc_bucha_12: '0.75 - 0.9', desloc_bucha_30: '0.44 - 0.54' },
        { d_max: 50, folga_c2: '0.03 - 0.05', folga_normal: '0.05 - 0.075', folga_c3: '0.06 - 0.095', folga_c4: '0.09 - 0.125', folga_c5: '0.12 - 0.175', reducao_min: 0.025, reducao_max: 0.04, desloc_eixo: '0.45 - 0.65', desloc_bucha_12: '1.15 - 1.65', desloc_bucha_30: '0.65 - 0.95' },
        { d_max: 65, folga_c2: '0.03 - 0.05', folga_normal: '0.05 - 0.075', folga_c3: '0.06 - 0.095', folga_c4: '0.09 - 0.125', folga_c5: '0.12 - 0.175', reducao_min: 0.025, reducao_max: 0.04, desloc_eixo: '0.45 - 0.65', desloc_bucha_12: '1.15 - 1.65', desloc_bucha_30: '0.65 - 0.95' },
        { d_max: 80, folga_c2: '0.035 - 0.06', folga_normal: '0.06 - 0.095', folga_c3: '0.08 - 0.115', folga_c4: '0.1 - 0.15', folga_c5: '0.14 - 0.2', reducao_min: 0.03, reducao_max: 0.055, desloc_eixo: '0.55 - 0.8', desloc_bucha_12: '1.4 - 2', desloc_bucha_30: '0.8 - 1.15' },
        { d_max: 100, folga_c2: '0.04 - 0.075', folga_normal: '0.07 - 0.11', folga_c3: '0.095 - 0.14', folga_c4: '0.125 - 0.185', folga_c5: '0.165 - 0.24', reducao_min: 0.04, reducao_max: 0.065, desloc_eixo: '0.65 - 0.95', desloc_bucha_12: '1.65 - 2.35', desloc_bucha_30: '0.95 - 1.35' },
        { d_max: 120, folga_c2: '0.05 - 0.09', folga_normal: '0.08 - 0.13', folga_c3: '0.11 - 0.16', folga_c4: '0.15 - 0.22', folga_c5: '0.2 - 0.28', reducao_min: 0.05, reducao_max: 0.075, desloc_eixo: '0.8 - 1.15', desloc_bucha_12: '2 - 2.8', desloc_bucha_30: '1.1 - 1.65' },
        { d_max: 140, folga_c2: '0.06 - 0.1', folga_normal: '0.095 - 0.15', folga_c3: '0.13 - 0.19', folga_c4: '0.17 - 0.25', folga_c5: '0.23 - 0.32', reducao_min: 0.06, reducao_max: 0.09, desloc_eixo: '1 - 1.4', desloc_bucha_12: '2.3 - 3.2', desloc_bucha_30: '1.3 - 1.85' },
        { d_max: 160, folga_c2: '0.07 - 0.12', folga_normal: '0.11 - 0.17', folga_c3: '0.15 - 0.21', folga_c4: '0.19 - 0.28', folga_c5: '0.26 - 0.36', reducao_min: 0.07, reducao_max: 0.1, desloc_eixo: '1.2 - 1.65', desloc_bucha_12: '2.65 - 3.65', desloc_bucha_30: '1.55 - 2.1' },
        { d_max: 180, folga_c2: '0.08 - 0.14', folga_normal: '0.12 - 0.19', folga_c3: '0.17 - 0.24', folga_c4: '0.21 - 0.31', folga_c5: '0.29 - 0.4', reducao_min: 0.08, reducao_max: 0.12, desloc_eixo: '1.4 - 1.9', desloc_bucha_12: '3 - 4', desloc_bucha_30: '1.7 - 2.3' },
        { d_max: 200, folga_c2: '0.09 - 0.16', folga_normal: '0.14 - 0.21', folga_c3: '0.19 - 0.27', folga_c4: '0.24 - 0.34', folga_c5: '0.32 - 0.44', reducao_min: 0.09, reducao_max: 0.13, desloc_eixo: '1.6 - 2.15', desloc_bucha_12: '3.3 - 4.45', desloc_bucha_30: '1.8 - 2.55' },
        { d_max: 225, folga_c2: '0.1 - 0.18', folga_normal: '0.16 - 0.24', folga_c3: '0.22 - 0.31', folga_c4: '0.27 - 0.38', folga_c5: '0.36 - 0.49', reducao_min: 0.1, reducao_max: 0.16, desloc_eixo: '1.8 - 2.45', desloc_bucha_12: '3.7 - 4.95', desloc_bucha_30: '2.15 - 2.85' },
        { d_max: 250, folga_c2: '0.11 - 0.2', folga_normal: '0.17 - 0.26', folga_c3: '0.24 - 0.34', folga_c4: '0.3 - 0.42', folga_c5: '0.4 - 0.55', reducao_min: 0.11, reducao_max: 0.18, desloc_eixo: '2 - 2.7', desloc_bucha_12: '4.1 - 5.55', desloc_bucha_30: '2.35 - 3.2' },
        { d_max: 280, folga_c2: '0.12 - 0.22', folga_normal: '0.19 - 0.29', folga_c3: '0.27 - 0.38', folga_c4: '0.33 - 0.47', folga_c5: '0.45 - 0.62', reducao_min: 0.13, reducao_max: 0.21, desloc_eixo: '2.2 - 3.1', desloc_bucha_12: '4.5 - 6.2', desloc_bucha_30: '2.6 - 3.6' },
        { d_max: 315, folga_c2: '0.14 - 0.24', folga_normal: '0.21 - 0.32', folga_c3: '0.3 - 0.43', folga_c4: '0.36 - 0.52', folga_c5: '0.5 - 0.68', reducao_min: 0.15, reducao_max: 0.23, desloc_eixo: '2.5 - 3.5', desloc_bucha_12: '5.1 - 6.8', desloc_bucha_30: '2.9 - 3.9' },
        { d_max: 355, folga_c2: '0.16 - 0.27', folga_normal: '0.24 - 0.36', folga_c3: '0.33 - 0.47', folga_c4: '0.4 - 0.57', folga_c5: '0.54 - 0.75', reducao_min: 0.17, reducao_max: 0.26, desloc_eixo: '2.8 - 3.9', desloc_bucha_12: '5.7 - 7.6', desloc_bucha_30: '3.2 - 4.4' },
        { d_max: 400, folga_c2: '0.18 - 0.3', folga_normal: '0.27 - 0.4', folga_c3: '0.36 - 0.52', folga_c4: '0.44 - 0.62', folga_c5: '0.6 - 0.82', reducao_min: 0.19, reducao_max: 0.28, desloc_eixo: '3.1 - 4.4', desloc_bucha_12: '6.2 - 8.5', desloc_bucha_30: '3.6 - 4.9' },
        { d_max: 450, folga_c2: '0.2 - 0.33', folga_normal: '0.3 - 0.44', folga_c3: '0.4 - 0.57', folga_c4: '0.49 - 0.68', folga_c5: '0.68 - 0.91', reducao_min: 0.21, reducao_max: 0.31, desloc_eixo: '3.4 - 4.9', desloc_bucha_12: '6.8 - 9.5', desloc_bucha_30: '3.9 - 5.5' },
        { d_max: 500, folga_c2: '0.23 - 0.37', folga_normal: '0.33 - 0.48', folga_c3: '0.44 - 0.63', folga_c4: '0.54 - 0.74', folga_c5: '0.75 - 1.01', reducao_min: 0.24, reducao_max: 0.34, desloc_eixo: '3.8 - 5.5', desloc_bucha_12: '7.8 - 10.5', desloc_bucha_30: '4.4 - 6.1' },
        { d_max: 560, folga_c2: '0.26 - 0.41', folga_normal: '0.37 - 0.54', folga_c3: '0.49 - 0.68', folga_c4: '0.6 - 0.83', folga_c5: '0.83 - 1.11', reducao_min: 0.27, reducao_max: 0.38, desloc_eixo: '4.2 - 6', desloc_bucha_12: '8.6 - 11.6', desloc_bucha_30: '4.9 - 6.7' },
        { d_max: 630, folga_c2: '0.29 - 0.46', folga_normal: '0.41 - 0.59', folga_c3: '0.54 - 0.76', folga_c4: '0.66 - 0.91', folga_c5: '0.9 - 1.23', reducao_min: 0.3, reducao_max: 0.42, desloc_eixo: '4.6 - 6.6', desloc_bucha_12: '9.5 - 12.8', desloc_bucha_30: '5.4 - 7.4' },
        { d_max: 710, folga_c2: '0.32 - 0.51', folga_normal: '0.46 - 0.67', folga_c3: '0.6 - 0.85', folga_c4: '0.75 - 1.05', folga_c5: '1 - 1.38', reducao_min: 0.34, reducao_max: 0.47, desloc_eixo: '5.2 - 7.4', desloc_bucha_12: '10.6 - 14.5', desloc_bucha_30: '6 - 8.3' },
        { d_max: 800, folga_c2: '0.35 - 0.57', folga_normal: '0.5 - 0.74', folga_c3: '0.66 - 0.95', folga_c4: '0.8 - 1.12', folga_c5: '1.1 - 1.53', reducao_min: 0.38, reducao_max: 0.53, desloc_eixo: '5.8 - 8.3', desloc_bucha_12: '11.9 - 16.5', desloc_bucha_30: '6.8 - 9.5' },
        { d_max: 900, folga_c2: '0.39 - 0.64', folga_normal: '0.57 - 0.84', folga_c3: '0.75 - 1.07', folga_c4: '0.9 - 1.25', folga_c5: '1.25 - 1.69', reducao_min: 0.44, reducao_max: 0.6, desloc_eixo: '6.6 - 9.5', desloc_bucha_12: '13.5 - 19', desloc_bucha_30: '7.7 - 10.8' },
        { d_max: 1000, folga_c2: '0.44 - 0.71', folga_normal: '0.64 - 0.93', folga_c3: '0.84 - 1.19', folga_c4: '1 - 1.39', folga_c5: '1.39 - 1.87', reducao_min: 0.49, reducao_max: 0.68, desloc_eixo: '7.3 - 10.5', desloc_bucha_12: '15 - 21', desloc_bucha_30: '8.6 - 12.1' },
        { d_max: 1120, folga_c2: '0.49 - 0.77', folga_normal: '0.71 - 1.03', folga_c3: '0.93 - 1.3', folga_c4: '1.13 - 1.55', folga_c5: '1.5 - 2.05', reducao_min: 0.55, reducao_max: 0.76, desloc_eixo: '8.1 - 11.6', desloc_bucha_12: '16.5 - 23', desloc_bucha_30: '9.5 - 13.3' },
        { d_max: 1250, folga_c2: '0.53 - 0.83', folga_normal: '0.77 - 1.12', folga_c3: '1 - 1.42', folga_c4: '1.23 - 1.69', folga_c5: '1.63 - 2.25', reducao_min: 0.61, reducao_max: 0.84, desloc_eixo: '8.9 - 12.9', desloc_bucha_12: '18.2 - 26.2', desloc_bucha_30: '10.5 - 15.1' },
        { d_max: 1400, folga_c2: '0.57 - 0.91', folga_normal: '0.83 - 1.21', folga_c3: '1.08 - 1.55', folga_c4: '1.35 - 1.84', folga_c5: '1.8 - 2.45', reducao_min: 0.67, reducao_max: 0.92, desloc_eixo: '9.8 - 14.1', desloc_bucha_12: '20 - 28.5', desloc_bucha_30: '11.5 - 16.5' },
        { d_max: 1600, folga_c2: '0.61 - 0.98', folga_normal: '0.9 - 1.32', folga_c3: '1.18 - 1.69', folga_c4: '1.48 - 2.01', folga_c5: '1.98 - 2.68', reducao_min: 0.73, reducao_max: 1, desloc_eixo: '10.7 - 15.6', desloc_bucha_12: '21.8 - 31.3', desloc_bucha_30: '12.5 - 18' },
        { d_max: 1800, folga_c2: '0.65 - 1.05', folga_normal: '0.96 - 1.4', folga_c3: '1.28 - 1.83', folga_c4: '1.6 - 2.18', folga_c5: '2.1 - 2.87', reducao_min: 0.79, reducao_max: 1.09, desloc_eixo: '11.6 - 17', desloc_bucha_12: '23.7 - 34.5', desloc_bucha_30: '13.6 - 19.8' },
        { d_max: 2000, folga_c2: '0.7 - 1.15', folga_normal: '1.05 - 1.55', folga_c3: '1.4 - 2', folga_c4: '1.75 - 2.38', folga_c5: '2.3 - 3.15', reducao_min: 0.85, reducao_max: 1.18, desloc_eixo: '12.7 - 18.6', desloc_bucha_12: '25.8 - 38', desloc_bucha_30: '14.8 - 21.8' },
        { d_max: 2240, folga_c2: '0.75 - 1.25', folga_normal: '1.1 - 1.65', folga_c3: '1.5 - 2.15', folga_c4: '1.88 - 2.58', folga_c5: '2.5 - 3.4', reducao_min: 0.9, reducao_max: 1.28, desloc_eixo: '13.5 - 20', desloc_bucha_12: '27.5 - 40.5', desloc_bucha_30: '15.8 - 23.4' },
        { d_max: 2500, folga_c2: '0.8 - 1.35', folga_normal: '1.2 - 1.75', folga_c3: '1.6 - 2.3', folga_c4: '2 - 2.75', folga_c5: '2.7 - 3.65', reducao_min: 0.95, reducao_max: 1.38, desloc_eixo: '14.5 - 21.5', desloc_bucha_12: '29.5 - 43.5', desloc_bucha_30: '16.8 - 25' },
        { d_max: 2800, folga_c2: '0.85 - 1.45', folga_normal: '1.3 - 1.9', folga_c3: '1.7 - 2.45', folga_c4: '2.15 - 2.95', folga_c5: '2.9 - 3.9', reducao_min: 1.05, reducao_max: 1.5, desloc_eixo: '16 - 23.5', desloc_bucha_12: '32.5 - 47', desloc_bucha_30: '18.5 - 27' },
        { d_max: 3150, folga_c2: '0.9 - 1.55', folga_normal: '1.4 - 2.05', folga_c3: '1.85 - 2.65', folga_c4: '2.3 - 3.15', folga_c5: '3.15 - 4.25', reducao_min: 1.15, reducao_max: 1.65, desloc_eixo: '17.5 - 25.5', desloc_bucha_12: '35.5 - 51.5', desloc_bucha_30: '20.5 - 29.5' },
        { d_max: 3550, folga_c2: '0.95 - 1.65', folga_normal: '1.5 - 2.2', folga_c3: '2 - 2.85', folga_c4: '2.5 - 3.4', folga_c5: '3.4 - 4.55', reducao_min: 1.25, reducao_max: 1.8, desloc_eixo: '19 - 28', desloc_bucha_12: '38.5 - 56.5', desloc_bucha_30: '22.5 - 32.5' },
        { d_max: 4000, folga_c2: '1 - 1.75', folga_normal: '1.6 - 2.35', folga_c3: '2.1 - 3.05', folga_c4: '2.65 - 3.6', folga_c5: '3.6 - 4.85', reducao_min: 1.35, reducao_max: 1.95, desloc_eixo: '20.5 - 30.5', desloc_bucha_12: '41.5 - 61.5', desloc_bucha_30: '24 - 35.5' },
        { d_max: 4500, folga_c2: '1.1 - 1.9', folga_normal: '1.7 - 2.5', folga_c3: '2.25 - 3.25', folga_c4: '2.85 - 3.9', folga_c5: '3.9 - 5.25', reducao_min: 1.5, reducao_max: 2.15, desloc_eixo: '23 - 33.5', desloc_bucha_12: '46.5 - 68', desloc_bucha_30: '27 - 39.5' },
        { d_max: 5000, folga_c2: '1.2 - 2.05', folga_normal: '1.85 - 2.7', folga_c3: '2.45 - 3.55', folga_c4: '3.1 - 4.2', folga_c5: '4.2 - 5.65', reducao_min: 1.65, reducao_max: 2.35, desloc_eixo: '25 - 36.5', desloc_bucha_12: '50.5 - 74', desloc_bucha_30: '29.5 - 42.5' }
    ];

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

        // Procura pelos dados correspondentes ao diâmetro na tabela
        let dadosEncontrados = null;
        for (const dados of tabelaDados) {
            if (diametro <= dados.d_max) {
                dadosEncontrados = dados;
                break;
            }
        }
        
        if (dadosEncontrados) {
            // Preenche os resultados na tela
            resultadoDiametro.textContent = diametro;
            folgaC2.textContent = dadosEncontrados.folga_c2;
            folgaNormal.textContent = dadosEncontrados.folga_normal;
            folgaC3.textContent = dadosEncontrados.folga_c3;
            folgaC4.textContent = dadosEncontrados.folga_c4;
            folgaC5.textContent = dadosEncontrados.folga_c5;

            reducaoFolga.textContent = `${dadosEncontrados.reducao_min.toFixed(3)} - ${dadosEncontrados.reducao_max.toFixed(3)}`;
            deslocEixo12.textContent = dadosEncontrados.desloc_eixo;
            deslocBucha12.textContent = dadosEncontrados.desloc_bucha_12;
            deslocBucha30.textContent = dadosEncontrados.desloc_bucha_30;

            // Calcula e exibe a folga final
            const folgaNormalMin = parseFloat(dadosEncontrados.folga_normal.split(' - ')[0]);
            const folgaNormalMax = parseFloat(dadosEncontrados.folga_normal.split(' - ')[1]);
            const folgaC3Min = parseFloat(dadosEncontrados.folga_c3.split(' - ')[0]);
            const folgaC3Max = parseFloat(dadosEncontrados.folga_c3.split(' - ')[1]);
            const folgaC4Min = parseFloat(dadosEncontrados.folga_c4.split(' - ')[0]);
            const folgaC4Max = parseFloat(dadosEncontrados.folga_c4.split(' - ')[1]);

            const folgaFinalNormalMin = (folgaNormalMin - dadosEncontrados.reducao_max).toFixed(3);
            const folgaFinalNormalMax = (folgaNormalMax - dadosEncontrados.reducao_min).toFixed(3);
            const folgaFinalC3Min = (folgaC3Min - dadosEncontrados.reducao_max).toFixed(3);
            const folgaFinalC3Max = (folgaC3Max - dadosEncontrados.reducao_min).toFixed(3);
            const folgaFinalC4Min = (folgaC4Min - dadosEncontrados.reducao_max).toFixed(3);
            const folgaFinalC4Max = (folgaC4Max - dadosEncontrados.reducao_min).toFixed(3);

            folgaFinalNormal.textContent = `${folgaFinalNormalMin} - ${folgaFinalNormalMax}`;
            folgaFinalC3.textContent = `${folgaFinalC3Min} - ${folgaFinalC3Max}`;
            folgaFinalC4.textContent = `${folgaFinalC4Min} - ${folgaFinalC4Max}`;

            // Mostra o container de resultados
            resultadoContainer.classList.remove('hidden');
        } else {
            // Mostra o container de erro
            erroContainer.classList.remove('hidden');
        }
    });
});

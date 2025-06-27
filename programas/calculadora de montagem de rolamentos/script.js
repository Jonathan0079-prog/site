document.addEventListener('DOMContentLoaded', () => {

    // Dados extraídos da tabela para Rolamentos Autocompensadores de Rolos
    const tabelaDadosAutocompensadores = [
        { d_max: 30, folga_c2: '0.02 - 0.03', folga_normal: '0.03 - 0.04', folga_c3: '0.04 - 0.055', folga_c4: '0.055 - 0.075', folga_c5: '0 - 0', reducao_min: 0.01, reducao_max: 0.015, desloc_eixo: '0.25 - 0.29', desloc_bucha_12: '0 - 0', desloc_bucha_30: '0 - 0' },
        { d_max: 40, folga_c2: '0.025 - 0.035', folga_normal: '0.035 - 0.05', folga_c3: '0.05 - 0.065', folga_c4: '0.065 - 0.085', folga_c5: '0.085 - 0.105', reducao_min: 0.015, reducao_max: 0.02, desloc_eixo: '0.3 - 0.35', desloc_bucha_12: '0 - 0', desloc_bucha_30: '0 - 0' },
        { d_max: 50, folga_c2: '0.03 - 0.045', folga_normal: '0.045 - 0.06', folga_c3: '0.06 - 0.08', folga_c4: '0.08 - 0.1', folga_c5: '0.1 - 0.13', reducao_min: 0.02, reducao_max: 0.025, desloc_eixo: '0.37 - 0.44', desloc_bucha_12: '0 - 0', desloc_bucha_30: '0 - 0' },
        { d_max: 65, folga_c2: '0.04 - 0.055', folga_normal: '0.055 - 0.075', folga_c3: '0.075 - 0.095', folga_c4: '0.095 - 0.12', folga_c5: '0.12 - 0.16', reducao_min: 0.025, reducao_max: 0.035, desloc_eixo: '0.45 - 0.54', desloc_bucha_12: '1.15 - 1.35', desloc_bucha_30: '0 - 0' },
        { d_max: 80, folga_c2: '0.05 - 0.07', folga_normal: '0.07 - 0.095', folga_c3: '0.095 - 0.12', folga_c4: '0.12 - 0.15', folga_c5: '0.15 - 0.2', reducao_min: 0.035, reducao_max: 0.04, desloc_eixo: '0.55 - 0.65', desloc_bucha_12: '1.4 - 1.65', desloc_bucha_30: '0 - 0' },
        { d_max: 100, folga_c2: '0.055 - 0.08', folga_normal: '0.08 - 0.11', folga_c3: '0.11 - 0.14', folga_c4: '0.14 - 0.18', folga_c5: '0.18 - 0.23', reducao_min: 0.04, reducao_max: 0.05, desloc_eixo: '0.66 - 0.79', desloc_bucha_12: '1.65 - 2', desloc_bucha_30: '0 - 0' },
        { d_max: 120, folga_c2: '0.065 - 0.1', folga_normal: '0.1 - 0.135', folga_c3: '0.135 - 0.17', folga_c4: '0.17 - 0.22', folga_c5: '0.22 - 0.28', reducao_min: 0.05, reducao_max: 0.06, desloc_eixo: '0.79 - 0.95', desloc_bucha_12: '2 - 2.35', desloc_bucha_30: '0 - 0' },
        { d_max: 140, folga_c2: '0.08 - 0.12', folga_normal: '0.12 - 0.16', folga_c3: '0.16 - 0.2', folga_c4: '0.2 - 0.26', folga_c5: '0.26 - 0.33', reducao_min: 0.06, reducao_max: 0.075, desloc_eixo: '0.93 - 1.1', desloc_bucha_12: '2.3 - 2.8', desloc_bucha_30: '0 - 0' },
        { d_max: 160, folga_c2: '0.09 - 0.13', folga_normal: '0.13 - 0.18', folga_c3: '0.18 - 0.23', folga_c4: '0.23 - 0.3', folga_c5: '0.3 - 0.38', reducao_min: 0.07, reducao_max: 0.085, desloc_eixo: '1.05 - 1.3', desloc_bucha_12: '2.65 - 3.2', desloc_bucha_30: '0 - 0' },
        { d_max: 180, folga_c2: '0.1 - 0.14', folga_normal: '0.14 - 0.2', folga_c3: '0.2 - 0.26', folga_c4: '0.26 - 0.34', folga_c5: '0.34 - 0.43', reducao_min: 0.08, reducao_max: 0.095, desloc_eixo: '1.2 - 1.45', desloc_bucha_12: '3 - 3.6', desloc_bucha_30: '0 - 0' },
        { d_max: 200, folga_c2: '0.11 - 0.16', folga_normal: '0.16 - 0.22', folga_c3: '0.22 - 0.29', folga_c4: '0.29 - 0.37', folga_c5: '0.37 - 0.47', reducao_min: 0.09, reducao_max: 0.105, desloc_eixo: '1.3 - 1.6', desloc_bucha_12: '3.3 - 4', desloc_bucha_30: '0 - 0' },
        { d_max: 225, folga_c2: '0.12 - 0.18', folga_normal: '0.18 - 0.25', folga_c3: '0.25 - 0.32', folga_c4: '0.32 - 0.41', folga_c5: '0.41 - 0.52', reducao_min: 0.1, reducao_max: 0.12, desloc_eixo: '1.45 - 1.8', desloc_bucha_12: '3.7 - 4.45', desloc_bucha_30: '0 - 0' },
        { d_max: 250, folga_c2: '0.14 - 0.2', folga_normal: '0.2 - 0.27', folga_c3: '0.27 - 0.35', folga_c4: '0.35 - 0.45', folga_c5: '0.45 - 0.57', reducao_min: 0.11, reducao_max: 0.13, desloc_eixo: '1.6 - 1.95', desloc_bucha_12: '4 - 4.85', desloc_bucha_30: '0 - 0' },
        { d_max: 280, folga_c2: '0.15 - 0.22', folga_normal: '0.22 - 0.3', folga_c3: '0.3 - 0.39', folga_c4: '0.39 - 0.49', folga_c5: '0.49 - 0.62', reducao_min: 0.12, reducao_max: 0.15, desloc_eixo: '1.8 - 2.15', desloc_bucha_12: '4.5 - 5.4', desloc_bucha_30: '0 - 0' },
        { d_max: 315, folga_c2: '0.17 - 0.24', folga_normal: '0.24 - 0.33', folga_c3: '0.33 - 0.43', folga_c4: '0.43 - 0.54', folga_c5: '0.54 - 0.68', reducao_min: 0.135, reducao_max: 0.165, desloc_eixo: '2 - 2.4', desloc_bucha_12: '4.95 - 6', desloc_bucha_30: '0 - 0' },
        { d_max: 355, folga_c2: '0.19 - 0.27', folga_normal: '0.27 - 0.36', folga_c3: '0.36 - 0.47', folga_c4: '0.47 - 0.59', folga_c5: '0.59 - 0.74', reducao_min: 0.15, reducao_max: 0.18, desloc_eixo: '2.15 - 2.65', desloc_bucha_12: '5.4 - 6.6', desloc_bucha_30: '0 - 0' },
        { d_max: 400, folga_c2: '0.21 - 0.3', folga_normal: '0.3 - 0.4', folga_c3: '0.4 - 0.52', folga_c4: '0.52 - 0.65', folga_c5: '0.65 - 0.82', reducao_min: 0.17, reducao_max: 0.21, desloc_eixo: '2.5 - 3', desloc_bucha_12: '6.2 - 7.6', desloc_bucha_30: '0 - 0' },
        { d_max: 450, folga_c2: '0.23 - 0.33', folga_normal: '0.33 - 0.44', folga_c3: '0.44 - 0.57', folga_c4: '0.57 - 0.72', folga_c5: '0.72 - 0.91', reducao_min: 0.195, reducao_max: 0.235, desloc_eixo: '2.8 - 3.4', desloc_bucha_12: '7 - 8.5', desloc_bucha_30: '0 - 0' },
        { d_max: 500, folga_c2: '0.26 - 0.37', folga_normal: '0.37 - 0.49', folga_c3: '0.49 - 0.63', folga_c4: '0.63 - 0.79', folga_c5: '0.79 - 1', reducao_min: 0.215, reducao_max: 0.265, desloc_eixo: '3.1 - 3.8', desloc_bucha_12: '7.8 - 9.5', desloc_bucha_30: '0 - 0' },
        { d_max: 560, folga_c2: '0.29 - 0.41', folga_normal: '0.41 - 0.54', folga_c3: '0.54 - 0.68', folga_c4: '0.68 - 0.87', folga_c5: '0.87 - 1.1', reducao_min: 0.245, reducao_max: 0.3, desloc_eixo: '3.4 - 4.1', desloc_bucha_12: '8.4 - 10.3', desloc_bucha_30: '0 - 0' },
        { d_max: 630, folga_c2: '0.32 - 0.46', folga_normal: '0.46 - 0.6', folga_c3: '0.6 - 0.76', folga_c4: '0.76 - 0.98', folga_c5: '0.98 - 1.23', reducao_min: 0.275, reducao_max: 0.34, desloc_eixo: '3.8 - 4.65', desloc_bucha_12: '9.5 - 11.6', desloc_bucha_30: '0 - 0' },
        { d_max: 710, folga_c2: '0.35 - 0.51', folga_normal: '0.51 - 0.67', folga_c3: '0.67 - 0.85', folga_c4: '0.85 - 1.09', folga_c5: '1.09 - 1.36', reducao_min: 0.31, reducao_max: 0.38, desloc_eixo: '4.25 - 5.2', desloc_bucha_12: '10.6 - 13', desloc_bucha_30: '0 - 0' },
        { d_max: 800, folga_c2: '0.39 - 0.57', folga_normal: '0.57 - 0.75', folga_c3: '0.75 - 0.96', folga_c4: '0.96 - 1.22', folga_c5: '1.22 - 1.5', reducao_min: 0.35, reducao_max: 0.425, desloc_eixo: '4.75 - 5.8', desloc_bucha_12: '11.9 - 14.5', desloc_bucha_30: '0 - 0' },
        { d_max: 900, folga_c2: '0.44 - 0.64', folga_normal: '0.64 - 0.84', folga_c3: '0.84 - 1.07', folga_c4: '1.07 - 1.37', folga_c5: '1.37 - 1.69', reducao_min: 0.395, reducao_max: 0.48, desloc_eixo: '5.4 - 6.6', desloc_bucha_12: '13.5 - 16.4', desloc_bucha_30: '0 - 0' },
        { d_max: 1000, folga_c2: '0.49 - 0.71', folga_normal: '0.71 - 0.93', folga_c3: '0.93 - 1.19', folga_c4: '1.19 - 1.52', folga_c5: '1.52 - 1.86', reducao_min: 0.44, reducao_max: 0.535, desloc_eixo: '6 - 7.3', desloc_bucha_12: '15 - 18.3', desloc_bucha_30: '0 - 0' },
        { d_max: 1120, folga_c2: '0.53 - 0.77', folga_normal: '0.77 - 1.03', folga_c3: '1.03 - 1.3', folga_c4: '1.3 - 1.67', folga_c5: '1.67 - 2.05', reducao_min: 0.49, reducao_max: 0.6, desloc_eixo: '6.4 - 7.8', desloc_bucha_12: '16 - 19.5', desloc_bucha_30: '0 - 0' },
        { d_max: 1250, folga_c2: '0.57 - 0.83', folga_normal: '0.83 - 1.12', folga_c3: '1.12 - 1.42', folga_c4: '1.42 - 1.83', folga_c5: '1.83 - 2.25', reducao_min: 0.55, reducao_max: 0.67, desloc_eixo: '7.1 - 8.7', desloc_bucha_12: '17.8 - 21.7', desloc_bucha_30: '0 - 0' },
        { d_max: 1400, folga_c2: '0.62 - 0.91', folga_normal: '0.91 - 1.23', folga_c3: '1.23 - 1.56', folga_c4: '1.56 - 2', folga_c5: '2 - 2.45', reducao_min: 0.61, reducao_max: 0.75, desloc_eixo: '8 - 9.7', desloc_bucha_12: '19.9 - 24.3', desloc_bucha_30: '0 - 0' },
        { d_max: 1600, folga_c2: '0.68 - 1', folga_normal: '1 - 1.35', folga_c3: '1.35 - 1.72', folga_c4: '1.72 - 2.2', folga_c5: '2.2 - 2.7', reducao_min: 0.7, reducao_max: 0.85, desloc_eixo: '9.1 - 11.1', desloc_bucha_12: '22.7 - 27.7', desloc_bucha_30: '0 - 0' },
        { d_max: 1800, folga_c2: '0.75 - 1.11', folga_normal: '1.11 - 1.5', folga_c3: '1.5 - 1.92', folga_c4: '1.92 - 2.4', folga_c5: '2.4 - 2.95', reducao_min: 0.79, reducao_max: 0.96, desloc_eixo: '10.2 - 12.5', desloc_bucha_12: '25.6 - 31.2', desloc_bucha_30: '0 - 0' },
        { d_max: 2000, folga_c2: '0.87 - 1.2', folga_normal: '1.2 - 1.55', folga_c3: '1.55 - 1.99', folga_c4: '1.99 - 2.5', folga_c5: '2.5 - 3.05', reducao_min: 0.79, reducao_max: 0.96, desloc_eixo: '10.2 - 12.5', desloc_bucha_12: '25.6 - 31.2', desloc_bucha_30: '0 - 0' },
        { d_max: 2240, folga_c2: '0.87 - 1.2', folga_normal: '1.2 - 1.55', folga_c3: '1.55 - 1.99', folga_c4: '1.99 - 2.5', folga_c5: '2.5 - 3.05', reducao_min: 0.79, reducao_max: 0.96, desloc_eixo: '10.2 - 12.5', desloc_bucha_12: '25.6 - 31.2', desloc_bucha_30: '0 - 0' },
        { d_max: 2500, folga_c2: '0.87 - 1.2', folga_normal: '1.2 - 1.55', folga_c3: '1.55 - 1.99', folga_c4: '1.99 - 2.5', folga_c5: '2.5 - 3.05', reducao_min: 0.79, reducao_max: 0.96, desloc_eixo: '10.2 - 12.5', desloc_bucha_12: '25.6 - 31.2', desloc_bucha_30: '0 - 0' },
        { d_max: 2800, folga_c2: '0.87 - 1.2', folga_normal: '1.2 - 1.55', folga_c3: '1.55 - 1.99', folga_c4: '1.99 - 2.5', folga_c5: '2.5 - 3.05', reducao_min: 0.79, reducao_max: 0.96, desloc_eixo: '10.2 - 12.5', desloc_bucha_12: '25.6 - 31.2', desloc_bucha_30: '0 - 0' },
        { d_max: 3150, folga_c2: '0.87 - 1.2', folga_normal: '1.2 - 1.55', folga_c3: '1.55 - 1.99', folga_c4: '1.99 - 2.5', folga_c5: '2.5 - 3.05', reducao_min: 0.79, reducao_max: 0.96, desloc_eixo: '10.2 - 12.5', desloc_bucha_12: '25.6 - 31.2', desloc_bucha_30: '0 - 0' },
        { d_max: 3550, folga_c2: '0.87 - 1.2', folga_normal: '1.2 - 1.55', folga_c3: '1.55 - 1.99', folga_c4: '1.99 - 2.5', folga_c5: '2.5 - 3.05', reducao_min: 0.79, reducao_max: 0.96, desloc_eixo: '10.2 - 12.5', desloc_bucha_12: '25.6 - 31.2', desloc_bucha_30: '0 - 0' },
        { d_max: 4000, folga_c2: '0.87 - 1.2', folga_normal: '1.2 - 1.55', folga_c3: '1.55 - 1.99', folga_c4: '1.99 - 2.5', folga_c5: '2.5 - 3.05', reducao_min: 0.79, reducao_max: 0.96, desloc_eixo: '10.2 - 12.5', desloc_bucha_12: '25.6 - 31.2', desloc_bucha_30: '0 - 0' },
        { d_max: 4500, folga_c2: '0.87 - 1.2', folga_normal: '1.2 - 1.55', folga_c3: '1.55 - 1.99', folga_c4: '1.99 - 2.5', folga_c5: '2.5 - 3.05', reducao_min: 0.79, reducao_max: 0.96, desloc_eixo: '10.2 - 12.5', desloc_bucha_12: '25.6 - 31.2', desloc_bucha_30: '0 - 0' },
        { d_max: 5000, folga_c2: '0.87 - 1.2', folga_normal: '1.2 - 1.55', folga_c3: '1.55 - 1.99', folga_c4: '1.99 - 2.5', folga_c5: '2.5 - 3.05', reducao_min: 0.79, reducao_max: 0.96, desloc_eixo: '10.2 - 12.5', desloc_bucha_12: '25.6 - 31.2', desloc_bucha_30: '0 - 0' },
    ];

    // Dados extraídos da tabela para Rolamentos de Rolos Toroidais CARB
    const tabelaDadosCARB = [
        { d_max: 30, folga_c2: '0.02 - 0.04', folga_normal: '0.035 - 0.055', folga_c3: '0.05 - 0.065', folga_c4: '0.065 - 0.085', folga_c5: '0.08 - 0.1', reducao_min: 0.01, reducao_max: 0.015, desloc_eixo: '0.25 - 0.29', desloc_bucha_12: '0 - 0', desloc_bucha_30: '0 - 0' },
        { d_max: 40, folga_c2: '0.025 - 0.05', folga_normal: '0.045 - 0.065', folga_c3: '0.06 - 0.08', folga_c4: '0.08 - 0.1', folga_c5: '0.1 - 0.125', reducao_min: 0.015, reducao_max: 0.02, desloc_eixo: '0.3 - 0.35', desloc_bucha_12: '0.75 - 0.9', desloc_bucha_30: '0.44 - 0.54' },
        { d_max: 50, folga_c2: '0.03 - 0.055', folga_normal: '0.05 - 0.075', folga_c3: '0.07 - 0.095', folga_c4: '0.09 - 0.12', folga_c5: '0.115 - 0.145', reducao_min: 0.02, reducao_max: 0.025, desloc_eixo: '0.37 - 0.44', desloc_bucha_12: '0.95 - 1.1', desloc_bucha_30: '0.54 - 0.65' },
        { d_max: 65, folga_c2: '0.04 - 0.065', folga_normal: '0.06 - 0.09', folga_c3: '0.085 - 0.115', folga_c4: '0.11 - 0.15', folga_c5: '0.145 - 0.185', reducao_min: 0.025, reducao_max: 0.035, desloc_eixo: '0.45 - 0.54', desloc_bucha_12: '1.15 - 1.35', desloc_bucha_30: '0.65 - 0.8' },
        { d_max: 80, folga_c2: '0.05 - 0.08', folga_normal: '0.075 - 0.11', folga_c3: '0.105 - 0.14', folga_c4: '0.135 - 0.18', folga_c5: '0.175 - 0.22', reducao_min: 0.035, reducao_max: 0.04, desloc_eixo: '0.55 - 0.65', desloc_bucha_12: '1.4 - 1.65', desloc_bucha_30: '0.8 - 0.95' },
        { d_max: 100, folga_c2: '0.06 - 0.1', folga_normal: '0.095 - 0.135', folga_c3: '0.13 - 0.175', folga_c4: '0.17 - 0.22', folga_c5: '0.215 - 0.275', reducao_min: 0.04, reducao_max: 0.05, desloc_eixo: '0.66 - 0.79', desloc_bucha_12: '1.65 - 2', desloc_bucha_30: '0.95 - 1.15' },
        { d_max: 120, folga_c2: '0.075 - 0.115', folga_normal: '0.115 - 0.155', folga_c3: '0.155 - 0.205', folga_c4: '0.2 - 0.255', folga_c5: '0.255 - 0.325', reducao_min: 0.05, reducao_max: 0.06, desloc_eixo: '0.79 - 0.95', desloc_bucha_12: '2 - 2.35', desloc_bucha_30: '1.15 - 1.35' },
        { d_max: 140, folga_c2: '0.09 - 0.135', folga_normal: '0.135 - 0.18', folga_c3: '0.18 - 0.235', folga_c4: '0.23 - 0.295', folga_c5: '0.29 - 0.365', reducao_min: 0.06, reducao_max: 0.075, desloc_eixo: '0.93 - 1.1', desloc_bucha_12: '2.3 - 2.8', desloc_bucha_30: '1.3 - 1.6' },
        { d_max: 160, folga_c2: '0.1 - 0.155', folga_normal: '0.155 - 0.215', folga_c3: '0.21 - 0.27', folga_c4: '0.265 - 0.34', folga_c5: '0.335 - 0.415', reducao_min: 0.07, reducao_max: 0.085, desloc_eixo: '1.05 - 1.3', desloc_bucha_12: '2.65 - 3.2', desloc_bucha_30: '1.55 - 1.85' },
        { d_max: 180, folga_c2: '0.115 - 0.175', folga_normal: '0.17 - 0.24', folga_c3: '0.235 - 0.305', folga_c4: '0.3 - 0.385', folga_c5: '0.38 - 0.47', reducao_min: 0.08, reducao_max: 0.095, desloc_eixo: '1.2 - 1.45', desloc_bucha_12: '3 - 3.6', desloc_bucha_30: '1.7 - 2.1' },
        { d_max: 200, folga_c2: '0.13 - 0.195', folga_normal: '0.19 - 0.26', folga_c3: '0.26 - 0.33', folga_c4: '0.325 - 0.42', folga_c5: '0.415 - 0.52', reducao_min: 0.09, reducao_max: 0.105, desloc_eixo: '1.3 - 1.6', desloc_bucha_12: '3.3 - 4', desloc_bucha_30: '1.85 - 2.3' },
        { d_max: 225, folga_c2: '0.14 - 0.215', folga_normal: '0.21 - 0.29', folga_c3: '0.285 - 0.365', folga_c4: '0.36 - 0.46', folga_c5: '0.46 - 0.575', reducao_min: 0.1, reducao_max: 0.12, desloc_eixo: '1.45 - 1.8', desloc_bucha_12: '3.7 - 4.45', desloc_bucha_30: '2.15 - 2.55' },
        { d_max: 250, folga_c2: '0.16 - 0.235', folga_normal: '0.235 - 0.315', folga_c3: '0.315 - 0.405', folga_c4: '0.4 - 0.515', folga_c5: '0.51 - 0.635', reducao_min: 0.11, reducao_max: 0.13, desloc_eixo: '1.6 - 1.95', desloc_bucha_12: '4 - 4.85', desloc_bucha_30: '2.3 - 2.8' },
        { d_max: 280, folga_c2: '0.17 - 0.26', folga_normal: '0.255 - 0.345', folga_c3: '0.34 - 0.445', folga_c4: '0.44 - 0.56', folga_c5: '0.555 - 0.695', reducao_min: 0.12, reducao_max: 0.15, desloc_eixo: '1.8 - 2.15', desloc_bucha_12: '4.5 - 5.4', desloc_bucha_30: '2.6 - 3.1' },
        { d_max: 315, folga_c2: '0.195 - 0.285', folga_normal: '0.28 - 0.38', folga_c3: '0.375 - 0.485', folga_c4: '0.48 - 0.62', folga_c5: '0.615 - 0.765', reducao_min: 0.135, reducao_max: 0.165, desloc_eixo: '2 - 2.4', desloc_bucha_12: '4.95 - 6', desloc_bucha_30: '2.85 - 3.45' },
        { d_max: 355, folga_c2: '0.22 - 0.32', folga_normal: '0.315 - 0.42', folga_c3: '0.415 - 0.545', folga_c4: '0.54 - 0.68', folga_c5: '0.675 - 0.85', reducao_min: 0.15, reducao_max: 0.18, desloc_eixo: '2.15 - 2.65', desloc_bucha_12: '5.4 - 6.6', desloc_bucha_30: '3.1 - 3.8' },
        { d_max: 400, folga_c2: '0.25 - 0.35', folga_normal: '0.35 - 0.475', folga_c3: '0.47 - 0.6', folga_c4: '0.595 - 0.755', folga_c5: '0.755 - 0.92', reducao_min: 0.17, reducao_max: 0.21, desloc_eixo: '2.5 - 3', desloc_bucha_12: '6.2 - 7.6', desloc_bucha_30: '3.6 - 4.4' },
        { d_max: 450, folga_c2: '0.28 - 0.385', folga_normal: '0.38 - 0.525', folga_c3: '0.525 - 0.655', folga_c4: '0.65 - 0.835', folga_c5: '0.835 - 1.005', reducao_min: 0.195, reducao_max: 0.235, desloc_eixo: '2.8 - 3.4', desloc_bucha_12: '7 - 8.5', desloc_bucha_30: '4 - 4.9' },
        { d_max: 500, folga_c2: '0.305 - 0.435', folga_normal: '0.435 - 0.575', folga_c3: '0.575 - 0.735', folga_c4: '0.73 - 0.915', folga_c5: '0.91 - 1.115', reducao_min: 0.215, reducao_max: 0.265, desloc_eixo: '3.1 - 3.8', desloc_bucha_12: '7.8 - 9.5', desloc_bucha_30: '4.5 - 5.5' },
        { d_max: 560, folga_c2: '0.33 - 0.48', folga_normal: '0.47 - 0.64', folga_c3: '0.63 - 0.81', folga_c4: '0.8 - 1.01', folga_c5: '1 - 1.23', reducao_min: 0.245, reducao_max: 0.3, desloc_eixo: '3.4 - 4.1', desloc_bucha_12: '8.4 - 10.3', desloc_bucha_30: '4.85 - 6' },
        { d_max: 630, folga_c2: '0.38 - 0.53', folga_normal: '0.53 - 0.71', folga_c3: '0.7 - 0.89', folga_c4: '0.88 - 1.11', folga_c5: '1.11 - 1.35', reducao_min: 0.275, reducao_max: 0.34, desloc_eixo: '3.8 - 4.65', desloc_bucha_12: '9.5 - 11.6', desloc_bucha_30: '5.5 - 6.7' },
        { d_max: 710, folga_c2: '0.42 - 0.59', folga_normal: '0.59 - 0.78', folga_c3: '0.77 - 0.99', folga_c4: '0.98 - 1.23', folga_c5: '1.23 - 1.49', reducao_min: 0.31, reducao_max: 0.38, desloc_eixo: '4.25 - 5.2', desloc_bucha_12: '10.6 - 13', desloc_bucha_30: '6.1 - 7.5' },
        { d_max: 800, folga_c2: '0.48 - 0.68', folga_normal: '0.67 - 0.86', folga_c3: '0.86 - 1.1', folga_c4: '1.1 - 1.38', folga_c5: '1.38 - 1.66', reducao_min: 0.35, reducao_max: 0.425, desloc_eixo: '4.75 - 5.8', desloc_bucha_12: '11.9 - 14.5', desloc_bucha_30: '6.8 - 8.3' },
        { d_max: 900, folga_c2: '0.52 - 0.74', folga_normal: '0.73 - 0.96', folga_c3: '0.95 - 1.22', folga_c4: '1.21 - 1.53', folga_c5: '1.52 - 1.86', reducao_min: 0.395, reducao_max: 0.48, desloc_eixo: '5.4 - 6.6', desloc_bucha_12: '13.5 - 16.4', desloc_bucha_30: '7.8 - 9.5' },
        { d_max: 1000, folga_c2: '0.58 - 0.82', folga_normal: '0.81 - 1.04', folga_c3: '1.04 - 1.34', folga_c4: '1.34 - 1.67', folga_c5: '1.67 - 2.05', reducao_min: 0.44, reducao_max: 0.535, desloc_eixo: '6 - 7.3', desloc_bucha_12: '15 - 18.3', desloc_bucha_30: '8.6 - 10.5' },
        { d_max: 1120, folga_c2: '0.64 - 0.9', folga_normal: '0.89 - 1.17', folga_c3: '1.16 - 1.5', folga_c4: '1.49 - 1.88', folga_c5: '1.87 - 2.28', reducao_min: 0.49, reducao_max: 0.6, desloc_eixo: '6.4 - 7.8', desloc_bucha_12: '16 - 19.5', desloc_bucha_30: '9.2 - 11.2' },
        { d_max: 1250, folga_c2: '0.7 - 0.98', folga_normal: '0.97 - 1.28', folga_c3: '1.27 - 1.64', folga_c4: '1.63 - 2.06', folga_c5: '2.05 - 2.5', reducao_min: 0.55, reducao_max: 0.67, desloc_eixo: '7.1 - 8.7', desloc_bucha_12: '17.8 - 21.7', desloc_bucha_30: '10.3 - 12.5' },
        { d_max: 1400, folga_c2: '0.77 - 1.08', folga_normal: '1.08 - 1.41', folga_c3: '1.41 - 1.79', folga_c4: '1.78 - 2.25', folga_c5: '2.25 - 2.74', reducao_min: 0.61, reducao_max: 0.75, desloc_eixo: '8 - 9.7', desloc_bucha_12: '19.9 - 24.3', desloc_bucha_30: '11.5 - 14' },
        { d_max: 1600, folga_c2: '0.87 - 1.2', folga_normal: '1.2 - 1.55', folga_c3: '1.55 - 1.99', folga_c4: '1.99 - 2.5', folga_c5: '2.5 - 3.05', reducao_min: 0.7, reducao_max: 0.85, desloc_eixo: '9.1 - 11.1', desloc_bucha_12: '22.7 - 27.7', desloc_bucha_30: '13.1 - 16' },
        { d_max: 1800, folga_c2: '0.95 - 1.32', folga_normal: '1.32 - 1.69', folga_c3: '1.69 - 2.18', folga_c4: '2.18 - 2.73', folga_c5: '2.73 - 3.31', reducao_min: 0.79, reducao_max: 0.96, desloc_eixo: '10.2 - 12.5', desloc_bucha_12: '25.6 - 31.2', desloc_bucha_30: '14.8 - 18' },
    ];

    // Mapeamento dos elementos de resultado
    const calcularBtn = document.getElementById('calcular-btn');
    const diametroInput = document.getElementById('diametro-rolamento');
    const tipoRolamentoSelect = document.getElementById('tipo-rolamento');
    const resultadoContainer = document.getElementById('resultado-container');
    const erroContainer = document.getElementById('erro-container');
    const chartSection = document.getElementById('chart-section');
    const guideSection = document.getElementById('guide-section');
    const stepContainer = document.querySelector('.step-by-step-guide');
    let folgaChart = null; // Variável para armazenar a instância do gráfico

    const resultadoDiametro = document.getElementById('resultado-diametro');
    const folgaC2 = document.getElementById('folga-c2');
    const folgaNormal = document.getElementById('folga-normal');
    const folgaC3 = document.getElementById('folga-c3');
    const folgaC4 = document.getElementById('folga-c4');
    const folgaC5 = document.getElementById('folga-c5');
    const reducaoFolga = document.getElementById('reducao-folga');
    const deslocBucha12 = document.getElementById('desloc-bucha-12');
    const deslocBucha30 = document.getElementById('desloc-bucha-30');
    const folgaFinalNormal = document.getElementById('folga-final-normal');
    const folgaFinalC3 = document.getElementById('folga-final-c3');
    const folgaFinalC4 = document.getElementById('folga-final-c4');

    calcularBtn.addEventListener('click', () => {
        const diametro = parseFloat(diametroInput.value);
        const tipoRolamento = tipoRolamentoSelect.value;
        
        // Esconde seções
        resultadoContainer.classList.add('hidden');
        erroContainer.classList.add('hidden');
        chartSection.classList.add('hidden');
        guideSection.classList.add('hidden');

        if (isNaN(diametro) || diametro <= 0) {
            erroContainer.querySelector('p').textContent = "Por favor, insira um valor de diâmetro válido.";
            erroContainer.classList.remove('hidden');
            return;
        }

        let tabelaParaBuscar;
        if (tipoRolamento === 'autocompensadores') {
            tabelaParaBuscar = tabelaDadosAutocompensadores;
        } else {
            tabelaParaBuscar = tabelaDadosCARB;
        }
        
        let dadosEncontrados = null;
        for (const dados of tabelaParaBuscar) {
            if (diametro <= dados.d_max) {
                dadosEncontrados = dados;
                break;
            }
        }
        
        if (dadosEncontrados) {
            // Preenche os resultados na tela
            resultadoDiametro.textContent = diametro;
            folgaC2.textContent = dadosEncontrados.folga_c2 + ' mm';
            folgaNormal.textContent = dadosEncontrados.folga_normal + ' mm';
            folgaC3.textContent = dadosEncontrados.folga_c3 + ' mm';
            folgaC4.textContent = dadosEncontrados.folga_c4 + ' mm';
            folgaC5.textContent = dadosEncontrados.folga_c5 ? dadosEncontrados.folga_c5 + ' mm' : '--';

            reducaoFolga.textContent = `${dadosEncontrados.reducao_min.toFixed(3)} - ${dadosEncontrados.reducao_max.toFixed(3)} mm`;
            deslocBucha12.textContent = dadosEncontrados.desloc_eixo ? dadosEncontrados.desloc_eixo + ' mm' : '--';
            deslocBucha30.textContent = dadosEncontrados.desloc_bucha_30 ? dadosEncontrados.desloc_bucha_30 + ' mm' : '--';

            // Calcula e exibe a folga final
            function calcularFolgaFinal(folgaString, reducaoMin, reducaoMax) {
                const [min, max] = folgaString.split(' - ').map(Number);
                if (isNaN(min) || isNaN(max)) return '--';
                const finalMin = (min - reducaoMax).toFixed(3);
                const finalMax = (max - reducaoMin).toFixed(3);
                return `${finalMin} - ${finalMax} mm`;
            }

            folgaFinalNormal.textContent = calcularFolgaFinal(dadosEncontrados.folga_normal, dadosEncontrados.reducao_min, dadosEncontrados.reducao_max);
            folgaFinalC3.textContent = calcularFolgaFinal(dadosEncontrados.folga_c3, dadosEncontrados.reducao_min, dadosEncontrados.reducao_max);
            folgaFinalC4.textContent = calcularFolgaFinal(dadosEncontrados.folga_c4, dadosEncontrados.reducao_min, dadosEncontrados.reducao_max);

            // 1. Gerar o Gráfico
            gerarGraficoFolga(dadosEncontrados);

            // 2. Gerar o Guia Passo a Passo
            gerarGuiaMontagem(dadosEncontrados);

            // Mostra as seções de resultado, gráfico e guia
            resultadoContainer.classList.remove('hidden');
            chartSection.classList.remove('hidden');
            guideSection.classList.remove('hidden');

        } else {
            // Mostra o container de erro
            erroContainer.querySelector('p').textContent = `Diâmetro de ${diametro} mm não encontrado na tabela para este tipo de rolamento. A tabela cobre de 24 a 1800 mm.`;
            erroContainer.classList.remove('hidden');
        }
    });


    // --- Funções para gerar o conteúdo dinâmico ---

    function gerarGraficoFolga(dados) {
        // Extrai os valores min/max da folga para os gráficos
        const folgaNormal = dados.folga_normal.split(' - ').map(Number);
        const folgaC3 = dados.folga_c3.split(' - ').map(Number);
        const folgaC4 = dados.folga_c4.split(' - ').map(Number);
        const reducao = [dados.reducao_min, dados.reducao_max];

        const ctx = document.getElementById('folgaChart').getContext('2d');

        // Destrói a instância anterior do gráfico, se existir
        if (folgaChart) {
            folgaChart.destroy();
        }

        folgaChart = new Chart(ctx, {
            type: 'bar', // Tipo de gráfico: barras
            data: {
                labels: ['Folga Normal', 'Folga C3', 'Folga C4'],
                datasets: [{
                    label: 'Folga Inicial (Min)',
                    data: [folgaNormal[0], folgaC3[0], folgaC4[0]],
                    backgroundColor: 'rgba(0, 51, 102, 0.6)', // Cor primária
                    borderColor: 'rgba(0, 51, 102, 1)',
                    borderWidth: 1
                }, {
                    label: 'Folga Inicial (Max)',
                    data: [folgaNormal[1], folgaC3[1], folgaC4[1]],
                    backgroundColor: 'rgba(0, 90, 156, 0.6)', // Cor secundária
                    borderColor: 'rgba(0, 90, 156, 1)',
                    borderWidth: 1
                }, {
                    label: `Redução da Folga (${reducao[0]} - ${reducao[1]})`,
                    data: [reducao[1], reducao[1], reducao[1]], // Exibe a redução máxima como referência
                    backgroundColor: 'rgba(255, 193, 7, 0.6)', // Cor de destaque
                    borderColor: 'rgba(255, 193, 7, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Folga (mm)'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: `Folga Radial para diâmetro ${diametro} mm`
                    },
                    tooltip: {
                        callbacks: {
                            // Customiza o tooltip para exibir a faixa de folga
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += context.raw;
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }

    function gerarGuiaMontagem(dados) {
        stepContainer.innerHTML = ''; // Limpa o conteúdo anterior

        const passos = [
            `<h3>Passo 1: Verificação da Folga Inicial</h3>
             <p>Antes da montagem, verifique a folga radial interna do rolamento com um calibrador de lâminas. Para o seu rolamento de Ø${dados.d_max} mm, a folga recomendada para o <strong>grupo Normal</strong> é de <strong>${dados.folga_normal} mm</strong>.</p>`,
             
            `<h3>Passo 2: Aquecimento do Rolamento (Opcional, para rolamentos maiores)</h3>
             <p>Se o rolamento for grande, pode ser aquecido em um forno ou banho de óleo para facilitar a montagem no eixo cônico.</p>`,

            `<h3>Passo 3: Montagem no Eixo ou Bucha</h3>
             <p>Deslize o rolamento no eixo cônico ou bucha de fixação/desmontagem. O deslocamento axial para a montagem é crucial para alcançar a redução de folga desejada.</p>
             <p>Para a sua aplicação, o deslocamento axial recomendado é de <strong>${dados.desloc_bucha_12} mm</strong> (para conicidade 1:12) ou <strong>${dados.desloc_bucha_30} mm</strong> (para conicidade 1:30).</p>`,

            `<h3>Passo 4: Acompanhamento da Redução de Folga</h3>
             <p>Durante a montagem, meça continuamente a folga radial com o calibrador de lâminas. Continue a montagem até que a folga seja reduzida para a faixa de <strong>${dados.reducao_min.toFixed(3)} - ${dados.reducao_max.toFixed(3)} mm</strong>.</p>
             <p>Este valor garante que a folga residual (folga final) esteja dentro dos limites recomendados para o bom funcionamento do rolamento.</p>`,

            `<h3>Passo 5: Verificação da Folga Final</h3>
             <p>Após a montagem, a folga radial remanescente deve estar na seguinte faixa:</p>
             <ul>
                 <li><strong>Grupo Normal:</strong> ${folgaFinalNormal.textContent}</li>
                 <li><strong>Grupo C3:</strong> ${folgaFinalC3.textContent}</li>
                 <li><strong>Grupo C4:</strong> ${folgaFinalC4.textContent}</li>
             </ul>
             <p>Se a folga final estiver dentro dessa faixa, a montagem foi realizada com sucesso!</p>`
        ];

        passos.forEach(passoHtml => {
            const stepDiv = document.createElement('div');
            stepDiv.classList.add('step');
            stepDiv.innerHTML = passoHtml;
            stepContainer.appendChild(stepDiv);
        });
    }
});

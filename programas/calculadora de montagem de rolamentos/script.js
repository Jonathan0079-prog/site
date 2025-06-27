// Data from the uploaded HTML files
const bearingData = {
    standard: {
        subtitle: "Para a montagem de <b>Rolamentos Autocompensadores de Rolos</b> com furo cônico sobre Bucha de Fixação ou Desmontagem",
        data: [
            { d_min: 24, d_max: 30, c2_min: 0.02, c2_max: 0.03, normal_min: 0.03, normal_max: 0.04, c3_min: 0.04, c3_max: 0.055, c4_min: 0.055, c4_max: 0.075, c5_min: 0, c5_max: 0, reduction_min: 0.01, reduction_max: 0.015, axial_12_min: 0.25, axial_12_max: 0.29, axial_30_min: 0, axial_30_max: 0 },
            { d_min: 30, d_max: 40, c2_min: 0.025, c2_max: 0.035, normal_min: 0.035, normal_max: 0.05, c3_min: 0.05, c3_max: 0.065, c4_min: 0.065, c4_max: 0.085, c5_min: 0.085, c5_max: 0.105, reduction_min: 0.015, reduction_max: 0.02, axial_12_min: 0.3, axial_12_max: 0.35, axial_30_min: 0, axial_30_max: 0 },
            { d_min: 40, d_max: 50, c2_min: 0.03, c2_max: 0.045, normal_min: 0.045, normal_max: 0.06, c3_min: 0.06, c3_max: 0.08, c4_min: 0.08, c4_max: 0.1, c5_min: 0.1, c5_max: 0.13, reduction_min: 0.02, reduction_max: 0.025, axial_12_min: 0.37, axial_12_max: 0.44, axial_30_min: 0, axial_30_max: 0 },
            { d_min: 50, d_max: 65, c2_min: 0.04, c2_max: 0.055, normal_min: 0.055, normal_max: 0.075, c3_min: 0.075, c3_max: 0.095, c4_min: 0.095, c4_max: 0.12, c5_min: 0.12, c5_max: 0.16, reduction_min: 0.025, reduction_max: 0.035, axial_12_min: 0.45, axial_12_max: 0.54, axial_30_min: 1.15, axial_30_max: 1.35 },
            { d_min: 65, d_max: 80, c2_min: 0.05, c2_max: 0.07, normal_min: 0.07, normal_max: 0.095, c3_min: 0.095, c3_max: 0.12, c4_min: 0.12, c4_max: 0.15, c5_min: 0.15, c5_max: 0.2, reduction_min: 0.035, reduction_max: 0.04, axial_12_min: 0.55, axial_12_max: 0.65, axial_30_min: 1.4, axial_30_max: 1.65 },
            { d_min: 80, d_max: 100, c2_min: 0.055, c2_max: 0.08, normal_min: 0.08, normal_max: 0.11, c3_min: 0.11, c3_max: 0.14, c4_min: 0.14, c4_max: 0.18, c5_min: 0.18, c5_max: 0.23, reduction_min: 0.04, reduction_max: 0.05, axial_12_min: 0.66, axial_12_max: 0.79, axial_30_min: 1.65, axial_30_max: 2 },
            { d_min: 100, d_max: 120, c2_min: 0.065, c2_max: 0.1, normal_min: 0.1, normal_max: 0.135, c3_min: 0.135, c3_max: 0.17, c4_min: 0.17, c4_max: 0.22, c5_min: 0.22, c5_max: 0.28, reduction_min: 0.05, reduction_max: 0.06, axial_12_min: 0.79, axial_12_max: 0.95, axial_30_min: 2, axial_30_max: 2.35 },
            { d_min: 120, d_max: 140, c2_min: 0.08, c2_max: 0.12, normal_min: 0.12, normal_max: 0.16, c3_min: 0.16, c3_max: 0.2, c4_min: 0.2, c4_max: 0.26, c5_min: 0.26, c5_max: 0.33, reduction_min: 0.06, reduction_max: 0.075, axial_12_min: 0.93, axial_12_max: 1.1, axial_30_min: 2.3, axial_30_max: 2.8 },
            { d_min: 140, d_max: 160, c2_min: 0.09, c2_max: 0.13, normal_min: 0.13, normal_max: 0.18, c3_min: 0.18, c3_max: 0.23, c4_min: 0.23, c4_max: 0.3, c5_min: 0.3, c5_max: 0.38, reduction_min: 0.07, reduction_max: 0.085, axial_12_min: 1.05, axial_12_max: 1.3, axial_30_min: 2.65, axial_30_max: 3.2 },
            { d_min: 160, d_max: 180, c2_min: 0.1, c2_max: 0.14, normal_min: 0.14, normal_max: 0.2, c3_min: 0.2, c3_max: 0.26, c4_min: 0.26, c4_max: 0.34, c5_min: 0.34, c5_max: 0.43, reduction_min: 0.08, reduction_max: 0.095, axial_12_min: 1.2, axial_12_max: 1.45, axial_30_min: 3, axial_30_max: 3.6 },
            { d_min: 180, d_max: 200, c2_min: 0.11, c2_max: 0.16, normal_min: 0.16, normal_max: 0.22, c3_min: 0.22, c3_max: 0.29, c4_min: 0.29, c4_max: 0.37, c5_min: 0.37, c5_max: 0.47, reduction_min: 0.09, reduction_max: 0.105, axial_12_min: 1.3, axial_12_max: 1.6, axial_30_min: 3.3, axial_30_max: 4 },
            { d_min: 200, d_max: 225, c2_min: 0.12, c2_max: 0.18, normal_min: 0.18, normal_max: 0.25, c3_min: 0.25, c3_max: 0.32, c4_min: 0.32, c4_max: 0.41, c5_min: 0.41, c5_max: 0.52, reduction_min: 0.1, reduction_max: 0.12, axial_12_min: 1.45, axial_12_max: 1.8, axial_30_min: 3.7, axial_30_max: 4.45 },
            { d_min: 225, d_max: 250, c2_min: 0.14, c2_max: 0.2, normal_min: 0.2, normal_max: 0.27, c3_min: 0.27, c3_max: 0.35, c4_min: 0.35, c4_max: 0.45, c5_min: 0.45, c5_max: 0.57, reduction_min: 0.11, reduction_max: 0.13, axial_12_min: 1.6, axial_12_max: 1.95, axial_30_min: 4, axial_30_max: 4.85 },
            { d_min: 250, d_max: 280, c2_min: 0.15, c2_max: 0.22, normal_min: 0.22, normal_max: 0.3, c3_min: 0.3, c3_max: 0.39, c4_min: 0.39, c4_max: 0.49, c5_min: 0.49, c5_max: 0.62, reduction_min: 0.12, reduction_max: 0.15, axial_12_min: 1.8, axial_12_max: 2.15, axial_30_min: 4.5, axial_30_max: 5.4 },
            { d_min: 280, d_max: 315, c2_min: 0.17, c2_max: 0.24, normal_min: 0.24, normal_max: 0.33, c3_min: 0.33, c3_max: 0.43, c4_min: 0.43, c4_max: 0.54, c5_min: 0.54, c5_max: 0.68, reduction_min: 0.135, reduction_max: 0.165, axial_12_min: 2, axial_12_max: 2.4, axial_30_min: 4.95, axial_30_max: 6 },
            { d_min: 315, d_max: 355, c2_min: 0.19, c2_max: 0.27, normal_min: 0.27, normal_max: 0.36, c3_min: 0.36, c3_max: 0.47, c4_min: 0.47, c4_max: 0.59, c5_min: 0.59, c5_max: 0.74, reduction_min: 0.15, reduction_max: 0.18, axial_12_min: 2.15, axial_12_max: 2.65, axial_30_min: 5.4, axial_30_max: 6.6 },
            { d_min: 355, d_max: 400, c2_min: 0.21, c2_max: 0.3, normal_min: 0.3, normal_max: 0.4, c3_min: 0.4, c3_max: 0.52, c4_min: 0.52, c4_max: 0.65, c5_min: 0.65, c5_max: 0.82, reduction_min: 0.17, reduction_max: 0.21, axial_12_min: 2.5, axial_12_max: 3, axial_30_min: 6.2, axial_30_max: 7.6 },
            { d_min: 400, d_max: 450, c2_min: 0.23, c2_max: 0.33, normal_min: 0.33, normal_max: 0.44, c3_min: 0.44, c3_max: 0.57, c4_min: 0.57, c4_max: 0.72, c5_min: 0.72, c5_max: 0.91, reduction_min: 0.195, reduction_max: 0.235, axial_12_min: 2.8, axial_12_max: 3.4, axial_30_min: 7, axial_30_max: 8.5 },
            { d_min: 450, d_max: 500, c2_min: 0.26, c2_max: 0.37, normal_min: 0.37, normal_max: 0.49, c3_min: 0.49, c3_max: 0.63, c4_min: 0.63, c4_max: 0.79, c5_min: 0.79, c5_max: 1, reduction_min: 0.215, reduction_max: 0.265, axial_12_min: 3.1, axial_12_max: 3.8, axial_30_min: 7.8, axial_30_max: 9.5 },
            { d_min: 500, d_max: 560, c2_min: 0.29, c2_max: 0.41, normal_min: 0.41, normal_max: 0.54, c3_min: 0.54, c3_max: 0.68, c4_min: 0.68, c4_max: 0.87, c5_min: 0.87, c5_max: 1.1, reduction_min: 0.245, reduction_max: 0.3, axial_12_min: 3.4, axial_12_max: 4.1, axial_30_min: 8.4, axial_30_max: 10.3 },
            { d_min: 560, d_max: 630, c2_min: 0.32, c2_max: 0.46, normal_min: 0.46, normal_max: 0.6, c3_min: 0.6, c3_max: 0.76, c4_min: 0.76, c4_max: 0.98, c5_min: 0.98, c5_max: 1.23, reduction_min: 0.275, reduction_max: 0.34, axial_12_min: 3.8, axial_12_max: 4.65, axial_30_min: 9.5, axial_30_max: 11.6 },
            { d_min: 630, d_max: 710, c2_min: 0.35, c2_max: 0.51, normal_min: 0.51, normal_max: 0.67, c3_min: 0.67, c3_max: 0.85, c4_min: 0.85, c4_max: 1.09, c5_min: 1.09, c5_max: 1.36, reduction_min: 0.31, reduction_max: 0.38, axial_12_min: 4.25, axial_12_max: 5.2, axial_30_min: 10.6, axial_30_max: 13 },
            { d_min: 710, d_max: 800, c2_min: 0.39, c2_max: 0.57, normal_min: 0.57, normal_max: 0.75, c3_min: 0.75, c3_max: 0.96, c4_min: 0.96, c4_max: 1.22, c5_min: 1.22, c5_max: 1.5, reduction_min: 0.35, reduction_max: 0.425, axial_12_min: 4.75, axial_12_max: 5.8, axial_30_min: 11.9, axial_30_max: 14.5 },
            { d_min: 800, d_max: 900, c2_min: 0.44, c2_max: 0.64, normal_min: 0.64, normal_max: 0.84, c3_min: 0.84, c3_max: 1.07, c4_min: 1.07, c4_max: 1.37, c5_min: 1.37, c5_max: 1.69, reduction_min: 0.395, reduction_max: 0.48, axial_12_min: 5.4, axial_12_max: 6.6, axial_30_min: 13.5, axial_30_max: 16.4 },
            { d_min: 900, d_max: 1000, c2_min: 0.49, c2_max: 0.71, normal_min: 0.71, normal_max: 0.93, c3_min: 0.93, c3_max: 1.19, c4_min: 1.19, c4_max: 1.52, c5_min: 1.52, c5_max: 1.86, reduction_min: 0.44, reduction_max: 0.535, axial_12_min: 6, axial_12_max: 7.3, axial_30_min: 15, axial_30_max: 18.3 },
            { d_min: 1000, d_max: 1120, c2_min: 0.53, c2_max: 0.77, normal_min: 0.77, normal_max: 1.03, c3_min: 1.03, c3_max: 1.3, c4_min: 1.3, c4_max: 1.67, c5_min: 1.67, c5_max: 2.05, reduction_min: 0.49, reduction_max: 0.6, axial_12_min: 6.4, axial_12_max: 7.8, axial_30_min: 16, axial_30_max: 19.5 },
            { d_min: 1120, d_max: 1250, c2_min: 0.57, c2_max: 0.83, normal_min: 0.83, normal_max: 1.12, c3_min: 1.12, c3_max: 1.42, c4_min: 1.42, c4_max: 1.83, c5_min: 1.83, c5_max: 2.25, reduction_min: 0.55, reduction_max: 0.67, axial_12_min: 7.1, axial_12_max: 8.7, axial_30_min: 17.8, axial_30_max: 21.7 },
            { d_min: 1250, d_max: 1400, c2_min: 0.62, c2_max: 0.91, normal_min: 0.91, normal_max: 1.23, c3_min: 1.23, c3_max: 1.56, c4_min: 1.56, c4_max: 2, c5_min: 2, c5_max: 2.45, reduction_min: 0.61, reduction_max: 0.75, axial_12_min: 8, axial_12_max: 9.7, axial_30_min: 19.9, axial_30_max: 24.3 },
            { d_min: 1400, d_max: 1600, c2_min: 0.68, c2_max: 1, normal_min: 1, normal_max: 1.35, c3_min: 1.35, c3_max: 1.72, c4_min: 1.72, c4_max: 2.2, c5_min: 2.2, c5_max: 2.7, reduction_min: 0.7, reduction_max: 0.85, axial_12_min: 9.1, axial_12_max: 11.1, axial_30_min: 22.7, axial_30_max: 27.7 },
            { d_min: 1600, d_max: 1800, c2_min: 0.75, c2_max: 1.11, normal_min: 1.11, normal_max: 1.5, c3_min: 1.5, c3_max: 1.92, c4_min: 1.92, c4_max: 2.4, c5_min: 2.4, c5_max: 2.95, reduction_min: 0.79, reduction_max: 0.96, axial_12_min: 10.2, axial_12_max: 12.5, axial_30_min: 25.6, axial_30_max: 31.2 },
        ]
    },
    carb: {
        subtitle: "Para a montagem de <b>Rolamentos de Rolos Toroidais CARB</b> com furo cônico<br>sobre Bucha de Fixação ou Desmontagem",
        data: [
            { d_min: 24, d_max: 30, c2_min: 0.02, c2_max: 0.04, normal_min: 0.035, normal_max: 0.055, c3_min: 0.05, c3_max: 0.065, c4_min: 0.065, c4_max: 0.085, c5_min: 0.08, c5_max: 0.1, reduction_min: 0.01, reduction_max: 0.015, axial_12_min: 0.25, axial_12_max: 0.29, axial_30_min: 0, axial_30_max: 0 },
            { d_min: 30, d_max: 40, c2_min: 0.025, c2_max: 0.05, normal_min: 0.045, normal_max: 0.065, c3_min: 0.06, c3_max: 0.08, c4_min: 0.08, c4_max: 0.1, c5_min: 0.1, c5_max: 0.125, reduction_min: 0.015, reduction_max: 0.02, axial_12_min: 0.3, axial_12_max: 0.35, axial_30_min: 0.75, axial_30_max: 0.9 },
            { d_min: 40, d_max: 50, c2_min: 0.03, c2_max: 0.055, normal_min: 0.05, normal_max: 0.075, c3_min: 0.07, c3_max: 0.095, c4_min: 0.09, c4_max: 0.12, c5_min: 0.115, c5_max: 0.145, reduction_min: 0.02, reduction_max: 0.025, axial_12_min: 0.37, axial_12_max: 0.44, axial_30_min: 0.95, axial_30_max: 1.1 },
            { d_min: 50, d_max: 65, c2_min: 0.04, c2_max: 0.065, normal_min: 0.06, normal_max: 0.09, c3_min: 0.085, c3_max: 0.115, c4_min: 0.11, c4_max: 0.15, c5_min: 0.145, c5_max: 0.185, reduction_min: 0.025, reduction_max: 0.035, axial_12_min: 0.45, axial_12_max: 0.54, axial_30_min: 1.15, axial_30_max: 1.35 },
            { d_min: 65, d_max: 80, c2_min: 0.05, c2_max: 0.08, normal_min: 0.075, normal_max: 0.11, c3_min: 0.105, c3_max: 0.14, c4_min: 0.135, c4_max: 0.18, c5_min: 0.175, c5_max: 0.22, reduction_min: 0.035, reduction_max: 0.04, axial_12_min: 0.55, axial_12_max: 0.65, axial_30_min: 1.4, axial_30_max: 1.65 },
            { d_min: 80, d_max: 100, c2_min: 0.06, c2_max: 0.1, normal_min: 0.095, normal_max: 0.135, c3_min: 0.13, c3_max: 0.175, c4_min: 0.17, c4_max: 0.22, c5_min: 0.215, c5_max: 0.275, reduction_min: 0.04, reduction_max: 0.05, axial_12_min: 0.66, axial_12_max: 0.79, axial_30_min: 1.65, axial_30_max: 2 },
            { d_min: 100, d_max: 120, c2_min: 0.075, c2_max: 0.115, normal_min: 0.115, normal_max: 0.155, c3_min: 0.155, c3_max: 0.205, c4_min: 0.2, c4_max: 0.255, c5_min: 0.255, c5_max: 0.325, reduction_min: 0.05, reduction_max: 0.06, axial_12_min: 0.79, axial_12_max: 0.95, axial_30_min: 2, axial_30_max: 2.35 },
            { d_min: 120, d_max: 140, c2_min: 0.09, c2_max: 0.135, normal_min: 0.135, normal_max: 0.18, c3_min: 0.18, c3_max: 0.235, c4_min: 0.23, c4_max: 0.295, c5_min: 0.29, c5_max: 0.365, reduction_min: 0.06, reduction_max: 0.075, axial_12_min: 0.93, axial_12_max: 1.1, axial_30_min: 2.3, axial_30_max: 2.8 },
            { d_min: 140, d_max: 160, c2_min: 0.1, c2_max: 0.155, normal_min: 0.155, normal_max: 0.215, c3_min: 0.21, c3_max: 0.27, c4_min: 0.265, c4_max: 0.34, c5_min: 0.335, c5_max: 0.415, reduction_min: 0.07, reduction_max: 0.085, axial_12_min: 1.05, axial_12_max: 1.3, axial_30_min: 2.65, axial_30_max: 3.2 },
            { d_min: 160, d_max: 180, c2_min: 0.115, c2_max: 0.175, normal_min: 0.17, normal_max: 0.24, c3_min: 0.235, c3_max: 0.305, c4_min: 0.3, c4_max: 0.385, c5_min: 0.38, c5_max: 0.47, reduction_min: 0.08, reduction_max: 0.095, axial_12_min: 1.2, axial_12_max: 1.45, axial_30_min: 3, axial_30_max: 3.6 },
            { d_min: 180, d_max: 200, c2_min: 0.13, c2_max: 0.195, normal_min: 0.19, normal_max: 0.26, c3_min: 0.26, c3_max: 0.33, c4_min: 0.325, c4_max: 0.42, c5_min: 0.415, c5_max: 0.52, reduction_min: 0.09, reduction_max: 0.105, axial_12_min: 1.3, axial_12_max: 1.6, axial_30_min: 3.3, axial_30_max: 4 },
            { d_min: 200, d_max: 225, c2_min: 0.14, c2_max: 0.215, normal_min: 0.21, normal_max: 0.29, c3_min: 0.285, c3_max: 0.365, c4_min: 0.36, c4_max: 0.46, c5_min: 0.46, c5_max: 0.575, reduction_min: 0.1, reduction_max: 0.12, axial_12_min: 1.45, axial_12_max: 1.8, axial_30_min: 3.7, axial_30_max: 4.45 },
            { d_min: 225, d_max: 250, c2_min: 0.16, c2_max: 0.235, normal_min: 0.235, normal_max: 0.315, c3_min: 0.315, c3_max: 0.405, c4_min: 0.4, c4_max: 0.515, c5_min: 0.51, c5_max: 0.635, reduction_min: 0.11, reduction_max: 0.13, axial_12_min: 1.6, axial_12_max: 1.95, axial_30_min: 4, axial_30_max: 4.85 },
            { d_min: 250, d_max: 280, c2_min: 0.17, c2_max: 0.26, normal_min: 0.255, normal_max: 0.345, c3_min: 0.34, c3_max: 0.445, c4_min: 0.44, c4_max: 0.56, c5_min: 0.555, c5_max: 0.695, reduction_min: 0.12, reduction_max: 0.15, axial_12_min: 1.8, axial_12_max: 2.15, axial_30_min: 4.5, axial_30_max: 5.4 },
            { d_min: 280, d_max: 315, c2_min: 0.195, c2_max: 0.285, normal_min: 0.28, normal_max: 0.38, c3_min: 0.375, c3_max: 0.485, c4_min: 0.48, c4_max: 0.62, c5_min: 0.615, c5_max: 0.765, reduction_min: 0.135, reduction_max: 0.165, axial_12_min: 2, axial_12_max: 2.4, axial_30_min: 4.95, axial_30_max: 6 },
            { d_min: 315, d_max: 355, c2_min: 0.22, c2_max: 0.32, normal_min: 0.315, normal_max: 0.42, c3_min: 0.415, c3_max: 0.545, c4_min: 0.54, c4_max: 0.68, c5_min: 0.675, c5_max: 0.85, reduction_min: 0.15, reduction_max: 0.18, axial_12_min: 2.15, axial_12_max: 2.65, axial_30_min: 5.4, axial_30_max: 6.6 },
            { d_min: 355, d_max: 400, c2_min: 0.25, c2_max: 0.35, normal_min: 0.35, normal_max: 0.475, c3_min: 0.47, c3_max: 0.6, c4_min: 0.595, c4_max: 0.755, c5_min: 0.755, c5_max: 0.92, reduction_min: 0.17, reduction_max: 0.21, axial_12_min: 2.5, axial_12_max: 3, axial_30_min: 6.2, axial_30_max: 7.6 },
            { d_min: 400, d_max: 450, c2_min: 0.28, c2_max: 0.385, normal_min: 0.38, normal_max: 0.525, c3_min: 0.525, c3_max: 0.655, c4_min: 0.65, c4_max: 0.835, c5_min: 0.835, c5_max: 1.005, reduction_min: 0.195, reduction_max: 0.235, axial_12_min: 2.8, axial_12_max: 3.4, axial_30_min: 7, axial_30_max: 8.5 },
            { d_min: 450, d_max: 500, c2_min: 0.305, c2_max: 0.435, normal_min: 0.435, normal_max: 0.575, c3_min: 0.575, c3_max: 0.735, c4_min: 0.73, c4_max: 0.915, c5_min: 0.91, c5_max: 1.115, reduction_min: 0.215, reduction_max: 0.265, axial_12_min: 3.1, axial_12_max: 3.8, axial_30_min: 7.8, axial_30_max: 9.5 },
            { d_min: 500, d_max: 560, c2_min: 0.33, c2_max: 0.48, normal_min: 0.47, normal_max: 0.64, c3_min: 0.63, c3_max: 0.81, c4_min: 0.8, c4_max: 1.01, c5_min: 1, c5_max: 1.23, reduction_min: 0.245, reduction_max: 0.3, axial_12_min: 3.4, axial_12_max: 4.1, axial_30_min: 8.4, axial_30_max: 10.3 },
            { d_min: 560, d_max: 630, c2_min: 0.38, c2_max: 0.53, normal_min: 0.53, normal_max: 0.71, c3_min: 0.7, c3_max: 0.89, c4_min: 0.88, c4_max: 1.11, c5_min: 1.11, c5_max: 1.35, reduction_min: 0.275, reduction_max: 0.34, axial_12_min: 3.8, axial_12_max: 4.65, axial_30_min: 9.5, axial_30_max: 11.6 },
            { d_min: 630, d_max: 710, c2_min: 0.42, c2_max: 0.59, normal_min: 0.59, normal_max: 0.78, c3_min: 0.77, c3_max: 0.99, c4_min: 0.98, c4_max: 1.23, c5_min: 1.23, c5_max: 1.49, reduction_min: 0.31, reduction_max: 0.38, axial_12_min: 4.25, axial_12_max: 5.2, axial_30_min: 10.6, axial_30_max: 13 },
            { d_min: 710, d_max: 800, c2_min: 0.48, c2_max: 0.68, normal_min: 0.67, normal_max: 0.86, c3_min: 0.86, c3_max: 1.1, c4_min: 1.1, c4_max: 1.38, c5_min: 1.38, c5_max: 1.66, reduction_min: 0.35, reduction_max: 0.425, axial_12_min: 4.75, axial_12_max: 5.8, axial_30_min: 11.9, axial_30_max: 14.5 },
            { d_min: 800, d_max: 900, c2_min: 0.52, c2_max: 0.74, normal_min: 0.73, normal_max: 0.96, c3_min: 0.95, c3_max: 1.22, c4_min: 1.21, c4_max: 1.53, c5_min: 1.52, c5_max: 1.86, reduction_min: 0.395, reduction_max: 0.48, axial_12_min: 5.4, axial_12_max: 6.6, axial_30_min: 13.5, axial_30_max: 16.4 },
            { d_min: 900, d_max: 1000, c2_min: 0.58, c2_max: 0.82, normal_min: 0.81, normal_max: 1.04, c3_min: 1.04, c3_max: 1.34, c4_min: 1.34, c4_max: 1.67, c5_min: 1.67, c5_max: 2.05, reduction_min: 0.44, reduction_max: 0.535, axial_12_min: 6, axial_12_max: 7.3, axial_30_min: 15, axial_30_max: 18.3 },
            { d_min: 1000, d_max: 1120, c2_min: 0.64, c2_max: 0.9, normal_min: 0.89, normal_max: 1.17, c3_min: 1.16, c3_max: 1.5, c4_min: 1.49, c4_max: 1.88, c5_min: 1.87, c5_max: 2.28, reduction_min: 0.49, reduction_max: 0.6, axial_12_min: 6.4, axial_12_max: 7.8, axial_30_min: 16, axial_30_max: 19.5 },
            { d_min: 1120, d_max: 1250, c2_min: 0.7, c2_max: 0.98, normal_min: 0.97, normal_max: 1.28, c3_min: 1.27, c3_max: 1.64, c4_min: 1.63, c4_max: 2.06, c5_min: 2.05, c5_max: 2.5, reduction_min: 0.55, reduction_max: 0.67, axial_12_min: 7.1, axial_12_max: 8.7, axial_30_min: 17.8, axial_30_max: 21.7 },
            { d_min: 1250, d_max: 1400, c2_min: 0.77, c2_max: 1.08, normal_min: 1.08, normal_max: 1.41, c3_min: 1.41, c3_max: 1.79, c4_min: 1.78, c4_max: 2.25, c5_min: 2.25, c5_max: 2.74, reduction_min: 0.61, reduction_max: 0.75, axial_12_min: 8, axial_12_max: 9.7, axial_30_min: 19.9, axial_30_max: 24.3 },
            { d_min: 1400, d_max: 1600, c2_min: 0.87, c2_max: 1.2, normal_min: 1.2, normal_max: 1.55, c3_min: 1.55, c3_max: 1.99, c4_min: 1.99, c4_max: 2.5, c5_min: 2.5, c5_max: 3.05, reduction_min: 0.7, reduction_max: 0.85, axial_12_min: 9.1, axial_12_max: 11.1, axial_30_min: 22.7, axial_30_max: 27.7 },
            { d_min: 1600, d_max: 1800, c2_min: 0.95, c2_max: 1.32, normal_min: 1.32, normal_max: 1.69, c3_min: 1.69, c3_max: 2.18, c4_min: 2.18, c4_max: 2.73, c5_min: 2.73, c5_max: 3.31, reduction_min: 0.79, reduction_max: 0.96, axial_12_min: 10.2, axial_12_max: 12.5, axial_30_min: 25.6, axial_30_max: 31.2 },
        ]
    }
};

const bearingTypeSelect = document.getElementById('bearing-type');
const diameterRangeSelect = document.getElementById('diameter-range');
const resultsContainer = document.getElementById('results-container');
const subTitleDiv = document.getElementById('sub-title');

function populateDiameterRanges() {
    const selectedType = bearingTypeSelect.value;
    const data = bearingData[selectedType].data;
    subTitleDiv.innerHTML = bearingData[selectedType].subtitle;

    diameterRangeSelect.innerHTML = '<option value="">Selecione um diâmetro</option>';
    data.forEach(row => {
        const option = document.createElement('option');
        option.value = `${row.d_min}-${row.d_max}`;
        option.textContent = `maior que ${row.d_min} mm até ${row.d_max} mm inclusive`;
        diameterRangeSelect.appendChild(option);
    });
    displayResults(); // Clear results when bearing type changes
}

function displayResults() {
    const selectedType = bearingTypeSelect.value;
    const selectedRange = diameterRangeSelect.value;
    const data = bearingData[selectedType].data;
    resultsContainer.innerHTML = '';

    if (!selectedRange) {
        return;
    }

    const [d_min, d_max] = selectedRange.split('-').map(Number);
    const rowData = data.find(row => row.d_min === d_min && row.d_max === d_max);

    if (rowData) {
        const tableHTML = `
            <table>
                <thead>
                    <tr>
                        <td rowspan="2" colspan="2">Medida Nominal<br>do diâmetro interno<br>do rolamento d</td>
                        <td colspan="10">Folga interna radial antes da montagem</td>
                        <td rowspan="3" colspan="2" style="border-bottom-width:0px;">Redução da<br>folga interna radial<br>do Rolamento</td>
                        <td rowspan="2" colspan="2"><nobr>Deslocamento<sup>1) 2)</sup></nobr><br>axial<br>conicidade 1:12</td>
                        <td rowspan="2" colspan="2"><nobr>Deslocamento<sup>1) 2)</sup></nobr><br>axial<br>conicidade 1:30</td>
                    </tr>
                    <tr>
                        <td colspan="10">Grupo de folga</td>
                    </tr>
                    <tr>
                        <td rowspan="2">maior<br>que<br>mm</td>
                        <td rowspan="2">até<br>inclusive<br>mm</td>
                        <td colspan="2">C2</td>
                        <td colspan="2">Normal</td>
                        <td colspan="2">C3</td>
                        <td colspan="2">C4</td>
                        <td colspan="2">C5</td>
                        <td colspan="2">Bucha</td>
                        <td colspan="2">Bucha</td>
                    </tr>
                    <tr>
                        <td>min.<br>mm</td>
                        <td>max.<br>mm</td>
                        <td>min.<br>mm</td>
                        <td>max.<br>mm</td>
                        <td>min.<br>mm</td>
                        <td>max.<br>mm</td>
                        <td>min.<br>mm</td>
                        <td>max.<br>mm</td>
                        <td>min.<br>mm</td>
                        <td>max.<br>mm</td>
                        <td>min.<br>mm</td>
                        <td>max.<br>mm</td>
                        <td>min.<br>m</td>
                        <td>max.<br>mm</td>
                        <td>min.<br>mm</td>
                        <td>max.<br>mm</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${rowData.d_min}</td>
                        <td>${rowData.d_max}</td>
                        <td>${rowData.c2_min}</td>
                        <td>${rowData.c2_max}</td>
                        <td>${rowData.normal_min}</td>
                        <td>${rowData.normal_max}</td>
                        <td>${rowData.c3_min}</td>
                        <td>${rowData.c3_max}</td>
                        <td>${rowData.c4_min}</td>
                        <td>${rowData.c4_max}</td>
                        <td>${rowData.c5_min}</td>
                        <td>${rowData.c5_max}</td>
                        <td>${rowData.reduction_min}</td>
                        <td>${rowData.reduction_max}</td>
                        <td>${rowData.axial_12_min}</td>
                        <td>${rowData.axial_12_max}</td>
                        <td>${rowData.axial_30_min}</td>
                        <td>${rowData.axial_30_max}</td>
                    </tr>
                     <tr class="obs">
                        <td colspan="15" style="border-right-width:0px; text-align: left;">
                            Válido somente para eixos maciços de aço em aplicações gerais.<br>
                            1) Os valores listados devem ser utilizados apenas como referência. A conferência final deve ser feita com o calibrador de lâminas.<br>
                            2) O deslocamento axial difere ligeiramente entre as séries dos rolamentos.
                        </td>
                        <td colspan="3" style="border-left-width:0px; text-align:right;">Eng. de Aplicação</td>
                     </tr>
                </tbody>
            </table>
        `;
        resultsContainer.innerHTML = tableHTML;
    }
}

// Event Listeners
bearingTypeSelect.addEventListener('change', populateDiameterRanges);
diameterRangeSelect.addEventListener('change', displayResults);

// Initial population of the diameter ranges on page load
document.addEventListener('DOMContentLoaded', populateDiameterRanges);

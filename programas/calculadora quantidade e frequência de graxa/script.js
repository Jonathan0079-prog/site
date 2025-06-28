document.addEventListener('DOMContentLoaded', () => {
    // --- Referências para os elementos do HTML ---
    const calculateBtn = document.getElementById('calculate');
    const resetBtn = document.getElementById('reset');
    const resultsSection = document.getElementById('results');
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const tooltips = document.querySelectorAll('.tooltip');

    // --- Referências para os campos de entrada ---
    const bearingTypeInput = document.getElementById('bearingType');
    const boreDiameterInput = document.getElementById('boreDiameter');
    const outerDiameterInput = document.getElementById('outerDiameter');
    const widthInput = document.getElementById('width');
    const rpmInput = document.getElementById('rpm');
    const temperatureInput = document.getElementById('temperature');
    const loadConditionInput = document.getElementById('loadCondition');
    const environmentInput = document.getElementById('environment');
    const workingHoursInput = document.getElementById('workingHours');
    const greaseDensityInput = document.getElementById('greaseDensity');
    const moistureInput = document.getElementById('moisture');
    const vibrationInput = document.getElementById('vibration');
    const orientationInput = document.getElementById('orientation');

    // --- Referências para os campos de resultado ---
    const initialFillResult = document.getElementById('initialFill');
    const initialFillCm3Result = document.getElementById('initialFillCm3');
    const relubAmountResult = document.getElementById('relubAmount');
    const relubIntervalResult = document.getElementById('relubInterval');
    const lubricationIntervalDaysResult = document.getElementById('lubricationIntervalResult');
    const relubIntervalWeeksResult = document.getElementById('relubIntervalWeeks');
    const greaseLifeResult = document.getElementById('greaseLife');
    const continuousVolumeResult = document.getElementById('continuousVolume');
    const bearingMassResult = document.getElementById('bearingMass');
    const recViscosityResult = document.getElementById('recViscosity');
    const recThickenerResult = document.getElementById('recThickener');
    const recNLGIResult = document.getElementById('recNLGI');
    const recAdditivesResult = document.getElementById('recAdditives');
    const notesResult = document.getElementById('notesResult');


    // ----------------------------------------------------------------------------------------------------
    // --- LÓGICA DE CÁLCULO DE LUBRIFICAÇÃO (PRINCIPAL FUNÇÃO) ---
    // ----------------------------------------------------------------------------------------------------
    function calculateLubrication() {
        // 1. Pega os valores dos inputs e converte para números
        const bearingType = bearingTypeInput.value;
        const d = parseFloat(boreDiameterInput.value);      // Diâmetro do furo (mm)
        const D = parseFloat(outerDiameterInput.value);     // Diâmetro externo (mm)
        const B = parseFloat(widthInput.value);             // Largura (mm)
        const n = parseFloat(rpmInput.value);               // Rotação (RPM)
        const T = parseFloat(temperatureInput.value);       // Temperatura (°C)
        const loadCondition = loadConditionInput.value;
        const environment = environmentInput.value;
        const workingHours = parseFloat(workingHoursInput.value);
        const greaseDensity = parseFloat(greaseDensityInput.value);
        const moistureFactor = parseFloat(moistureInput.value);     // Fator de umidade
        const vibrationFactor = parseFloat(vibrationInput.value);   // Fator de vibração
        const orientationFactor = parseFloat(orientationInput.value); // Fator de orientação

        // Verifica se os valores essenciais são válidos
        if (isNaN(d) || isNaN(D) || isNaN(B) || isNaN(n) || isNaN(T) || isNaN(greaseDensity)) {
            alert("Por favor, preencha todos os campos obrigatórios com valores numéricos válidos.");
            return; // Interrompe a função se a validação falhar
        }

        // 2. Cálculos de Parâmetros de Entrada
        // dm: Diâmetro médio do rolamento (mm)
        const dm = (d + D) / 2;
        // Fator de Velocidade (n * dm)
        const speedFactor = n * dm;

        // 3. Determina o Fator do Rolamento (k) com base no tipo
        // Este fator é crucial para o cálculo do intervalo de relubrificação e é baseado em dados empíricos
        let k;
        let bearingFactorMultiplier = 1; // Fator adicional para alguns tipos de rolamento
        switch (bearingType) {
            case 'ball': // Rígido de Esferas (DGBB)
            case 'angular': // Contato Angular (ACBB)
                k = 1.0;
                break;
            case 'cylindricalRoller': // Rolos Cilíndricos (CRB)
                k = 3.0; // Geralmente, rolos exigem mais lubrificação
                break;
            case 'sphericalRoller': // Rolos Esféricos (SRB)
                k = 1.2;
                break;
            case 'taperedRoller': // Rolos Cônicos (TRB)
                k = 2.0;
                break;
            default:
                k = 1.0; // Padrão
        }

        // 4. Calcula a Carga de Graxa Inicial (Gramas)
        // Fórmula aproximada baseada na largura e diâmetro do rolamento
        // Fonte: Dados de engenharia para lubrificação de rolamentos
        const initialFillGrams = 0.005 * B * (D - d); // Fórmula simplificada
        
        // 5. Calcula o Volume Inicial de Graxa (cm³)
        // Volume = Massa / Densidade
        const initialFillCm3 = initialFillGrams / greaseDensity;

        // 6. Calcula a Quantidade de Relubrificação (Gramas)
        // Quantidade recomendada é aproximadamente 1/3 da carga inicial
        const relubAmountGrams = initialFillGrams / 3;

        // 7. Calcula a Vida Útil Estimada da Graxa (L10 em horas)
        // Fórmula baseada na temperatura (Fator de Correção de Temperatura, FT) e no Fator de Velocidade
        // L10 = Base Life * FT. FT = 2^( (80 - T) / 15 )
        // A vida útil de graxa (L10) é a vida onde 90% dos rolamentos ainda estão funcionando.
        const baseGreaseLife = 100000; // Vida útil base em horas para rolamentos vedados sob condições ideais
        const temperatureFactor_FT = Math.pow(2, (80 - T) / 15);
        const greaseLifeHours = baseGreaseLife * temperatureFactor_FT;
        
        // 8. Calcula o Intervalo de Relubrificação Base (em horas)
        // Fórmula de Intervalo Base (SKF)
        // t_f = k * 10^5 * (1 / (n * dm))^0.5
        const relubIntervalBaseHours = k * Math.pow(10, 5) * Math.pow(1 / speedFactor, 0.5);

        // 9. Aplica os Fatores de Correção para o Intervalo
        // Fatores de Carga, Ambiente, Umidade, Vibração e Orientação
        let loadFactor_FL = 1.0;
        if (loadCondition === 'heavy') loadFactor_FL = 0.8;
        if (loadCondition === 'shock') loadFactor_FL = 0.6;

        let environmentFactor_FE = 1.0;
        if (environment === 'dusty') environmentFactor_FE = 0.8;
        if (environment === 'humid') environmentFactor_FE = 0.6;
        if (environment === 'chemical') environmentFactor_FE = 0.4;
        
        // Intervalo Ajustado = Intervalo Base * Fatores de Correção
        const relubIntervalAdjustedHours = relubIntervalBaseHours * loadFactor_FL * environmentFactor_FE * moistureFactor * vibrationFactor * orientationFactor;

        // 10. Calcula o Intervalo em Dias e Semanas
        const relubIntervalDays = relubIntervalAdjustedHours / 24;
        const relubIntervalWeeks = relubIntervalAdjustedHours / workingHours;

        // 11. Calcula o Volume Contínuo para Sistemas de Lubrificação Automática (cm³/h)
        // Massa de relubrificação (g) / Intervalo (h) = Taxa (g/h)
        // Taxa (g/h) / Densidade (g/cm³) = Taxa (cm³/h)
        const continuousVolumeCm3ph = (relubAmountGrams / greaseDensity) / relubIntervalAdjustedHours;
        
        // 12. Estima a Massa do Rolamento (kg) para referência
        // Fórmula de massa volumétrica simplificada
        const bearingVolume_cm3 = (Math.PI / 4) * (Math.pow(D, 2) - Math.pow(d, 2)) * B / 1000; // Volume em cm³
        const estimatedMass_kg = bearingVolume_cm3 * 7.85 / 1000; // Densidade do aço ~7.85 g/cm³

        // 13. Recomendações de Graxa
        // Baseado na velocidade e temperatura
        let recViscosity, recThickener, recNLGI, recAdditives, recNotes;
        
        if (speedFactor < 50000 && T < 80) {
            recViscosity = "ISO VG 100 - 220";
            recThickener = "Lítio ou Lítio Complexo";
            recNLGI = "2 ou 3";
            recAdditives = "EP (Extrema Pressão) se a carga for pesada";
        } else if (speedFactor >= 50000 && speedFactor < 200000 && T < 100) {
            recViscosity = "ISO VG 68 - 150";
            recThickener = "Lítio Complexo";
            recNLGI = "2";
            recAdditives = "Antioxidantes e Inibidores de Corrosão";
        } else if (speedFactor >= 200000 || T > 100) {
            recViscosity = "ISO VG 32 - 100";
            recThickener = "Poliureia ou Complexo de Lítio Sintético";
            recNLGI = "1 ou 2";
            recAdditives = "Sintéticos (PAO, Éster) para altas temperaturas";
        } else {
            recViscosity = "Verificar com o fabricante";
            recThickener = "Verificar com o fabricante";
            recNLGI = "Verificar com o fabricante";
            recAdditives = "Verificar com o fabricante";
        }

        // Notas Adicionais baseadas nas condições
        if (moistureInput.value < 1 || environment === 'humid' || environment === 'chemical') {
            recNotes = "As condições operacionais são desafiadoras. Considere graxas com espessantes resistentes à água (Sulfonato de Cálcio) ou selagem extra para proteger o rolamento.";
        } else if (vibrationInput.value < 1) {
            recNotes = "A vibração pode causar a separação do óleo da graxa. Use graxas com boa estabilidade mecânica (Complexo de Lítio ou Poliureia) para evitar vazamentos.";
        } else if (orientationInput.value < 1) {
            recNotes = "Eixo vertical exige atenção especial para retenção da graxa. Certifique-se de que a selagem do mancal seja eficaz.";
        } else {
            recNotes = "As condições de operação parecem normais. Siga as recomendações de manutenção.";
        }

        // 14. Atualiza os elementos HTML com os resultados calculados
        initialFillResult.textContent = initialFillGrams.toFixed(2);
        initialFillCm3Result.textContent = initialFillCm3.toFixed(2);
        relubAmountResult.textContent = relubAmountGrams.toFixed(2);
        relubIntervalResult.textContent = relubIntervalAdjustedHours.toFixed(0);
        lubricationIntervalDaysResult.textContent = `${relubIntervalDays.toFixed(0)} dias`;
        relubIntervalWeeksResult.textContent = relubIntervalWeeks.toFixed(1);
        greaseLifeResult.textContent = greaseLifeHours.toFixed(0);
        continuousVolumeResult.textContent = continuousVolumeCm3ph.toPrecision(3);
        bearingMassResult.textContent = estimatedMass_kg.toFixed(2);

        // Atualiza as recomendações
        recViscosityResult.textContent = recViscosity;
        recThickenerResult.textContent = recThickener;
        recNLGIResult.textContent = recNLGI;
        recAdditivesResult.textContent = recAdditives;
        notesResult.querySelector('p:last-child').textContent = recNotes;

        // 15. Exibe a seção de resultados
        resultsSection.style.display = 'block';
    }


    // ----------------------------------------------------------------------------------------------------
    // --- LÓGICA DE INTERFACE (já discutida) ---
    // ----------------------------------------------------------------------------------------------------

    // Atribui a função de cálculo ao botão de simular
    calculateBtn.addEventListener('click', calculateLubrication);

    // Função para limpar campos e resultados
    function resetFields() {
        document.getElementById('lubricationForm').reset();
        resultsSection.style.display = 'none'; // Esconde a seção de resultados
        
        // Limpa os valores dos resultados para evitar dados residuais
        initialFillResult.textContent = '';
        initialFillCm3Result.textContent = '';
        relubAmountResult.textContent = '';
        relubIntervalResult.textContent = '';
        lubricationIntervalDaysResult.textContent = '';
        relubIntervalWeeksResult.textContent = '';
        greaseLifeResult.textContent = '';
        continuousVolumeResult.textContent = '';
        bearingMassResult.textContent = '';

        recViscosityResult.textContent = '';
        recThickenerResult.textContent = '';
        recNLGIResult.textContent = '';
        recAdditivesResult.textContent = '';
        notesResult.querySelector('p:last-child').textContent = 'As condições de operação parecem normais. Siga as recomendações de manutenção.';

        // Remove a classe 'active' de todos os tooltips
        tooltips.forEach(tooltip => tooltip.classList.remove('active'));
    }

    // Atribui a função de reset ao botão de limpar
    resetBtn.addEventListener('click', resetFields);

    // --- Lógica para o botão de scroll-to-top ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            scrollTopBtn.style.display = 'block';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // --- Lógica para os tooltips em mobile ---
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            
            tooltips.forEach(otherTooltip => {
                if (otherTooltip !== tooltip) {
                    otherTooltip.classList.remove('active');
                }
            });
            
            tooltip.classList.toggle('active');
        });
    });

    document.addEventListener('click', (event) => {
        tooltips.forEach(tooltip => {
            if (!tooltip.contains(event.target)) {
                tooltip.classList.remove('active');
            }
        });
    });
});

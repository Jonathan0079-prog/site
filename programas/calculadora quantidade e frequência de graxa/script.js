document.addEventListener('DOMContentLoaded', () => {
    // --- Referências para os elementos do HTML (mantidas como no original) ---
    const calculateBtn = document.getElementById('calculate');
    const resetBtn = document.getElementById('reset');
    const resultsSection = document.getElementById('results');
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const tooltips = document.querySelectorAll('.tooltip');

    // --- Referências para os campos de entrada (mantidas como no original) ---
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

    // --- Referências para os campos de resultado (mantidas como no original) ---
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

    // --- Função auxiliar para limitar valores (clamp) ---
    const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

    // ----------------------------------------------------------------------------------------------------
    // --- LÓGICA DE CÁLCULO DE LUBRIFICAÇÃO (PRINCIPAL FUNÇÃO ATUALIZADA) ---
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
        const workingHours = parseFloat(workingHoursInput.value) || 24; // Padrão 24h se vazio
        const greaseDensity = parseFloat(greaseDensityInput.value);

        // **ATUALIZADO**: Usa a função clamp para garantir que os fatores de correção estejam dentro de um intervalo seguro (ex: 0.1 a 1.0)
        const moistureFactor = clamp(parseFloat(moistureInput.value), 0.1, 1.0);
        const vibrationFactor = clamp(parseFloat(vibrationInput.value), 0.1, 1.0);
        const orientationFactor = clamp(parseFloat(orientationInput.value), 0.1, 1.0);

        // Validação de entradas essenciais
        if (isNaN(d) || isNaN(D) || isNaN(B) || isNaN(n) || isNaN(T) || isNaN(greaseDensity) || d <= 0 || D <= 0 || B <= 0) {
            alert("Por favor, preencha todos os campos obrigatórios com valores numéricos válidos e maiores que zero.");
            return;
        }
        if (d >= D) {
            alert("O diâmetro do furo (d) deve ser menor que o diâmetro externo (D).");
            return;
        }

        // 2. Cálculos de Parâmetros de Entrada (Correto)
        const dm = (d + D) / 2;
        const speedFactor = n * dm;

        // **ATUALIZADO**: Fator do Rolamento (k) com lógica corrigida e valores mais realistas.
        // Um fator menor significa um intervalo de relubrificação mais curto.
        let k;
        switch (bearingType) {
            case 'ball': // Rígido de Esferas (DGBB)
            case 'angular': // Contato Angular (ACBB)
                k = 1.0; // Linha de base
                break;
            case 'sphericalRoller': // Rolos Esféricos (SRB)
            case 'taperedRoller': // Rolos Cônicos (TRB)
                k = 0.5; // Intervalo ~50% menor que rolamentos de esferas
                break;
            case 'cylindricalRoller': // Rolos Cilíndricos (CRB)
                k = 0.4; // Intervalo ~60% menor, pois geralmente operam em velocidades mais altas
                break;
            default:
                k = 1.0;
        }

        // **ATUALIZADO**: Cálculo da quantidade de relubrificação (Relubrication Amount)
        // Usa a fórmula padrão da indústria: Gr = 0.005 * D * B (onde D e B estão em mm)
        const relubAmountGrams = 0.005 * D * B;

        // **ATUALIZADO**: Cálculo da Carga de Graxa Inicial (Initial Fill)
        // A carga inicial é tipicamente 3 a 5 vezes a quantidade de relubrificação. Usamos 3x como um valor seguro.
        const initialFillGrams = relubAmountGrams * 3;
        const initialFillCm3 = initialFillGrams / greaseDensity;

        // **ATUALIZADO**: Cálculo da Vida Útil da Graxa (L10) com modelo realista
        // Este novo modelo evita resultados de milhões de horas.
        const moderateSpeedFactor = 75000; // n*dm de referência para uma condição "média"
        const baseLifeAtModerateSpeed = 20000; // Vida base de ~20.000 horas para uma graxa de boa qualidade nesta condição
        
        // Corrige a vida útil com base na velocidade real (maior velocidade = menor vida)
        let speedCorrectionForLife = Math.pow(moderateSpeedFactor / Math.max(speedFactor, 1000), 0.7); // Evita divisão por zero
        speedCorrectionForLife = clamp(speedCorrectionForLife, 0.1, 5.0); // Limita o multiplicador para evitar extremos

        const baseGreaseLife = baseLifeAtModerateSpeed * speedCorrectionForLife;
        
        // Fator de temperatura (mesma fórmula, mas aplicada a uma base mais realista)
        const temperatureFactor_FT = Math.pow(2, (70 - T) / 15); // Usando 70°C como referência mais comum
        
        let calculatedGreaseLifeHours = baseGreaseLife * temperatureFactor_FT;
        
        // Limita a vida útil máxima a 10 anos, pois outros fatores (oxidação, etc.) se tornam relevantes
        const greaseLifeHours = Math.min(calculatedGreaseLifeHours, 87600); // 10 anos * 365 dias * 24 horas


        // **ATUALIZADO**: Cálculo do Intervalo de Relubrificação Base (em horas)
        // A constante foi ajustada de 10^5 para 10^6 para fornecer uma escala de tempo mais realista
        // com base em gráficos de fabricantes.
        const relubIntervalBaseHours = k * Math.pow(10, 6) * Math.pow(1 / Math.max(speedFactor, 1000), 0.5);

        // 9. Aplica os Fatores de Correção para o Intervalo (Correto)
        let loadFactor_FL = 1.0;
        if (loadCondition === 'heavy') loadFactor_FL = 0.7;
        if (loadCondition === 'shock') loadFactor_FL = 0.4;

        let environmentFactor_FE = 1.0;
        if (environment === 'dusty') environmentFactor_FE = 0.7;
        if (environment === 'humid') environmentFactor_FE = 0.5;
        if (environment === 'chemical') environmentFactor_FE = 0.3;
        
        const relubIntervalAdjustedHours = relubIntervalBaseHours * loadFactor_FL * environmentFactor_FE * moistureFactor * vibrationFactor * orientationFactor;

        // 10. Calcula o Intervalo em Dias e Semanas (Correto)
        const relubIntervalDays = relubIntervalAdjustedHours / 24;
        const relubIntervalWeeks = relubIntervalAdjustedHours / workingHours;

        // 11. Calcula o Volume Contínuo para Sistemas de Lubrificação Automática (Correto)
        const continuousVolumeCm3ph = (relubAmountGrams / greaseDensity) / relubIntervalAdjustedHours;
        
        // 12. Estima a Massa do Rolamento (kg) para referência (Correto)
        const bearingVolume_cm3 = (Math.PI / 4) * (Math.pow(D, 2) - Math.pow(d, 2)) * B / 1000;
        const estimatedMass_kg = bearingVolume_cm3 * 7.85 / 1000;

        // 13. Recomendações de Graxa (Lógica mantida, é uma boa simplificação)
        let recViscosity, recThickener, recNLGI, recAdditives, recNotes;
        if (speedFactor < 50000 && T < 80) {
            recViscosity = "ISO VG 150 - 460";
            recThickener = "Lítio ou Lítio Complexo";
            recNLGI = "2";
            recAdditives = "EP (Extrema Pressão) se a carga for pesada";
        } else if (speedFactor >= 50000 && speedFactor < 250000 && T < 120) {
            recViscosity = "ISO VG 68 - 150";
            recThickener = "Lítio Complexo ou Poliureia";
            recNLGI = "2";
            recAdditives = "Antioxidantes e Inibidores de Corrosão";
        } else if (speedFactor >= 250000 || T >= 120) {
            recViscosity = "ISO VG 32 - 100";
            recThickener = "Poliureia, Cálcio Sulfonato ou PFPE";
            recNLGI = "1 ou 2";
            recAdditives = "Sintéticos (PAO, Éster, PFPE) para altas temperaturas";
        } else {
            recViscosity = "Verificar com o fabricante";
            recThickener = "Verificar com o fabricante";
            recNLGI = "Verificar com o fabricante";
            recAdditives = "Verificar com o fabricante";
        }

        // Notas Adicionais (Lógica mantida)
        if (moistureInput.value < 0.7 || environment === 'humid' || environment === 'chemical') {
            recNotes = "Condições úmidas ou contaminadas. Considere graxas com espessantes resistentes à água (Sulfonato de Cálcio, Complexo de Alumínio) e boa proteção contra corrosão.";
        } else if (vibrationInput.value < 0.7) {
            recNotes = "Vibração pode causar separação do óleo. Use graxas com alta estabilidade mecânica (Complexo de Lítio, Poliureia) para evitar falhas estruturais da graxa.";
        } else if (orientationInput.value < 1) {
            recNotes = "Eixo vertical ou inclinado exige graxas com boa adesividade para evitar que a graxa escape da área de contato. Considere uma graxa com NLGI mais elevado (ex: 3).";
        } else {
            recNotes = "As condições de operação parecem normais. Siga as recomendações de manutenção e monitore a condição do rolamento.";
        }
        
        // Adiciona um alerta se o intervalo for muito curto, sugerindo lubrificação automática
        if(relubIntervalAdjustedHours < 100) {
            recNotes += " ATENÇÃO: O intervalo de relubrificação é extremamente curto. Recomenda-se fortemente o uso de um sistema de lubrificação automática contínua.";
        }


        // 14. Atualiza os elementos HTML com os resultados calculados
        initialFillResult.textContent = initialFillGrams.toFixed(2);
        initialFillCm3Result.textContent = initialFillCm3.toFixed(2);
        relubAmountResult.textContent = relubAmountGrams.toFixed(2);
        relubIntervalResult.textContent = relubIntervalAdjustedHours.toFixed(0);
        lubricationIntervalDaysResult.textContent = `${relubIntervalDays.toFixed(1)} dias`;
        relubIntervalWeeksResult.textContent = relubIntervalWeeks.toFixed(1);
        greaseLifeResult.textContent = greaseLifeHours.toFixed(0);
        // Exibe o volume contínuo de forma mais inteligente
        continuousVolumeResult.textContent = isFinite(continuousVolumeCm3ph) ? continuousVolumeCm3ph.toPrecision(3) : 'N/A';
        bearingMassResult.textContent = estimatedMass_kg.toFixed(2);

        recViscosityResult.textContent = recViscosity;
        recThickenerResult.textContent = recThickener;
        recNLGIResult.textContent = recNLGI;
        recAdditivesResult.textContent = recAdditives;
        notesResult.querySelector('p:last-child').textContent = recNotes;

        // 15. Exibe a seção de resultados
        resultsSection.style.display = 'block';
    }


    // --- LÓGICA DE INTERFACE (não precisa ser alterada) ---
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

        tooltips.forEach(tooltip => tooltip.classList.remove('active'));
    }

    resetBtn.addEventListener('click', resetFields);

    window.addEventListener('scroll', () => {
        scrollTopBtn.style.display = (window.scrollY > 200) ? 'block' : 'none';
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    tooltips.forEach(tooltip => {
        tooltip.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            const isActive = tooltip.classList.contains('active');
            tooltips.forEach(otherTooltip => otherTooltip.classList.remove('active'));
            if (!isActive) {
                tooltip.classList.add('active');
            }
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

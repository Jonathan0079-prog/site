document.getElementById('calculate').addEventListener('click', function() {
    // --- 1. COLETA E VALIDAÇÃO DOS DADOS DE ENTRADA ---
    const bearingType = document.getElementById('bearingType').value;
    const d = parseFloat(document.getElementById('innerDiameter').value);
    const D = parseFloat(document.getElementById('outerDiameter').value);
    const B = parseFloat(document.getElementById('width').value);
    const n = parseFloat(document.getElementById('speed').value);
    const T = parseFloat(document.getElementById('temperature').value);

    // Fatores de correção
    const f_load = parseFloat(document.getElementById('load').value);
    const f_cont = parseFloat(document.getElementById('contamination').value);
    const f_moist = parseFloat(document.getElementById('moisture').value);
    const f_vib = parseFloat(document.getElementById('vibration').value);
    const f_orient = parseFloat(document.getElementById('orientation').value);

    if (isNaN(d) || isNaN(D) || isNaN(B) || isNaN(n) || isNaN(T) || d <= 0 || D <= 0 || B <= 0) {
        alert("Por favor, preencha todas as dimensões, rotação e temperatura com valores numéricos válidos.");
        return;
    }
    if (d >= D) {
        alert("O diâmetro interno (d) deve ser menor que o diâmetro externo (D).");
        return;
    }

    // --- 2. CÁLCULOS PRINCIPAIS ---

    // Fatores específicos por tipo de rolamento (Constantes de engenharia)
    const bearingFactors = {
        ball:      { kf: 1.0, greaseLifeFactor: 1.0 },
        cylindrical: { kf: 1.5, greaseLifeFactor: 0.8 },
        spherical: { kf: 2.0, greaseLifeFactor: 0.5 },
        tapered:   { kf: 1.8, greaseLifeFactor: 0.6 },
        angular:   { kf: 1.1, greaseLifeFactor: 0.9 }
    };
    const kf = bearingFactors[bearingType].kf;

    // A. Quantidade de Relubrificação (Fórmula Padrão de Mercado)
    // G = 0.005 * D * B (em gramas)
    const relubAmount = 0.005 * D * B;

    // B. Carga de Graxa Inicial (Aproximação para preenchimento do mancal)
    // Fator empírico para carga inicial (ex: 2 a 4x a carga de relubrificação)
    const initialFill = relubAmount * 3;

    // C. Intervalo de Relubrificação (Cálculo Complexo em Cascata)
    
    // C.1. Diâmetro Médio e Fator de Velocidade
    const dm = 0.5 * (d + D);
    const speedFactor = n * dm;

    // C.2. Intervalo Base (tf_base) - Fórmula adaptada dos gráficos da SKF
    // Uma fórmula exponencial que simula a curva de vida da graxa vs. velocidade
    let tf_base = 100000000 * Math.pow(speedFactor, -1.2) * bearingFactors[bearingType].greaseLifeFactor;

    // C.3. Fator de Correção de Temperatura (f_temp) - Regra do polegar (Arrhenius)
    // A cada 15°C acima de 70°C, o intervalo cai pela metade.
    let f_temp = 1.0;
    if (T > 70) {
        f_temp = Math.pow(0.5, (T - 70) / 15);
    }
    // Proteção para temperaturas muito altas ou baixas
    if (T > 150 || T < -20) f_temp *= 0.1;

    // C.4. Cálculo do Intervalo Final Ajustado
    const allFactors = f_temp * f_load * f_cont * f_moist * f_vib * f_orient;
    let finalInterval = tf_base * allFactors;

    // Limita o intervalo máximo para um valor razoável (ex: 4 anos)
    if (finalInterval > 35000) {
        finalInterval = 35000;
    }
    if (finalInterval < 8) { // Mínimo de 8 horas (diário)
        finalInterval = 8;
    }

    // D. Vida da Graxa (L10) para rolamentos vedados
    // Baseado no intervalo final, mas com um multiplicador (L10 é estatisticamente > que o intervalo de relub)
    const greaseLife = finalInterval * 2.7; // Relação L10 ~ 2.7 * L01 (intervalo de relub.)

    // --- 3. RECOMENDAÇÃO DE GRAXA (SISTEMA ESPECIALISTA SIMPLIFICADO) ---
    let recViscosity, recThickener, recNLGI, recAdditives;

    // Viscosidade (baseado no fator de velocidade e temperatura)
    if (speedFactor < 10000) { recViscosity = "460+"; }
    else if (speedFactor < 75000) { recViscosity = "220-460"; }
    else if (speedFactor < 200000) { recViscosity = "100-220"; }
    else if (speedFactor < 400000) { recViscosity = "46-100"; }
    else { recViscosity = "15-46"; }
    if(T > 80) recViscosity = "Aumentar ↑";


    // Espessante (baseado nos fatores ambientais e temperatura)
    if (f_moist < 0.5) { recThickener = "Sulf. de Cálcio"; }
    else if (T > 120) { recThickener = "Poliureia"; }
    else { recThickener = "Compl. de Lítio"; }
    if (f_vib < 0.6) {recThickener += " (Alta Estabilidade Mecânica)";}


    // Grau NLGI (baseado na orientação e contaminação)
    if (f_orient < 1.0 || f_cont < 0.5) { recNLGI = "3"; }
    else if (T < 0) { recNLGI = "1"; }
    else { recNLGI = "2"; }

    // Aditivos (baseado na carga)
    if (f_load < 0.5) { recAdditives = "EP (Extrema Pressão)"; }
    else { recAdditives = "Padrão (AW/AO)"; }


    // --- 4. EXIBIÇÃO DOS RESULTADOS ---
    document.getElementById('initialFill').textContent = initialFill.toFixed(1);
    document.getElementById('relubAmount').textContent = relubAmount.toFixed(1);
    document.getElementById('relubInterval').textContent = Math.round(finalInterval);
    document.getElementById('greaseLife').textContent = Math.round(greaseLife);

    document.getElementById('recViscosity').textContent = recViscosity;
    document.getElementById('recThickener').textContent = recThickener;
    document.getElementById('recNLGI').textContent = recNLGI;
    document.getElementById('recAdditives').textContent = recAdditives;

    document.getElementById('results').style.display = 'block';
});

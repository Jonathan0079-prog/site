
document.getElementById('calculate').addEventListener('click', function() {
    // --- 1. COLETA E VALIDAÇÃO DOS DADOS DE ENTRADA ---
    const form = document.getElementById('lubricationForm');
    if (!form.checkValidity()) {
        alert("Por favor, preencha todos os campos antes de calcular.");
        return;
    }

    const bearingType = document.getElementById('bearingType').value;
    const D = parseFloat(document.getElementById('outerDiameter').value); // Diâmetro Externo
    const d = parseFloat(document.getElementById('boreDiameter').value); // Diâmetro do Furo (anteriormente innerDiameter)
    const B = parseFloat(document.getElementById('width').value);      // Largura
    const rpm = parseFloat(document.getElementById('rpm').value);      // Velocidade (anteriormente speed)
    const temp = parseFloat(document.getElementById('temperature').value);
    
    // Novos inputs do segundo código
    const loadCondition = document.getElementById('loadCondition').value; // Usando o input do primeiro código
    const environment = document.getElementById('environment').value;   // Usando o input do primeiro código
    const workingHoursPerWeek = parseFloat(document.getElementById('workingHours').value);
    const greaseDensity = parseFloat(document.getElementById('greaseDensity').value);
    
    // Fatores de correção (do segundo código, mapeados para a nova lógica)
    // Usaremos os fatores do primeiro código (loadCondition e environment) e ignoraremos os outros
    // inputs de fator, pois a lógica do primeiro código já os calcula.
    const f_moist = parseFloat(document.getElementById('moisture').value);
    const f_vib = parseFloat(document.getElementById('vibration').value);
    const f_orient = parseFloat(document.getElementById('orientation').value);

    // Validação completa (combinada e aprimorada)
    if (isNaN(d) || isNaN(D) || isNaN(B) || isNaN(rpm) || isNaN(temp) || isNaN(workingHoursPerWeek) || isNaN(greaseDensity) || d <= 0 || D <= 0 || B <= 0 || workingHoursPerWeek <= 0 || greaseDensity <= 0) {
        alert("Por favor, preencha todos os campos com valores numéricos positivos e válidos.");
        return;
    }
    if (d >= D) {
        alert("O diâmetro interno (d) deve ser menor que o diâmetro externo (D).");
        return;
    }

    // --- 2. CÁLCULOS PRINCIPAIS (LÓGICA COMBINADA) ---

    // A. Quantidade de Relubrificação (Fórmula Padrão do primeiro código)
    // G = 0.005 * D * B (em gramas)
    const greaseQuantity = 0.005 * D * B;
    const relubAmount = greaseQuantity; // Mantendo a variável do segundo código para consistência

    // B. Carga de Graxa Inicial (Aproximação do segundo código)
    const initialFill = relubAmount * 3;

    // C. CÁLCULO DO INTERVALO DE RELUBRIFICAÇÃO (LÓGICA DO PRIMEIRO CÓDIGO)
    
    // C.1. Intervalo Base em Horas
    let baseInterval = 2000; // Padrão para rolamento de esferas
    if (bearingType === 'cylindricalRoller' || bearingType === 'taperedRoller') {
        baseInterval = 1500;
    } else if (bearingType === 'sphericalRoller') {
        baseInterval = 1000;
    }

    // C.2. Fatores de Correção
    
    // Fator de Temperatura (kT) - Lógica detalhada do primeiro código
    let tempFactor = 1.0;
    if (temp > 70) {
        const tempDiff = temp - 70;
        tempFactor = Math.pow(0.5, tempDiff / 15);
    }
    
    // Fator de Carga (kL)
    let loadFactor = 1.0;
    if (loadCondition === 'heavy') {
        loadFactor = 0.6;
    } else if (loadCondition === 'shock') {
        loadFactor = 0.3;
    }

    // Fator de Ambiente/Contaminação (kC)
    let envFactor = 1.0;
    if (environment === 'dusty') {
        envFactor = 0.5;
    } else if (environment === 'humid') {
        envFactor = 0.25;
    } else if (environment === 'chemical') {
        envFactor = 0.1;
    }

    // Fator de Velocidade (kS) - Usando o valor nDm (RPM * Diâmetro Médio)
    const dm = (D + d) / 2; // Diâmetro médio
    const nDm = rpm * dm;
    let speedFactor = 1.0;
    if (nDm > 200000) {
        speedFactor = 200000 / nDm;
    } else if (nDm < 10000) {
        speedFactor = 0.8;
    }
    
    // C.3. Cálculo Final do Intervalo em Horas
    let finalIntervalHours = baseInterval * tempFactor * loadFactor * envFactor * speedFactor;

    // Arredondamento e ajuste de mínimo do primeiro código
    finalIntervalHours = Math.round(finalIntervalHours / 10) * 10;
    if(finalIntervalHours < 24) finalIntervalHours = 24; // Mínimo de 1 dia

    const finalIntervalDays = (finalIntervalHours / 24).toFixed(1);
    
    // D. Vida da Graxa (L10) para rolamentos vedados (do segundo código)
    const greaseLife = finalIntervalHours * 2.7;

    // --- NOVOS CÁLCULOS DO SEGUNDO CÓDIGO ---
    
    // E. Massa do Rolamento (Fórmula empírica)
    const bearingMass = (D * D - d * d) * B * 6.2e-6;

    // F. Período de Relubrificação em Semanas
    const relubIntervalWeeks = finalIntervalHours / workingHoursPerWeek;

    // G. Volume de Relubrificação Contínua
    const continuousVolume_cm3_hr = (relubAmount / greaseDensity) / finalIntervalHours;

    // --- 3. RECOMENDAÇÃO DE GRAXA (SISTEMA ESPECIALISTA SIMPLIFICADO) ---
    let recViscosity, recThickener, recNLGI, recAdditives;

    // Usando nDm (speedFactor) para a viscosidade
    if (nDm < 10000) { recViscosity = "460+"; }
    else if (nDm < 75000) { recViscosity = "220-460"; }
    else if (nDm < 200000) { recViscosity = "100-220"; }
    else if (nDm < 400000) { recViscosity = "46-100"; }
    else { recViscosity = "15-46"; }
    if(temp > 80) recViscosity = "Aumentar ↑";


    // Usando fatores do segundo código
    if (f_moist < 0.5) { recThickener = "Sulf. de Cálcio"; }
    else if (temp > 120) { recThickener = "Poliureia"; }
    else { recThickener = "Compl. de Lítio"; }
    if (f_vib < 0.6) {recThickener += " (Alta Estabilidade Mecânica)";}


    // Usando fatores do segundo código
    if (f_orient < 1.0 || environment === 'dusty' || environment === 'chemical') { recNLGI = "3"; }
    else if (temp < 0) { recNLGI = "1"; }
    else { recNLGI = "2"; }

    // Usando loadCondition
    if (loadCondition === 'heavy' || loadCondition === 'shock') { recAdditives = "EP (Extrema Pressão)"; }
    else { recAdditives = "Padrão (AW/AO)"; }

    // --- 4. GERAÇÃO DE NOTAS E AVISOS (do primeiro código) ---
    let notes = "";
    if (temp > 90) {
        notes += `<span class="warning">AVISO: Temperaturas acima de 90°C podem exigir graxas especiais de alta performance.</span><br>`;
    }
    if (finalIntervalHours < 100) {
        notes += `<span class="warning">AVISO: O intervalo de lubrificação é muito curto. Considere revisar as condições de operação ou utilizar lubrificação automatizada.</span><br>`;
    }
    if(notes === "") {
        notes = "As condições de operação parecem normais. Siga as recomendações de manutenção."
    }
    
    // --- 5. EXIBIÇÃO DOS RESULTADOS ---
    const resultsDiv = document.getElementById('results');

    // Resultados do primeiro código
    document.getElementById('greaseQuantityResult').innerHTML = `<strong>Quantidade de Graxa por Relubrificação:</strong> ${greaseQuantity.toFixed(2)} gramas.`;
    document.getElementById('lubricationIntervalResult').innerHTML = `<strong>Intervalo Estimado de Relubrificação:</strong> ${finalIntervalHours} horas (aproximadamente ${finalIntervalDays} dias).`;
    document.getElementById('notesResult').innerHTML = `<strong>Notas Adicionais:</strong><br>${notes}`;
    
    // Exibindo os novos resultados do segundo código, mapeados para o HTML
    document.getElementById('initialFill').textContent = initialFill.toFixed(1);
    document.getElementById('relubAmount').textContent = relubAmount.toFixed(1);
    document.getElementById('relubInterval').textContent = Math.round(finalIntervalHours); // Usa o valor calculado anteriormente
    document.getElementById('greaseLife').textContent = Math.round(greaseLife);
    document.getElementById('bearingMass').textContent = bearingMass.toFixed(2);
    document.getElementById('relubIntervalWeeks').textContent = relubIntervalWeeks.toFixed(1);
    document.getElementById('continuousVolume').textContent = continuousVolume_cm3_hr.toFixed(3);
    
    // Exibindo as recomendações de graxa
    document.getElementById('recViscosity').textContent = recViscosity;
    document.getElementById('recThickener').textContent = recThickener;
    document.getElementById('recNLGI').textContent = recNLGI;
    document.getElementById('recAdditives').textContent = recAdditives;

    resultsDiv.style.display = 'block'; // Torna os resultados visíveis
});

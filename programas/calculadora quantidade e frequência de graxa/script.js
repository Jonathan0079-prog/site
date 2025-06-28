document.getElementById('calculate').addEventListener('click', function() {
    // --- 1. COLETA E VALIDAÇÃO DOS DADOS DE ENTRADA ---
    const form = document.getElementById('lubricationForm');
    if (!form.checkValidity()) {
        alert("Por favor, preencha todos os campos antes de calcular.");
        return;
    }

    const bearingType = document.getElementById('bearingType').value;
    const D = parseFloat(document.getElementById('outerDiameter').value);
    const d = parseFloat(document.getElementById('boreDiameter').value);
    const B = parseFloat(document.getElementById('width').value);
    const rpm = parseFloat(document.getElementById('rpm').value);
    const temp = parseFloat(document.getElementById('temperature').value);
    
    const loadCondition = document.getElementById('loadCondition').value;
    const environment = document.getElementById('environment').value;
    const workingHoursPerWeek = parseFloat(document.getElementById('workingHours').value);
    const greaseDensity = parseFloat(document.getElementById('greaseDensity').value);
    
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

    // A. Quantidade de Relubrificação (gramas)
    // A fórmula original está correta para um "charge factor"
    const greaseQuantity = 0.005 * D * B;
    const relubAmount = greaseQuantity;

    // B. Carga de Graxa Inicial (gramas)
    // Geralmente é a quantidade total para preencher o rolamento e o espaço do mancal
    // Você a definiu como 3x a quantidade de relubrificação, o que é um método comum.
    const initialFill = relubAmount * 3;

    // **NOVO CÁLCULO: Volume Inicial de Graxa em cm³**
    // Usamos a mesma lógica de volume do rolamento, mas para o preenchimento inicial.
    // A constante 0.005 já converte as dimensões de mm para cm³ e ajusta para o volume interno.
    // Se initialFill (gramas) representa o total, e a densidade é em kg/dm³ (que é 1g/cm³),
    // então initialFillCm3 = initialFill / greaseDensity;
    // Se initialFill é 3x relubAmount e relubAmount já é 0.005 * D * B,
    // então initialFillCm3 será 3x o volume calculado por 0.005 * D * B (se 0.005 * D * B já fosse em cm³).
    // A forma mais direta para o volume inicial em cm³ é:
    const initialGreaseVolumeCm3 = (initialFill / greaseDensity); // Como greaseDensity é kg/dm³, e 1 kg/dm³ = 1 g/cm³, isso está correto.

    // C. CÁLCULO DO INTERVALO DE RELUBRIFICAÇÃO
    
    // C.1. Intervalo Base em Horas
    let baseInterval = 2000;
    if (bearingType === 'cylindricalRoller' || bearingType === 'taperedRoller') {
        baseInterval = 1500;
    } else if (bearingType === 'sphericalRoller') {
        baseInterval = 1000;
    }

    // C.2. Fatores de Correção
    
    // Fator de Temperatura (kT)
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

    // Fator de Velocidade (kS)
    const dm = (D + d) / 2;
    const nDm = rpm * dm;
    let speedFactor = 1.0;
    if (nDm > 200000) {
        speedFactor = 200000 / nDm;
    } else if (nDm < 10000) {
        speedFactor = 0.8;
    }
    
    // C.3. Cálculo Final do Intervalo em Horas
    let finalIntervalHours = baseInterval * tempFactor * loadFactor * envFactor * speedFactor;

    // Arredondamento e ajuste de mínimo
    finalIntervalHours = Math.round(finalIntervalHours / 10) * 10;
    if(finalIntervalHours < 24) finalIntervalHours = 24;

    const finalIntervalDays = (finalIntervalHours / 24);
    
    // D. Vida da Graxa (L10) para rolamentos vedados
    const greaseLife = finalIntervalHours * 2.7;

    // --- NOVOS CÁLCULOS QUE JÁ TINHAMOS ---
    
    // E. Massa do Rolamento (Fórmula empírica)
    const bearingMass = (D * D - d * d) * B * 6.2e-6;

    // F. Período de Relubrificação em Semanas
    const relubIntervalWeeks = finalIntervalHours / workingHoursPerWeek;

    // G. Volume de Relubrificação Contínua
    const continuousVolume_cm3_hr = (relubAmount / greaseDensity) / finalIntervalHours;

    // --- 3. RECOMENDAÇÃO DE GRAXA ---
    let recViscosity, recThickener, recNLGI, recAdditives;

    // Viscosidade
    if (nDm < 10000) { recViscosity = "460+"; }
    else if (nDm < 75000) { recViscosity = "220-460"; }
    else if (nDm < 200000) { recViscosity = "100-220"; }
    else if (nDm < 400000) { recViscosity = "46-100"; }
    else { recViscosity = "15-46"; }
    if(temp > 80) recViscosity = "Aumentar ↑";

    // Espessante
    if (f_moist < 0.5) { recThickener = "Sulf. de Cálcio"; }
    else if (temp > 120) { recThickener = "Poliureia"; }
    else { recThickener = "Compl. de Lítio"; }
    if (f_vib < 0.6) {recThickener += " (Alta Estabilidade Mecânica)";}

    // NLGI
    if (f_orient < 1.0 || environment === 'dusty' || environment === 'chemical') { recNLGI = "3"; }
    else if (temp < 0) { recNLGI = "1"; }
    else { recNLGI = "2"; }

    // Aditivos
    if (loadCondition === 'heavy' || loadCondition === 'shock') { recAdditives = "EP (Extrema Pressão)"; }
    else { recAdditives = "Padrão (AW/AO)"; }

    // --- 4. GERAÇÃO DE NOTAS E AVISOS ---
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

    // Mapeando os resultados para os IDs corretos do HTML
    document.getElementById('initialFill').textContent = initialFill.toFixed(1);
    // **NOVA LINHA: Exibir Volume Inicial de Graxa em cm³**
    document.getElementById('initialFillCm3').textContent = initialGreaseVolumeCm3.toFixed(2);
    
    document.getElementById('relubAmount').textContent = relubAmount.toFixed(1);
    document.getElementById('relubInterval').textContent = Math.round(finalIntervalHours);
    document.getElementById('lubricationIntervalResult').textContent = finalIntervalDays.toFixed(1) + " dias";
    document.getElementById('relubIntervalWeeks').textContent = relubIntervalWeeks.toFixed(1);
    document.getElementById('greaseLife').textContent = Math.round(greaseLife);
    document.getElementById('continuousVolume').textContent = continuousVolume_cm3_hr.toFixed(3);
    document.getElementById('bearingMass').textContent = bearingMass.toFixed(2);
    
    // Exibindo as recomendações de graxa
    document.getElementById('recViscosity').textContent = recViscosity;
    document.getElementById('recThickener').textContent = recThickener;
    document.getElementById('recNLGI').textContent = recNLGI;
    document.getElementById('recAdditives').textContent = recAdditives;

    // Atualizando as notas
    document.getElementById('notesResult').innerHTML = `<p><strong>Notas Adicionais:</strong></p><p>${notes}</p>`;

    // Torna os resultados visíveis
    resultsDiv.style.display = 'block';
});

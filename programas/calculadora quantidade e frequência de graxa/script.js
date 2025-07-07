// script.js - v3 com Health Bar
document.addEventListener('DOMContentLoaded', () => {
    // --- Referências aos Elementos ---
    const lubricationForm = document.getElementById('lubricationForm');
    const calculateBtn = document.getElementById('calculate');
    const resetBtn = document.getElementById('reset');
    const resultsSection = document.getElementById('results');
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const tooltips = document.querySelectorAll('.tooltip');
    
    // --- Novos Elementos para Health Bar ---
    const healthBar = document.getElementById('healthBar');
    const healthText = document.getElementById('healthText');

    function resetFields() {
        if (lubricationForm) lubricationForm.reset();
        if (resultsSection) resultsSection.classList.add('hidden');
    }

    function calculateLubrication() {
        try {
            // --- 1. COLETA DE DADOS ---
            const data = {
                bearingType: document.getElementById('bearingType').value,
                d: parseFloat(document.getElementById('boreDiameter').value),
                D: parseFloat(document.getElementById('outerDiameter').value),
                B: parseFloat(document.getElementById('width').value),
                n: parseFloat(document.getElementById('rpm').value),
                T: parseFloat(document.getElementById('temperature').value),
                lubeApplication: document.getElementById('lubeApplication').value,
                workingHours: parseFloat(document.getElementById('workingHours').value),
                greaseDensity: parseFloat(document.getElementById('greaseDensity').value),
                loadCondition: document.getElementById('loadCondition').value,
                environment: document.getElementById('environment').value,
                vibrationFactor: parseFloat(document.getElementById('vibration').value),
                moistureFactor: parseFloat(document.getElementById('moisture').value),
                orientationFactor: parseFloat(document.getElementById('orientation').value)
            };

            if (isNaN(data.d) || isNaN(data.D) || isNaN(data.B) || isNaN(data.n)) {
                alert("Por favor, preencha os campos de Dimensões e RPM com valores numéricos.");
                return;
            }

            // --- 2. LÓGICA DE CÁLCULO ---
            const dm = 0.5 * (data.d + data.D);
            const speed_factor = data.n * dm;

            const bearing_type_factors = { 'ball': { k: 1, name: 'Rígido de Esferas' }, 'angular': { k: 1, name: 'Contato Angular' }, 'sphericalRoller': { k: 5, name: 'Autocompensador de Rolos' }, 'taperedRoller': { k: 5, name: 'Rolos Cônicos' }, 'cylindricalRoller': { k: 2, name: 'Rolos Cilíndricos' } };
            const k_bearing = bearing_type_factors[data.bearingType]?.k || 1;

            const lube_k = data.lubeApplication === 'center' ? 0.002 : 0.005;
            const relubAmountGrams = lube_k * data.D * data.B;
            const initialFillGrams = relubAmountGrams * 3;
            const initialFillCm3 = initialFillGrams / data.greaseDensity;

            const temp_factor = Math.pow(2, (70 - data.T) / 15);
            const base_life_hours = Math.min(Math.pow(10, 6) / (2 * speed_factor) - 4 * dm, 87600);
            const greaseLifeHours = base_life_hours * temp_factor;

            const load_factors = { 'normal': 1, 'heavy': 0.5, 'shock': 0.1 };
            const env_factors = { 'clean': 1, 'dusty': 0.5, 'humid': 0.2, 'chemical': 0.1 };
            const correction_factor = load_factors[data.loadCondition] * env_factors[data.environment] * data.vibrationFactor * data.moistureFactor * data.orientationFactor;
            
            // --- CÁLCULO DA SAÚDE DA GRAXA (NOVO) ---
            const healthScore = correction_factor * 100 * temp_factor;
            updateHealthBar(healthScore);

            const theoreticalInterval = (1.4 * Math.pow(10, 7) / (dm * Math.sqrt(data.n)) - 4 * data.d) * k_bearing * correction_factor;
            const safetyInterval = greaseLifeHours * 0.5;

            let finalIntervalHours;
            let intervalNote = "";
            if (theoreticalInterval <= safetyInterval) {
                finalIntervalHours = theoreticalInterval;
                intervalNote = "O intervalo foi calculado com base nas condições operacionais e fatores de correção.";
            } else {
                finalIntervalHours = safetyInterval;
                intervalNote = `<strong>Atenção:</strong> O intervalo foi limitado a 50% da vida útil estimada da graxa (${Math.round(greaseLifeHours).toLocaleString('pt-BR')} horas) para garantir a segurança, pois a temperatura de operação é um fator crítico.`;
            }

            const relubIntervalDays = finalIntervalHours / 24;
            const relubIntervalWeeks = data.workingHours > 0 ? finalIntervalHours / data.workingHours : 0;
            const bearingMassKg = (Math.PI / 4) * (Math.pow(data.D, 2) - Math.pow(data.d, 2)) * data.B * 7.85 / 1000000;

            // --- 3. RECOMENDAÇÕES E NOTAS ---
            let recViscosity, recThickener, recNLGI, recAdditives;
            if (speed_factor < 100000) recViscosity = "ISO VG 220-460"; else if (speed_factor < 400000) recViscosity = "ISO VG 100-220"; else recViscosity = "ISO VG 32-100";
            if (data.environment === "humid" || data.moistureFactor < 1.0) recThickener = "Sulf. Cálcio, Cplx. Alumínio"; else if (data.T > 120) recThickener = "Poliureia, Cplx. Bário"; else recThickener = "Lítio, Cplx. Lítio";
            if (data.n < 300) recNLGI = "NLGI 1-2"; else recNLGI = "NLGI 2-3";
            if (data.loadCondition === "shock") recAdditives = "EP (Extrema Pressão)"; else if (data.environment === "humid") recAdditives = "Inibidores de Corrosão"; else recAdditives = "Padrão (Antioxidante)";
            
            let fullNotes = `${intervalNote} Para um rolamento ${bearing_type_factors[data.bearingType].name} operando a ${data.n} RPM, a viscosidade se baseia no fator n*dm de ${Math.round(speed_factor).toLocaleString('pt-BR')}.`;

            // --- 4. EXIBIÇÃO DOS RESULTADOS ---
            const updateField = (id, value, unit = '') => document.getElementById(id).innerHTML = `${value} <small>${unit}</small>`;
            updateField('initialFill', initialFillGrams.toFixed(2), 'g');
            updateField('initialFillCm3', initialFillCm3.toFixed(2), 'cm³');
            updateField('relubAmount', relubAmountGrams.toFixed(2), 'g');
            updateField('greaseLife', Math.round(greaseLifeHours).toLocaleString('pt-BR'), 'horas');
            updateField('relubIntervalHours', Math.round(finalIntervalHours).toLocaleString('pt-BR'), 'horas');
            updateField('relubIntervalDays', relubIntervalDays.toFixed(1), 'dias');
            updateField('relubIntervalWeeks', relubIntervalWeeks.toFixed(1), 'semanas');
            updateField('bearingMass', bearingMassKg.toFixed(3), 'kg');
            
            document.getElementById('recViscosity').textContent = recViscosity;
            document.getElementById('recThickener').textContent = recThickener;
            document.getElementById('recNLGI').textContent = recNLGI;
            document.getElementById('recAdditives').textContent = recAdditives;
            document.getElementById('notesText').innerHTML = fullNotes;
            
            resultsSection.classList.remove('hidden');

        } catch (error) {
            alert(`Ocorreu um erro durante o cálculo:
${error.message}`);
        }
    }

    // --- FUNÇÃO PARA ATUALIZAR A BARRA DE SAÚDE (NOVA) ---
    function updateHealthBar(score) {
        const percentage = Math.max(0, Math.min(100, score)); // Garante que o score fique entre 0 e 100
        healthBar.style.width = `${percentage}%`;
        healthBar.textContent = `${Math.round(percentage)}%`;
        
        healthBar.classList.remove('good', 'warning', 'danger');
        
        if (percentage > 75) {
            healthBar.classList.add('good');
            healthText.textContent = "Condições ideais. A graxa terá a máxima vida útil possível.";
        } else if (percentage > 40) {
            healthBar.classList.add('warning');
            healthText.textContent = "Condições moderadas. Fatores como carga e contaminação estão reduzindo a vida útil da graxa.";
        } else {
            healthBar.classList.add('danger');
            healthText.textContent = "Condições severas! A vida da graxa é drasticamente reduzida. Reavalie a lubrificação e o ambiente.";
        }
    }
    
    // --- Event Listeners ---
    if (calculateBtn) calculateBtn.addEventListener('click', calculateLubrication);
    if (resetBtn) resetBtn.addEventListener('click', resetFields);
    
    if (tooltips) {
        tooltips.forEach(tooltip => {
            tooltip.addEventListener('click', (event) => {
                event.stopPropagation();
                const isActive = tooltip.classList.contains('active');
                document.querySelectorAll('.tooltip.active').forEach(t => t.classList.remove('active'));
                if (!isActive) tooltip.classList.add('active');
            });
        });
        document.addEventListener('click', () => tooltips.forEach(t => t.classList.remove('active')));
    }

    window.addEventListener('scroll', () => {
        if (scrollTopBtn) scrollTopBtn.classList.toggle('hidden', window.scrollY <= 200);
    });
    if (scrollTopBtn) scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});

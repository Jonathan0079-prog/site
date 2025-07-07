// script.js - Versão 100% Offline
document.addEventListener('DOMContentLoaded', () => {
    // --- Referências aos elementos principais da página ---
    const lubricationForm = document.getElementById('lubricationForm');
    const calculateBtn = document.getElementById('calculate');
    const resetBtn = document.getElementById('reset');
    const resultsSection = document.getElementById('results');
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const tooltips = document.querySelectorAll('.tooltip');

    // --- Função para Limpar o Formulário e Esconder Resultados ---
    function resetFields() {
        if (lubricationForm) lubricationForm.reset();
        if (resultsSection) resultsSection.classList.add('hidden');
    }

    // --- Função Principal para Calcular (Agora 100% Local) ---
    function calculateLubrication() {
        try {
            // --- 1. COLETA DE DADOS DO FORMULÁRIO ---
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

            // --- 2. LÓGICA DE CÁLCULO (TRADUZIDA DO PYTHON) ---
            const dm = 0.5 * (data.d + data.D);
            const speed_factor = data.n * dm;

            const bearing_type_factors = {
                'ball': { 'k': 1, 'name': 'Rígido de Esferas' },
                'angular': { 'k': 1, 'name': 'Contato Angular' },
                'sphericalRoller': { 'k': 5, 'name': 'Autocompensador de Rolos' },
                'taperedRoller': { 'k': 5, 'name': 'Rolos Cônicos' },
                'cylindricalRoller': { 'k': 2, 'name': 'Rolos Cilíndricos' }
            };
            const k_bearing = bearing_type_factors[data.bearingType]?.k || 1;

            const lube_k_map = { 'side': 0.005, 'center': 0.002 };
            const lube_k = lube_k_map[data.lubeApplication] || 0.005;

            const relubAmountGrams = lube_k * data.D * data.B;
            const initialFillGrams = relubAmountGrams * 3;
            const initialFillCm3 = initialFillGrams / data.greaseDensity;

            const base_life = Math.pow(10, 6) / (2 * speed_factor) - 4 * dm;
            const capped_base_life = Math.min(base_life, 87600); // Limita a 10 anos

            const temp_factor = Math.pow(2, (70 - data.T) / 15);
            const greaseLifeHours = capped_base_life * temp_factor;

            const load_factors = { 'normal': 1, 'heavy': 0.5, 'shock': 0.1 };
            const env_factors = { 'clean': 1, 'dusty': 0.5, 'humid': 0.2, 'chemical': 0.1 };

            const correction_factor = load_factors[data.loadCondition] * env_factors[data.environment] * data.vibrationFactor * data.moistureFactor * data.orientationFactor;
            const relubIntervalHours = (1.4 * Math.pow(10, 7) / (dm * Math.sqrt(data.n)) - 4 * data.d) * k_bearing * correction_factor;

            const relubIntervalDays = relubIntervalHours / 24;
            const relubIntervalWeeks = data.workingHours > 0 ? relubIntervalHours / data.workingHours : 0;

            const bearingMassKg = (Math.PI / 4) * (Math.pow(data.D, 2) - Math.pow(data.d, 2)) * data.B * 7.85 / 1000000;

            let recViscosity, recThickener, recNLGI, recAdditives, recNotes;

            if (speed_factor < 100000) recViscosity = "ISO VG 220-460";
            else if (speed_factor < 400000) recViscosity = "ISO VG 100-220";
            else recViscosity = "ISO VG 32-100";

            if (data.environment === "humid") recThickener = "Sulf. Cálcio, Cplx. Alumínio";
            else if (data.T > 120) recThickener = "Poliureia, Cplx. Bário";
            else recThickener = "Lítio, Cplx. Lítio";

            if (data.n < 300) recNLGI = "NLGI 1-2";
            else recNLGI = "NLGI 2-3";

            if (data.loadCondition === "shock") recAdditives = "EP (Extrema Pressão)";
            else if (data.environment === "humid") recAdditives = "Inibidores de Corrosão";
            else recAdditives = "Nenhum específico";

            recNotes = `Para um rolamento ${bearing_type_factors[data.bearingType].name} operando a ${data.n} RPM, a viscosidade recomendada se baseia no fator de velocidade n*dm de ${Math.round(speed_factor)}.`;
            if (data.loadCondition === "shock") recNotes += " Aditivos EP são cruciais para proteger contra cargas de choque.";
            if (data.environment === "humid") recNotes += " A resistência à água é um fator crítico; considere graxas com boa performance neste quesito.";

            // --- 3. EXIBIÇÃO DOS RESULTADOS ---
            const updateField = (id, value) => {
                const element = document.getElementById(id);
                if (element) element.innerHTML = value;
            };

            updateField('initialFill', `${initialFillGrams.toFixed(2)} <small>g</small>`);
            updateField('initialFillCm3', `${initialFillCm3.toFixed(2)} <small>cm³</small>`);
            updateField('relubAmount', `${relubAmountGrams.toFixed(2)} <small>g</small>`);
            updateField('greaseLife', `${Math.round(greaseLifeHours)} <small>horas</small>`);
            updateField('relubIntervalHours', `${Math.round(relubIntervalHours)} <small>horas</small>`);
            updateField('relubIntervalDays', `${relubIntervalDays.toFixed(1)} <small>dias</small>`);
            updateField('relubIntervalWeeks', `${relubIntervalWeeks.toFixed(1)} <small>semanas</small>`);
            updateField('bearingMass', `${bearingMassKg.toFixed(3)} <small>kg</small>`);
            
            updateField('recViscosity', recViscosity);
            updateField('recThickener', recThickener);
            updateField('recNLGI', recNLGI);
            updateField('recAdditives', recAdditives);
            updateField('notesText', recNotes);

            resultsSection.classList.remove('hidden');

        } catch (error) {
            alert(`Ocorreu um erro durante o cálculo:\n${error.message}`);
        }
    }
    
    // --- Atribuição de Eventos ---
    if (calculateBtn) calculateBtn.addEventListener('click', calculateLubrication);
    if (resetBtn) resetBtn.addEventListener('click', resetFields);
    
    // --- Lógica para Tooltips ---
    if (tooltips) {
        tooltips.forEach(tooltip => {
            tooltip.addEventListener('click', (event) => {
                event.stopPropagation();
                const isActive = tooltip.classList.contains('active');
                tooltips.forEach(t => t.classList.remove('active'));
                if (!isActive) tooltip.classList.add('active');
            });
        });
        document.addEventListener('click', () => {
            tooltips.forEach(tooltip => tooltip.classList.remove('active'));
        });
    }

    // --- Lógica de Interface Auxiliar ---
    window.addEventListener('scroll', () => {
        if (scrollTopBtn) {
            if (window.scrollY > 200) scrollTopBtn.classList.remove('hidden');
            else scrollTopBtn.classList.add('hidden');
        }
    });
    if (scrollTopBtn) scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
});

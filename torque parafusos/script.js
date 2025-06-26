document.addEventListener('DOMContentLoaded', () => {

    // --- BASE DE DADOS DE TORQUE EXPANDIDA ---
    // NOTA: Estes valores são baseados em tabelas de engenharia padrão para parafusos limpos e roscas novas.
    // Para aplicações críticas, SEMPRE consulte o manual técnico oficial do seu equipamento ou projeto.
    //
    // torque_nm_seco: Torque em Newton-metro para rosca seca, sem lubrificação.
    // fator_lub: Fator de multiplicação para rosca lubrificada (geralmente entre 0.75 e 0.85).
    const dadosTorque = {
        metrico: [
            // Classe 8.8
            { tamanho: 'M4', classe: '8.8', torque_nm_seco: 3, fator_lub: 0.8 },
            { tamanho: 'M5', classe: '8.8', torque_nm_seco: 6, fator_lub: 0.8 },
            { tamanho: 'M6', classe: '8.8', torque_nm_seco: 10, fator_lub: 0.8 },
            { tamanho: 'M8', classe: '8.8', torque_nm_seco: 25, fator_lub: 0.8 },
            { tamanho: 'M10', classe: '8.8', torque_nm_seco: 50, fator_lub: 0.8 },
            { tamanho: 'M12', classe: '8.8', torque_nm_seco: 85, fator_lub: 0.8 },
            { tamanho: 'M14', classe: '8.8', torque_nm_seco: 140, fator_lub: 0.8 },
            { tamanho: 'M16', classe: '8.8', torque_nm_seco: 210, fator_lub: 0.8 },
            { tamanho: 'M18', classe: '8.8', torque_nm_seco: 290, fator_lub: 0.8 },
            { tamanho: 'M20', classe: '8.8', torque_nm_seco: 410, fator_lub: 0.8 },
            { tamanho: 'M22', classe: '8.8', torque_nm_seco: 550, fator_lub: 0.8 },
            { tamanho: 'M24', classe: '8.8', torque_nm_seco: 710, fator_lub: 0.8 },
            { tamanho: 'M27', classe: '8.8', torque_nm_seco: 1150, fator_lub: 0.8 },
            { tamanho: 'M30', classe: '8.8', torque_nm_seco: 1550, fator_lub: 0.8 },
            { tamanho: 'M33', classe: '8.8', torque_nm_seco: 2100, fator_lub: 0.8 },
            { tamanho: 'M36', classe: '8.8', torque_nm_seco: 2750, fator_lub: 0.8 },
            // Classe 10.9
            { tamanho: 'M4', classe: '10.9', torque_nm_seco: 4.5, fator_lub: 0.8 },
            { tamanho: 'M5', classe: '10.9', torque_nm_seco: 9, fator_lub: 0.8 },
            { tamanho: 'M6', classe: '10.9', torque_nm_seco: 15, fator_lub: 0.8 },
            { tamanho: 'M8', classe: '10.9', torque_nm_seco: 35, fator_lub: 0.8 },
            { tamanho: 'M10', classe: '10.9', torque_nm_seco: 70, fator_lub: 0.8 },
            { tamanho: 'M12', classe: '10.9', torque_nm_seco: 120, fator_lub: 0.8 },
            { tamanho: 'M14', classe: '10.9', torque_nm_seco: 190, fator_lub: 0.8 },
            { tamanho: 'M16', classe: '10.9', torque_nm_seco: 300, fator_lub: 0.8 },
            { tamanho: 'M18', classe: '10.9', torque_nm_seco: 425, fator_lub: 0.8 },
            { tamanho: 'M20', classe: '10.9', torque_nm_seco: 600, fator_lub: 0.8 },
            { tamanho: 'M22', classe: '10.9', torque_nm_seco: 800, fator_lub: 0.8 },
            { tamanho: 'M24', classe: '10.9', torque_nm_seco: 1050, fator_lub: 0.8 },
            { tamanho: 'M27', classe: '10.9', torque_nm_seco: 1600, fator_lub: 0.8 },
            { tamanho: 'M30', classe: '10.9', torque_nm_seco: 2200, fator_lub: 0.8 },
            { tamanho: 'M33', classe: '10.9', torque_nm_seco: 3000, fator_lub: 0.8 },
            { tamanho: 'M36', classe: '10.9', torque_nm_seco: 3800, fator_lub: 0.8 },
        ],
        polegadas: [
            // Grau 5 (UNC Threads)
            { tamanho: '1/4"', classe: 'Grau 5', torque_nm_seco: 12, fator_lub: 0.75 },
            { tamanho: '5/16"', classe: 'Grau 5', torque_nm_seco: 25, fator_lub: 0.75 },
            { tamanho: '3/8"', classe: 'Grau 5', torque_nm_seco: 45, fator_lub: 0.75 },
            { tamanho: '7/16"', classe: 'Grau 5', torque_nm_seco: 70, fator_lub: 0.75 },
            { tamanho: '1/2"', classe: 'Grau 5', torque_nm_seco: 100, fator_lub: 0.75 },
            { tamanho: '9/16"', classe: 'Grau 5', torque_nm_seco: 150, fator_lub: 0.75 },
            { tamanho: '5/8"', classe: 'Grau 5', torque_nm_seco: 210, fator_lub: 0.75 },
            { tamanho: '3/4"', classe: 'Grau 5', torque_nm_seco: 370, fator_lub: 0.75 },
            { tamanho: '7/8"', classe: 'Grau 5', torque_nm_seco: 590, fator_lub: 0.75 },
            { tamanho: '1"', classe: 'Grau 5', torque_nm_seco: 880, fator_lub: 0.75 },
            { tamanho: '1 1/8"', classe: 'Grau 5', torque_nm_seco: 1250, fator_lub: 0.75 },
            { tamanho: '1 1/4"', classe: 'Grau 5', torque_nm_seco: 1750, fator_lub: 0.75 },
            { tamanho: '1 1/2"', classe: 'Grau 5', torque_nm_seco: 3000, fator_lub: 0.75 },
            // Grau 8 (UNC Threads)
            { tamanho: '1/4"', classe: 'Grau 8', torque_nm_seco: 17, fator_lub: 0.75 },
            { tamanho: '5/16"', classe: 'Grau 8', torque_nm_seco: 35, fator_lub: 0.75 },
            { tamanho: '3/8"', classe: 'Grau 8', torque_nm_seco: 60, fator_lub: 0.75 },
            { tamanho: '7/16"', classe: 'Grau 8', torque_nm_seco: 100, fator_lub: 0.75 },
            { tamanho: '1/2"', classe: 'Grau 8', torque_nm_seco: 150, fator_lub: 0.75 },
            { tamanho: '9/16"', classe: 'Grau 8', torque_nm_seco: 210, fator_lub: 0.75 },
            { tamanho: '5/8"', classe: 'Grau 8', torque_nm_seco: 300, fator_lub: 0.75 },
            { tamanho: '3/4"', classe: 'Grau 8', torque_nm_seco: 520, fator_lub: 0.75 },
            { tamanho: '7/8"', classe: 'Grau 8', torque_nm_seco: 840, fator_lub: 0.75 },
            { tamanho: '1"', classe: 'Grau 8', torque_nm_seco: 1250, fator_lub: 0.75 },
            { tamanho: '1 1/8"', classe: 'Grau 8', torque_nm_seco: 1800, fator_lub: 0.75 },
            { tamanho: '1 1/4"', classe: 'Grau 8', torque_nm_seco: 2500, fator_lub: 0.75 },
            { tamanho: '1 1/2"', classe: 'Grau 8', torque_nm_seco: 4300, fator_lub: 0.75 },
        ]
    };

    // --- ELEMENTOS DO DOM ---
    const sistemaRadios = document.querySelectorAll('input[name="sistema"]');
    const tamanhoSelect = document.getElementById('tamanho-parafuso');
    const classeSelect = document.getElementById('classe-parafuso');
    const calcularBtn = document.getElementById('calcular-btn');
    const resultadoContainer = document.getElementById('resultado-container');
    const erroContainer = document.getElementById('erro-container');
    const torqueNmEl = document.getElementById('torque-resultado-nm');
    const torqueLbfEl = document.getElementById('torque-resultado-lbf');

    // --- FUNÇÕES ---
    function atualizarOpcoes() {
        const sistemaSelecionado = document.querySelector('input[name="sistema"]:checked').value;
        const dados = dadosTorque[sistemaSelecionado];
        
        // Limpa selects anteriores
        tamanhoSelect.innerHTML = '';
        classeSelect.innerHTML = '';
        
        // Cria lista de tamanhos únicos
        const tamanhos = [...new Set(dados.map(item => item.tamanho))];
        
        // Preenche o select de tamanhos
        tamanhos.forEach(tamanho => {
            const option = document.createElement('option');
            option.value = tamanho;
            option.textContent = tamanho;
            tamanhoSelect.appendChild(option);
        });

        atualizarClasses();
        // Esconde resultado ao mudar de sistema
        resultadoContainer.classList.add('hidden');
        erroContainer.classList.add('hidden');
    }

    function atualizarClasses() {
        const sistemaSelecionado = document.querySelector('input[name="sistema"]:checked').value;
        const tamanhoSelecionado = tamanhoSelect.value;
        
        // Filtra para pegar apenas as classes do tamanho selecionado
        const classes = dadosTorque[sistemaSelecionado]
            .filter(item => item.tamanho === tamanhoSelecionado)
            .map(item => item.classe);

        classeSelect.innerHTML = '';
        classes.forEach(classe => {
            const option = document.createElement('option');
            option.value = classe;
            option.textContent = classe;
            classeSelect.appendChild(option);
        });
         // Esconde resultado ao mudar de classe
        resultadoContainer.classList.add('hidden');
        erroContainer.classList.add('hidden');
    }

    function calcularTorque() {
        const sistema = document.querySelector('input[name="sistema"]:checked').value;
        const tamanho = tamanhoSelect.value;
        const classe = classeSelect.value;
        const condicao = document.querySelector('input[name="condicao"]:checked').value;

        // Encontra o parafuso na base de dados
        const parafuso = dadosTorque[sistema].find(p => p.tamanho === tamanho && p.classe === classe);

        if (!parafuso) {
            erroContainer.classList.remove('hidden');
            resultadoContainer.classList.add('hidden');
            return;
        }

        let torqueNm = parafuso.torque_nm_seco;
        if (condicao === 'lubrificada') {
            torqueNm *= parafuso.fator_lub;
        }

        // Converte N·m para lb·ft (1 N·m ≈ 0.73756 lb·ft)
        const torqueLbf = torqueNm * 0.73756;

        // Exibe os resultados
        torqueNmEl.textContent = torqueNm.toFixed(0);
        torqueLbfEl.textContent = torqueLbf.toFixed(0);
        
        erroContainer.classList.add('hidden');
        resultadoContainer.classList.remove('hidden');
    }


    // --- EVENT LISTENERS ---
    sistemaRadios.forEach(radio => radio.addEventListener('change', atualizarOpcoes));
    tamanhoSelect.addEventListener('change', atualizarClasses);

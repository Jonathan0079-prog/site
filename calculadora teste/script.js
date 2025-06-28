// JAVASCRIPT - LÓGICA DE CÁLCULO
        function calculateLubrication() {
            // --- 1. COLETA DE DADOS DO FORMULÁRIO ---
            const form = document.getElementById('lubricationForm');
            if (!form.checkValidity()) {
                alert("Por favor, preencha todos os campos antes de calcular.");
                return;
            }

            const bearingType = document.getElementById('bearingType').value;
            const D = parseFloat(document.getElementById('outerDiameter').value); // Diâmetro Externo
            const d = parseFloat(document.getElementById('boreDiameter').value); // Diâmetro do Furo
            const B = parseFloat(document.getElementById('width').value);       // Largura
            const rpm = parseFloat(document.getElementById('rpm').value);
            const temp = parseFloat(document.getElementById('temperature').value);
            const load = document.getElementById('loadCondition').value;
            const environment = document.getElementById('environment').value;
            
            // --- 2. CÁLCULO DA QUANTIDADE DE GRAXA ---
            // Fórmula padrão: G = 0.005 * D * B
            const greaseQuantity = 0.005 * D * B;

            // --- 3. CÁLCULO DO INTERVALO DE RELUBRIFICAÇÃO (LÓGICA COMPLEXA) ---
            
            // 3.1. Intervalo Base em Horas (Valores típicos para condições ideais)
            let baseInterval = 2000; // Padrão para rolamento de esferas
            if (bearingType === 'cylindricalRoller' || bearingType === 'taperedRoller') {
                baseInterval = 1500;
            } else if (bearingType === 'sphericalRoller') {
                baseInterval = 1000;
            }

            // 3.2. Fatores de Correção
            
            // Fator de Temperatura (kT): Reduz o intervalo pela metade a cada 15°C acima de 70°C
            let tempFactor = 1.0;
            if (temp > 70) {
                const tempDiff = temp - 70;
                tempFactor = Math.pow(0.5, tempDiff / 15);
            }

            // Fator de Carga (kL)
            let loadFactor = 1.0;
            if (load === 'heavy') {
                loadFactor = 0.6;
            } else if (load === 'shock') {
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
            // Lógica simplificada: velocidades muito altas ou muito baixas podem reduzir o intervalo.
            // Esta é uma aproximação. Gráficos de fabricantes são mais precisos.
            if (nDm > 200000) {
                speedFactor = 200000 / nDm;
            } else if (nDm < 10000) {
                speedFactor = 0.8;
            }


            // 3.3. Cálculo Final do Intervalo
            let finalIntervalHours = baseInterval * tempFactor * loadFactor * envFactor * speedFactor;

            // Arredondamento para valor razoável
            finalIntervalHours = Math.round(finalIntervalHours / 10) * 10;
            if(finalIntervalHours < 24) finalIntervalHours = 24; // Mínimo de 1 dia

            const finalIntervalDays = (finalIntervalHours / 24).toFixed(1);

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
            document.getElementById('greaseQuantityResult').innerHTML = `<strong>Quantidade de Graxa por Relubrificação:</strong> ${greaseQuantity.toFixed(2)} gramas.`;
            document.getElementById('lubricationIntervalResult').innerHTML = `<strong>Intervalo Estimado de Relubrificação:</strong> ${finalIntervalHours} horas (aproximadamente ${finalIntervalDays} dias).`;
            document.getElementById('notesResult').innerHTML = `<strong>Notas Adicionais:</strong><br>${notes}`;
            
            resultsDiv.style.display = 'block'; // Torna os resultados visíveis
        }

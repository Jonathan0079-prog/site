<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SGL - Buscador de Equivalentes</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>Sistema de Gestão de Lubrificação</h1>
        <nav class="main-nav">
            <a href="index.html" class="nav-link active">Buscador</a>
            <a href="calculadora.html" class="nav-link">Calculadora</a>
            <a href="plano.html" class="nav-link">Plano de Lubrificação</a>
        </nav>
    </header>

    <div class="container">
        <main>
            <div class="search-box">
                <h2>Buscador de Equivalentes</h2>
                <div class="input-group">
                    <label for="marca-select">Marca:</label>
                    <select id="marca-select">
                        <option value="">-- Selecione a Marca --</option>
                    </select>
                </div>
                <div class="input-group">
                    <label for="oleo-select">Nome do Produto:</label>
                    <select id="oleo-select" disabled>
                        <option value="">-- Primeiro selecione uma marca --</option>
                    </select>
                </div>
                <button id="search-button">Encontrar Equivalentes</button>
            </div>
            <div id="results-container"></div>

            <section class="knowledge-base-section">
                <h2>Base de Conhecimento Técnico</h2>
                <div class="accordion">
                    <div class="accordion-item">
                        <button class="accordion-header">
                            O que é Viscosidade (ISO VG)?
                            <i class="fas fa-chevron-down"></i>
                        </button>
                        <div class="accordion-content">
                            <p>A viscosidade é a propriedade mais importante de um lubrificante. Ela mede a resistência do fluido ao escoamento. Em termos simples, é a "grossura" do óleo.</p>
                            <ul>
                                <li><strong>Óleos de baixa viscosidade (finos):</strong> Escoam facilmente (ex: água). São ideais para altas velocidades e baixas cargas.</li>
                                <li><strong>Óleos de alta viscosidade (grossos):</strong> Escoam lentamente (ex: mel). São necessários para baixas velocidades e altas cargas, onde precisam suportar mais pressão.</li>
                            </ul>
                            <p>O <strong>ISO VG (International Standards Organization Viscosity Grade)</strong> é um sistema de classificação que define a viscosidade cinemática de um óleo industrial a 40°C. Um óleo "ISO VG 46" tem uma viscosidade de 46 centistokes (cSt) a 40°C, com uma tolerância de ±10%. Escolher o ISO VG correto, conforme a recomendação do fabricante e as condições de operação, é crucial para a proteção e eficiência do equipamento.</p>
                        </div>
                    </div>
                    <div class="accordion-item">
                        <button class="accordion-header">
                            Tipos de Óleo Base: Mineral vs. Sintético
                            <i class="fas fa-chevron-down"></i>
                        </button>
                        <div class="accordion-content">
                            <p>O óleo base compõe a maior parte do lubrificante e determina suas características fundamentais.</p>
                            <p><strong>Óleo Mineral:</strong> Derivado do petróleo bruto, é o tipo mais comum e económico. É excelente para uma vasta gama de aplicações industriais padrão. No entanto, possui menor resistência a temperaturas extremas e oxidação em comparação com os sintéticos.</p>
                            <p><strong>Óleo Sintético (PAO - Polialfaolefina):</strong> Produzido em laboratório, oferece performance superior. Possui excelente estabilidade térmica, alto índice de viscosidade (varia menos com a temperatura) e maior vida útil. É ideal para condições severas de operação (temperaturas muito altas ou muito baixas). É compatível com óleos minerais.</p>
                            <p><strong>Óleo Sintético (PAG - Polialquileno Glicol):</strong> Outro tipo de sintético com altíssima performance, especialmente em aplicações de engrenagens sem-fim. Possui lubricidade natural superior, mas é <strong>INCOMPATÍVEL</strong> com óleos minerais e PAO. A mistura pode causar a formação de borra e gel, levando a falhas catastróficas. Exige limpeza completa (flushing) do sistema antes da troca.</p>
                        </div>
                    </div>
                    <div class="accordion-item">
                        <button class="accordion-header">
                            A Importância do Flushing (Limpeza do Sistema)
                            <i class="fas fa-chevron-down"></i>
                        </button>
                        <div class="accordion-content">
                            <p>O flushing é o processo de circulação de um fluido de limpeza pelo sistema para remover verniz, borra, contaminantes e resíduos do óleo antigo antes de introduzir o novo lubrificante.</p>
                            <p><strong>Quando o Flushing é OBRIGATÓRIO?</strong></p>
                            <ul>
                                <li><strong>Troca de base incompatível:</strong> Ao mudar de um óleo mineral ou PAO para um óleo PAG (ou vice-versa). Como visto na nossa ferramenta, a mistura é proibida e destrutiva.</li>
                                <li><strong>Alta contaminação:</strong> Quando o óleo antigo está severamente degradado, oxidado ou contaminado com água, partículas ou outros fluidos.</li>
                                <li><strong>Falha de componente:</strong> Após uma falha de bomba, rolamento ou engrenagem, para remover as partículas metálicas geradas.</li>
                            </ul>
                            <p>Ignorar o flushing nestas situações é como tomar banho e vestir a mesma roupa suja. O novo óleo será imediatamente contaminado, a sua vida útil será drasticamente reduzida e o risco de uma nova falha permanece elevado.</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </div>

    <div id="compatibility-modal" class="modal-backdrop hidden">
        <div class="modal-content">
            <button id="modal-close-button" class="modal-close">&times;</button>
            <h3 id="modal-title"></h3>
            <p id="modal-description"></p>
        </div>
    </div>

    <script type="module" src="js/script.js"></script>
</body>
</html>

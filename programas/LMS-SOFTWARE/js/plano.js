// js/plano.js

// O caminho agora sobe um nível (../) para encontrar a pasta 'data'
import { tabelaSimilaridade } from '../data/database.js';

// Usamos o objeto global jsPDF que foi carregado pelos scripts no HTML
const { jsPDF } = window.jspdf;

document.addEventListener('DOMContentLoaded', () => {
    // --- SELEÇÃO DE ELEMENTOS DOM ---
    const equipmentForm = document.getElementById('equipment-form');
    const equipmentOilSelect = document.getElementById('equipment-oil');
    const planTableBody = document.querySelector('#plan-table tbody');
    const generatePdfButton = document.getElementById('generate-pdf-button');
    
    // Carrega os itens do plano do localStorage ou inicializa um array vazio
    let planItems = JSON.parse(localStorage.getItem('planItemsSGL')) || [];

    // --- LÓGICA DO PLANNER ---
    function popularOleosDoPlano() {
        const todosOsOleos = new Set();
        tabelaSimilaridade.forEach(grupo => {
            for (const marca in grupo.PRODUTOS) {
                const oleoId = `${grupo.PRODUTOS[marca].NOME} (${marca})`;
                todosOsOleos.add(oleoId);
            }
        });
        const oleosOrdenados = Array.from(todosOsOleos).sort();
        oleosOrdenados.forEach(oleo => {
            const option = document.createElement('option');
            option.value = oleo;
            option.textContent = oleo;
            equipmentOilSelect.appendChild(option);
        });
    }

    function persistItems() {
        localStorage.setItem('planItemsSGL', JSON.stringify(planItems));
    }

    function adicionarItemAoPlano(event) {
        event.preventDefault();
        const equipmentName = document.getElementById('equipment-name').value;
        const equipmentOil = document.getElementById('equipment-oil').value;
        const changeInterval = parseInt(document.getElementById('change-interval').value);
        const startDateString = document.getElementById('start-date').value;
        
        if (!equipmentName || !equipmentOil || isNaN(changeInterval) || !startDateString) {
            alert('Por favor, preencha todos os campos do plano de lubrificação.');
            return;
        }

        const startDate = new Date(startDateString + 'T00:00:00');
        const hoursPerDay = 8; // Assumimos um turno de 8 horas
        const daysToNextChange = changeInterval / hoursPerDay;
        const nextChangeDate = new Date(startDate);
        nextChangeDate.setDate(startDate.getDate() + Math.round(daysToNextChange));
        
        const newItem = {
            id: Date.now(),
            name: equipmentName,
            oil: equipmentOil,
            nextChange: nextChangeDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
        };
        planItems.push(newItem);
        persistItems();
        renderizarTabelaPlano();
        equipmentForm.reset();
    }

    function removerItemDoPlano(itemId) {
        planItems = planItems.filter(item => item.id !== itemId);
        persistItems();
        renderizarTabelaPlano();
    }

    function renderizarTabelaPlano() {
        planTableBody.innerHTML = '';
        if (planItems.length === 0) {
            planTableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Nenhum equipamento no plano ainda.</td></tr>`;
            return;
        }
        planItems.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.oil}</td>
                <td>${item.nextChange}</td>
                <td>
                    <button class="action-btn" data-id="${item.id}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            `;
            row.querySelector('.action-btn').addEventListener('click', () => removerItemDoPlano(item.id));
            planTableBody.appendChild(row);
        });
    }

    // --- LÓGICA DE GERAÇÃO DE PDF ---
    function generatePDF() {
        if (planItems.length === 0) {
            alert("Não há dados na tabela para gerar um relatório.");
            return;
        }

        const doc = new jsPDF();
        
        doc.setFontSize(18);
        doc.text("Relatório do Plano de Lubrificação", 14, 22);
        doc.setFontSize(11);
        doc.text(`Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}`, 14, 30);
        
        const tableColumn = ["Equipamento / TAG", "Óleo Utilizado", "Próxima Troca Agendada"];
        const tableRows = planItems.map(item => [item.name, item.oil, item.nextChange]);

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 40,
            theme: 'grid',
            headStyles: { fillColor: [0, 51, 102] } 
        });

        const pageCount = doc.internal.getNumberOfPages();
        for(var i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(9);
            doc.text('Sistema de Gestão de Lubrificação (SGL)', 14, doc.internal.pageSize.height - 10);
            doc.text('Página ' + String(i) + ' de ' + String(pageCount), doc.internal.pageSize.width - 40, doc.internal.pageSize.height - 10);
        }

        doc.save(`Plano_de_Lubrificacao_${new Date().toISOString().slice(0,10)}.pdf`);
    }

    // --- EVENT LISTENERS ---
    equipmentForm.addEventListener('submit', adicionarItemAoPlano);
    generatePdfButton.addEventListener('click', generatePDF);

    // --- INICIALIZAÇÃO ---
    popularOleosDoPlano();
    renderizarTabelaPlano();
});

// js/configuracoes.js

document.addEventListener('DOMContentLoaded', () => {
    const exportBtn = document.getElementById('export-data-btn');
    const importBtn = document.getElementById('import-data-btn');
    const importFileInput = document.getElementById('import-file-input');
    const clearBtn = document.getElementById('clear-data-btn');

    const localStorageKeys = [
        'calculadoraVGProjects',
        'planItemsSGL'
        // Adicione aqui outras chaves do localStorage que queira gerir no futuro
    ];

    // --- LÓGICA DE EXPORTAÇÃO ---
    function exportData() {
        const backupData = {};
        localStorageKeys.forEach(key => {
            const data = localStorage.getItem(key);
            if (data) {
                backupData[key] = JSON.parse(data);
            }
        });

        if (Object.keys(backupData).length === 0) {
            alert('Não há dados salvos para exportar.');
            return;
        }

        const jsonString = JSON.stringify(backupData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        const date = new Date().toISOString().slice(0, 10);
        a.download = `sgl_backup_${date}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        alert('Backup exportado com sucesso!');
    }

    // --- LÓGICA DE IMPORTAÇÃO ---
    function triggerImport() {
        importFileInput.value = ""; // Limpa o input para permitir importar o mesmo arquivo novamente
        importFileInput.click();
    }

    function importData(event) {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);
                
                if (confirm('Tem a certeza que deseja importar estes dados? Os dados existentes com o mesmo nome serão sobrepostos.')) {
                    let importedKeysCount = 0;
                    for (const key in importedData) {
                        if (localStorageKeys.includes(key)) {
                            localStorage.setItem(key, JSON.stringify(importedData[key]));
                            importedKeysCount++;
                        }
                    }
                    if (importedKeysCount > 0) {
                        alert('Dados importados com sucesso! Por favor, recarregue as outras páginas para ver as alterações.');
                    } else {
                        alert('O ficheiro de backup não parece conter dados válidos para esta aplicação.');
                    }
                }
            } catch (error) {
                alert('Erro ao ler o ficheiro. Por favor, verifique se é um ficheiro de backup válido.');
                console.error("Erro ao fazer o parse do JSON:", error);
            }
        };
        reader.readAsText(file);
        event.target.value = ""; // Limpa o input após o uso
    }

    // --- LÓGICA DE LIMPEZA ---
    function clearAllData() {
        const confirmationText = "APAGAR TUDO";
        const userInput = prompt(`Esta ação é irreversível e irá apagar todos os dados salvos.\n\nPara confirmar, por favor escreva "${confirmationText}" na caixa abaixo.`);

        if (userInput === confirmationText) {
            localStorageKeys.forEach(key => {
                localStorage.removeItem(key);
            });
            alert('Todos os dados da aplicação foram apagados com sucesso.');
        } else {
            alert('Ação cancelada. Nenhum dado foi apagado.');
        }
    }

    // --- EVENT LISTENERS ---
    if (exportBtn) exportBtn.addEventListener('click', exportData);
    if (importBtn) importBtn.addEventListener('click', triggerImport);
    if (importFileInput) importFileInput.addEventListener('change', importData);
    if (clearBtn) clearBtn.addEventListener('click', clearAllData);
});

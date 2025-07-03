// data/database.js

export const tabelaSimilaridade = [
    // --- ÓLEOS HIDRÁULICOS ---
    {
        "APLICACAO": "SISTEMA HIDRÁULICO",
        "ISO_VG": "46",
        "PRODUTOS": {
            "MOBIL":     { "NOME": "DTE 25", "BASE": "MINERAL", "IV": "98", "PONTO_FULGOR": "224", "PONTO_FLUIDEZ": "-27" },
            "SHELL":     { "NOME": "TELLUS S2 M 46", "BASE": "MINERAL", "IV": "105", "PONTO_FULGOR": "230", "PONTO_FLUIDEZ": "-30" },
            "CASTROL":   { "NOME": "HYSPIN AWS 46", "BASE": "MINERAL", "IV": "102", "PONTO_FULGOR": "228", "PONTO_FLUIDEZ": "-29" },
            "PETROBRAS": { "NOME": "LUBRAX INDUSTRIAL HLP 46", "BASE": "MINERAL", "IV": "97", "PONTO_FULGOR": "220", "PONTO_FLUIDEZ": "-24" }
        }
    },
    {
        "APLICACAO": "SISTEMA HIDRÁULICO",
        "ISO_VG": "68",
        "PRODUTOS": {
            "MOBIL":     { "NOME": "DTE 26", "BASE": "MINERAL", "IV": "98", "PONTO_FULGOR": "236", "PONTO_FLUIDEZ": "-24" },
            "SHELL":     { "NOME": "TELLUS S2 M 68", "BASE": "MINERAL", "IV": "103", "PONTO_FULGOR": "245", "PONTO_FLUIDEZ": "-27" },
            "CASTROL":   { "NOME": "HYSPIN AWS 68", "BASE": "MINERAL", "IV": "101", "PONTO_FULGOR": "240", "PONTO_FLUIDEZ": "-25" }
        }
    },
    // --- ÓLEOS SINTÉTICOS ---
    {
        "APLICACAO": "REDUTORES E ENGRENAGENS (ALTA PERFORMANCE)",
        "ISO_VG": "220",
        "PRODUTOS": {
            "MOBIL": { "NOME": "MOBILGEAR SHC XMP 220", "BASE": "SINTÉTICO (PAO)", "IV": "152", "PONTO_FULGOR": "250", "PONTO_FLUIDEZ": "-48" },
            "SHELL": { "NOME": "OMALA S4 GXV 220", "BASE": "SINTÉTICO (PAO)", "IV": "160", "PONTO_FULGOR": "260", "PONTO_FLUIDEZ": "-45" }
        }
    },
    {
        "APLICACAO": "REDUTORES E ENGRENAGENS (INCOMPATÍVEL COM MINERAL)",
        "ISO_VG": "220",
        "PRODUTOS": {
            "MOBIL": { "NOME": "MOBIL GLYGOYLE 220", "BASE": "SINTÉTICO (PAG)", "IV": "220", "PONTO_FULGOR": "270", "PONTO_FLUIDEZ": "-39" },
            "SHELL": { "NOME": "OMALA S4 WE 220", "BASE": "SINTÉTICO (PAG)", "IV": "235", "PONTO_FULGOR": "285", "PONTO_FLUIDEZ": "-42" }
        }
    }
];

export const matrizCompatibilidade = {
    "MINERAL": {
        "MINERAL": { "status": "OK", "descricao": "Óleos de mesma base (Mineral) são totalmente compatíveis. A mistura é segura, desde que a viscosidade e a aplicação sejam as mesmas." },
        "SINTÉTICO (PAO)": { "status": "CUIDADO", "descricao": "Bases Minerais e Sintéticas (PAO) são geralmente compatíveis, mas a mistura pode afetar o desempenho dos aditivos. Recomenda-se limitar a mistura a no máximo 10% ou realizar um flushing para garantir a performance." },
        "SINTÉTICO (PAG)": { "status": "INCOMPATÍVEL", "descricao": "Mistura PROIBIDA. Óleos Minerais e Sintéticos (PAG) são quimicamente incompatíveis. A mistura resultará em formação de borra, gel, e perda total da capacidade de lubrificação, causando falha catastrófica no equipamento. O flushing completo do sistema é OBRIGATÓRIO." }
    },
    "SINTÉTICO (PAO)": {
        "MINERAL": { "status": "CUIDADO", "descricao": "Bases Sintéticas (PAO) e Minerais são geralmente compatíveis, mas a mistura pode reduzir o desempenho do óleo sintético. Recomenda-se limitar a mistura a no máximo 10% ou realizar um flushing para garantir a performance." },
        "SINTÉTICO (PAO)": { "status": "OK", "descricao": "Óleos de mesma base (Sintético PAO) são totalmente compatíveis. A mistura é segura." },
        "SINTÉTICO (PAG)": { "status": "INCOMPATÍVEL", "descricao": "Mistura PROIBIDA. Óleos Sintéticos (PAO) e (PAG) são quimicamente incompatíveis e não devem ser misturados sob nenhuma circunstância. O flushing completo do sistema é OBRIGATÓRIO." }
    },
    "SINTÉTICO (PAG)": {
        "MINERAL": { "status": "INCOMPATÍVEL", "descricao": "Mistura PROIBIDA. Óleos Sintéticos (PAG) e Minerais são quimicamente incompatíveis. A mistura resultará em formação de borra e gel, causando falha catastrófica no equipamento. O flushing completo do sistema é OBRIGATÓRIO." },
        "SINTÉTICO (PAO)": { "status": "INCOMPATÍVEL", "descricao": "Mistura PROIBIDA. Óleos Sintéticos (PAG) e (PAO) são quimicamente incompatíveis e não devem ser misturados sob nenhuma circunstância. O flushing completo do sistema é OBRIGATÓRIO." },
        "SINTÉTICO (PAG)": { "status": "OK", "descricao": "Óleos de mesma base (Sintético PAG) são totalmente compatíveis. A mistura é segura." }
    }
};

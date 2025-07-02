// data/database.js

// A estrutura agora é mais rica. Cada produto é um objeto com mais detalhes.
export const tabelaSimilaridade = [
    // --- ÓLEOS HIDRÁULICOS ---
    {
        "APLICACAO": "SISTEMA HIDRÁULICO",
        "ISO_VG": "46",
        "PRODUTOS": {
            "MOBIL":     { "NOME": "DTE 25", "BASE": "MINERAL" },
            "SHELL":     { "NOME": "TELLUS S2 M 46", "BASE": "MINERAL" },
            "CASTROL":   { "NOME": "HYSPIN AWS 46", "BASE": "MINERAL" },
            "PETROBRAS": { "NOME": "LUBRAX INDUSTRIAL HLP 46", "BASE": "MINERAL" },
            "TOTAL":     { "NOME": "AZOLLA ZS 46", "BASE": "MINERAL" },
            "IPIRANGA":  { "NOME": "IPITUR AW 46", "BASE": "MINERAL" }
        }
    },
    {
        "APLICACAO": "SISTEMA HIDRÁULICO",
        "ISO_VG": "68",
        "PRODUTOS": {
            "MOBIL":     { "NOME": "DTE 26", "BASE": "MINERAL" },
            "SHELL":     { "NOME": "TELLUS S2 M 68", "BASE": "MINERAL" },
            "CASTROL":   { "NOME": "HYSPIN AWS 68", "BASE": "MINERAL" },
            "PETROBRAS": { "NOME": "LUBRAX INDUSTRIAL HLP 68", "BASE": "MINERAL" }
        }
    },
    // --- ÓLEOS PARA REDUTORES ---
    {
        "APLICACAO": "REDUTORES E ENGRENAGENS",
        "ISO_VG": "220",
        "PRODUTOS": {
            "MOBIL":     { "NOME": "MOBILGEAR 600 XP 220", "BASE": "MINERAL" },
            "SHELL":     { "NOME": "OMALA S2 GX 220", "BASE": "MINERAL" },
            "CASTROL":   { "NOME": "ALPHA SP 220", "BASE": "MINERAL" }
        }
    },
    {
        "APLICACAO": "REDUTORES E ENGRENAGENS",
        "ISO_VG": "320",
        "PRODUTOS": {
            "MOBIL":     { "NOME": "MOBILGEAR 600 XP 320", "BASE": "MINERAL" },
            "SHELL":     { "NOME": "OMALA S2 GX 320", "BASE": "MINERAL" },
            "IPIRANGA":  { "NOME": "IPIGEAR CLP 320", "BASE": "MINERAL" }
        }
    },
    // --- ÓLEOS SINTÉTICOS ---
    {
        "APLICACAO": "REDUTORES E ENGRENAGENS (ALTA PERFORMANCE)",
        "ISO_VG": "220",
        "PRODUTOS": {
            "MOBIL": { "NOME": "MOBILGEAR SHC XMP 220", "BASE": "SINTÉTICO (PAO)" },
            "SHELL": { "NOME": "OMALA S4 GXV 220", "BASE": "SINTÉTICO (PAO)" }
        }
    },
    {
        "APLICACAO": "REDUTORES E ENGRENAGENS (INCOMPATÍVEL COM MINERAL)",
        "ISO_VG": "220",
        "PRODUTOS": {
            "MOBIL": { "NOME": "MOBIL GLYGOYLE 220", "BASE": "SINTÉTICO (PAG)" },
            "SHELL": { "NOME": "OMALA S4 WE 220", "BASE": "SINTÉTICO (PAG)" }
        }
    }
];

// Adicionamos também uma matriz de compatibilidade de bases
export const matrizCompatibilidade = {
    "MINERAL": ["MINERAL", "SINTÉTICO (PAO)"],
    "SINTÉTICO (PAO)": ["MINERAL", "SINTÉTICO (PAO)"],
    "SINTÉTICO (PAG)": ["SINTÉTICO (PAG)"]
    // Adicionar mais bases conforme necessário (ex: Éster, Silicone)
};

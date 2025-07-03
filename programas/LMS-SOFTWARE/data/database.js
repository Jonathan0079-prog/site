// data/database.js

// ATUALIZAÇÃO: Base de dados massivamente expandida e reorganizada com base na "Tabela de Similaridade" fornecida.
export const tabelaSimilaridade = [
  // --- SISTEMAS HIDRÁULICOS E CIRCULATÓRIOS ---
  {
    APLICACAO: "HIDRÁULICO & CIRCULATÓRIO (MINERAL)",
    ISO_VG: "32",
    PRODUTOS: {
      MOBIL: { NOME: "DTE 24", BASE: "MINERAL", IV: "98", PONTO_FULGOR: "220", PONTO_FLUIDEZ: "-27" },
      SHELL: { NOME: "TELLUS S2 M 32", BASE: "MINERAL", IV: "100", PONTO_FULGOR: "225", PONTO_FLUIDEZ: "-30" },
      CASTROL: { NOME: "HYSPIN AWS 32", BASE: "MINERAL", IV: "102", PONTO_FULGOR: "210", PONTO_FLUIDEZ: "-30" },
      PETROBRAS: { NOME: "LUBRAX INDUSTRIAL HLP 32", BASE: "MINERAL", IV: "97", PONTO_FULGOR: "218", PONTO_FLUIDEZ: "-24" },
      TEXACO: { NOME: "RANDO HD 32", BASE: "MINERAL", IV: "100", PONTO_FULGOR: "220", PONTO_FLUIDEZ: "-33" },
      YPF: { NOME: "HIDRAULICO B 32", BASE: "MINERAL", IV: "96", PONTO_FULGOR: "215", PONTO_FLUIDEZ: "-25" },
      TOTAL: { NOME: "AZOLLA ZS 32", BASE: "MINERAL", IV: "100", PONTO_FULGOR: "226", PONTO_FLUIDEZ: "-30" },
      FUCHS: { NOME: "RENOLIN B 10", BASE: "MINERAL", IV: "105", PONTO_FULGOR: "200", PONTO_FLUIDEZ: "-27" },
      PETRONAS: { NOME: "TUTELA HONOR HLP 32", BASE: "MINERAL", IV: "98", PONTO_FULGOR: "210", PONTO_FLUIDEZ: "-24" }
    }
  },
  {
    APLICACAO: "HIDRÁULICO & CIRCULATÓRIO (MINERAL)",
    ISO_VG: "46",
    PRODUTOS: {
      MOBIL: { NOME: "DTE 25", BASE: "MINERAL", IV: "98", PONTO_FULGOR: "224", PONTO_FLUIDEZ: "-27" },
      SHELL: { NOME: "TELLUS S2 M 46", BASE: "MINERAL", IV: "105", PONTO_FULGOR: "230", PONTO_FLUIDEZ: "-30" },
      CASTROL: { NOME: "HYSPIN AWS 46", BASE: "MINERAL", IV: "102", PONTO_FULGOR: "228", PONTO_FLUIDEZ: "-29" },
      PETROBRAS: { NOME: "LUBRAX INDUSTRIAL HLP 46", BASE: "MINERAL", IV: "97", PONTO_FULGOR: "220", PONTO_FLUIDEZ: "-24" },
      TEXACO: { NOME: "RANDO HD 46", BASE: "MINERAL", IV: "100", PONTO_FULGOR: "226", PONTO_FLUIDEZ: "-33" },
      YPF: { NOME: "HIDRAULICO B 46", BASE: "MINERAL", IV: "96", PONTO_FULGOR: "222", PONTO_FLUIDEZ: "-25" },
      TOTAL: { NOME: "AZOLLA ZS 46", BASE: "MINERAL", IV: "100", PONTO_FULGOR: "232", PONTO_FLUIDEZ: "-30" },
      FUCHS: { NOME: "RENOLIN B 15", BASE: "MINERAL", IV: "105", PONTO_FULGOR: "210", PONTO_FLUIDEZ: "-24" },
      PETRONAS: { NOME: "TUTELA HONOR HLP 46", BASE: "MINERAL", IV: "98", PONTO_FULGOR: "220", PONTO_FLUIDEZ: "-24" }
    }
  },
  {
    APLICACAO: "HIDRÁULICO & CIRCULATÓRIO (MINERAL)",
    ISO_VG: "68",
    PRODUTOS: {
      MOBIL: { NOME: "DTE 26", BASE: "MINERAL", IV: "98", PONTO_FULGOR: "236", PONTO_FLUIDEZ: "-24" },
      SHELL: { NOME: "TELLUS S2 M 68", BASE: "MINERAL", IV: "103", PONTO_FULGOR: "245", PONTO_FLUIDEZ: "-27" },
      CASTROL: { NOME: "HYSPIN AWS 68", BASE: "MINERAL", IV: "101", PONTO_FULGOR: "240", PONTO_FLUIDEZ: "-25" },
      PETROBRAS: { NOME: "LUBRAX INDUSTRIAL HLP 68", BASE: "MINERAL", IV: "97", PONTO_FULGOR: "230", PONTO_FLUIDEZ: "-21" },
      TEXACO: { NOME: "RANDO HD 68", BASE: "MINERAL", IV: "99", PONTO_FULGOR: "242", PONTO_FLUIDEZ: "-30" },
      YPF: { NOME: "HIDRAULICO B 68", BASE: "MINERAL", IV: "95", PONTO_FULGOR: "238", PONTO_FLUIDEZ: "-23" },
      TOTAL: { NOME: "AZOLLA ZS 68", BASE: "MINERAL", IV: "98", PONTO_FULGOR: "244", PONTO_FLUIDEZ: "-27" },
      FUCHS: { NOME: "RENOLIN B 20", BASE: "MINERAL", IV: "100", PONTO_FULGOR: "240", PONTO_FLUIDEZ: "-21" },
      PETRONAS: { NOME: "TUTELA HONOR HLP 68", BASE: "MINERAL", IV: "98", PONTO_FULGOR: "230", PONTO_FLUIDEZ: "-21" }
    }
  },
  
  // --- REDUTORES E ENGRENAGENS ---
  {
    APLICACAO: "REDUTORES E ENGRENAGENS (MINERAL)",
    ISO_VG: "150",
    PRODUTOS: {
        MOBIL: { NOME: "MOBILGEAR 600 XP 150", BASE: "MINERAL", IV: "97", PONTO_FULGOR: "230", PONTO_FLUIDEZ: "-24" },
        SHELL: { NOME: "OMALA S2 GX 150", BASE: "MINERAL", IV: "97", PONTO_FULGOR: "240", PONTO_FLUIDEZ: "-21" },
        CASTROL: { NOME: "ALPHA SP 150", BASE: "MINERAL", IV: "95", PONTO_FULGOR: "230", PONTO_FLUIDEZ: "-24" },
        PETROBRAS: { NOME: "LUBRAX INDUSTRIAL CLP 150", BASE: "MINERAL", IV: "95", PONTO_FULGOR: "232", PONTO_FLUIDEZ: "-18" },
        TEXACO: { NOME: "MEROPA 150", BASE: "MINERAL", IV: "96", PONTO_FULGOR: "240", PONTO_FLUIDEZ: "-24" },
        TOTAL: { NOME: "CARTER EP 150", BASE: "MINERAL", IV: "95", PONTO_FULGOR: "248", PONTO_FLUIDEZ: "-27" },
        FUCHS: { NOME: "RENOLIN CLP 150", BASE: "MINERAL", IV: "96", PONTO_FULGOR: "235", PONTO_FLUIDEZ: "-24" },
        PETRONAS: { NOME: "TUTELA EP 150", BASE: "MINERAL", IV: "95", PONTO_FULGOR: "230", PONTO_FLUIDEZ: "-15" }
    }
  },
  {
    APLICACAO: "REDUTORES E ENGRENAGENS (MINERAL)",
    ISO_VG: "220",
    PRODUTOS: {
      MOBIL: { NOME: "MOBILGEAR 600 XP 220", BASE: "MINERAL", IV: "97", PONTO_FULGOR: "240", PONTO_FLUIDEZ: "-24" },
      SHELL: { NOME: "OMALA S2 GX 220", BASE: "MINERAL", IV: "97", PONTO_FULGOR: "250", PONTO_FLUIDEZ: "-18" },
      CASTROL: { NOME: "ALPHA SP 220", BASE: "MINERAL", IV: "95", PONTO_FULGOR: "245", PONTO_FLUIDEZ: "-21" },
      PETROBRAS: { NOME: "LUBRAX INDUSTRIAL CLP 220", BASE: "MINERAL", IV: "95", PONTO_FULGOR: "242", PONTO_FLUIDEZ: "-15" },
      TEXACO: { NOME: "MEROPA 220", BASE: "MINERAL", IV: "96", PONTO_FULGOR: "248", PONTO_FLUIDEZ: "-21" },
      TOTAL: { NOME: "CARTER EP 220", BASE: "MINERAL", IV: "95", PONTO_FULGOR: "252", PONTO_FLUIDEZ: "-24" },
      FUCHS: { NOME: "RENOLIN CLP 220", BASE: "MINERAL", IV: "96", PONTO_FULGOR: "240", PONTO_FLUIDEZ: "-21" },
      PETRONAS: { NOME: "TUTELA EP 220", BASE: "MINERAL", IV: "95", PONTO_FULGOR: "240", PONTO_FLUIDEZ: "-15" }
    }
  },
  {
    APLICACAO: "REDUTORES E ENGRENAGENS (SINTÉTICO PAO)",
    ISO_VG: "220",
    PRODUTOS: {
      MOBIL: { NOME: "MOBILGEAR SHC XMP 220", BASE: "SINTÉTICO (PAO)", IV: "152", PONTO_FULGOR: "250", PONTO_FLUIDEZ: "-48" },
      SHELL: { NOME: "OMALA S4 GXV 220", BASE: "SINTÉTICO (PAO)", IV: "153", PONTO_FULGOR: "262", PONTO_FLUIDEZ: "-45" },
      TEXACO: { NOME: "PINNACLE EP 220", BASE: "SINTÉTICO (PAO)", IV: "155", PONTO_FULGOR: "255", PONTO_FLUIDEZ: "-47" },
      TOTAL: { NOME: "CARTER SH 220", BASE: "SINTÉTICO (PAO)", IV: "153", PONTO_FULGOR: "258", PONTO_FLUIDEZ: "-51" }
    }
  },
  {
    APLICACAO: "REDUTORES E ENGRENAGENS (SINTÉTICO PAG)",
    ISO_VG: "220",
    PRODUTOS: {
      MOBIL: { NOME: "MOBIL GLYGOYLE 220", BASE: "SINTÉTICO (PAG)", IV: "220", PONTO_FULGOR: "270", PONTO_FLUIDEZ: "-39" },
      SHELL: { NOME: "OMALA S4 WE 220", BASE: "SINTÉTICO (PAG)", IV: "235", PONTO_FULGOR: "285", PONTO_FLUIDEZ: "-42" },
      TEXACO: { NOME: "SYNLUBE CLP 220", BASE: "SINTÉTICO (PAG)", IV: "225", PONTO_FULGOR: "275", PONTO_FLUIDEZ: "-40" },
      TOTAL: { NOME: "CARTER SY 220", BASE: "SINTÉTICO (PAG)", IV: "230", PONTO_FULGOR: "280", PONTO_FLUIDEZ: "-36" }
    }
  },
  
  // --- TURBINAS A GÁS E VAPOR ---
  {
    APLICACAO: "TURBINAS A GÁS E VAPOR (MINERAL)",
    ISO_VG: "32",
    PRODUTOS: {
      MOBIL: { NOME: "DTE 732", BASE: "MINERAL", IV: "107", PONTO_FULGOR: "220", PONTO_FLUIDEZ: "-30" },
      SHELL: { NOME: "TURBO T 32", BASE: "MINERAL", IV: "110", PONTO_FULGOR: "215", PONTO_FLUIDEZ: "-33" },
      TEXACO: { NOME: "GST OIL 32", BASE: "MINERAL", IV: "108", PONTO_FULGOR: "218", PONTO_FLUIDEZ: "-30" },
      TOTAL: { NOME: "PRESLIA 32", BASE: "MINERAL", IV: "105", PONTO_FULGOR: "222", PONTO_FLUIDEZ: "-27" },
      PETRONAS: { NOME: "TUTELA T 32", BASE: "MINERAL", IV: "100", PONTO_FULGOR: "210", PONTO_FLUIDEZ: "-24" }
    }
  },
  
  // --- COMPRESSORES DE AR ---
  {
    APLICACAO: "COMPRESSOR DE AR PARAFUSO (MINERAL)",
    ISO_VG: "46",
    PRODUTOS: {
      MOBIL: { NOME: "RARUS 425", BASE: "MINERAL", IV: "97", PONTO_FULGOR: "236", PONTO_FLUIDEZ: "-27" },
      SHELL: { NOME: "CORENA S2 P 46", BASE: "MINERAL", IV: "98", PONTO_FULGOR: "230", PONTO_FLUIDEZ: "-30" },
      TEXACO: { NOME: "COMPRESSOR OIL EP 46", BASE: "MINERAL", IV: "95", PONTO_FULGOR: "235", PONTO_FLUIDEZ: "-25" },
      TOTAL: { NOME: "DACNIS 46", BASE: "MINERAL", IV: "97", PONTO_FULGOR: "228", PONTO_FLUIDEZ: "-24" },
      PETRONAS: { NOME: "TUTELA COM C 46", BASE: "MINERAL", IV: "96", PONTO_FULGOR: "220", PONTO_FLUIDEZ: "-21" }
    }
  },

  // --- GUIAS E BARRAMENTOS ---
  {
      APLICACAO: "GUIAS E BARRAMENTOS",
      ISO_VG: "68",
      PRODUTOS: {
          MOBIL: { NOME: "VACTRA Nº 2", BASE: "MINERAL", IV: "N/A", PONTO_FULGOR: "230", PONTO_FLUIDEZ: "-15" },
          SHELL: { NOME: "TONNA S2 M 68", BASE: "MINERAL", IV: "N/A", PONTO_FULGOR: "225", PONTO_FLUIDEZ: "-18" },
          CASTROL: { NOME: "MAGNA SW 68", BASE: "MINERAL", IV: "N/A", PONTO_FULGOR: "220", PONTO_FLUIDEZ: "-12" },
          PETROBRAS: { NOME: "LUBRAX INDUSTRIAL GBA 2", BASE: "MINERAL", IV: "N/A", PONTO_FULGOR: "224", PONTO_FLUIDEZ: "-12" },
          TOTAL: { NOME: "DROSERA MS 68", BASE: "MINERAL", IV: "N/A", PONTO_FULGOR: "232", PONTO_FLUIDEZ: "-18" },
          PETRONAS: { NOME: "TUTELA G 68", BASE: "MINERAL", IV: "N/A", PONTO_FULGOR: "220", PONTO_FLUIDEZ: "-15" }
      }
  },
  
  // --- GRAXAS ---
  {
    APLICACAO: "GRAXA DE LÍTIO MULTIUSO",
    ISO_VG: "NLGI 2", // Usamos NLGI para graxas
    PRODUTOS: {
      MOBIL: { NOME: "MOBILUX EP 2", BASE: "LÍTIO", IV: "N/A", PONTO_FULGOR: "N/A", PONTO_FLUIDEZ: "N/A" },
      SHELL: { NOME: "GADUS S2 V220 2", BASE: "LÍTIO", IV: "N/A", PONTO_FULGOR: "N/A", PONTO_FLUIDEZ: "N/A" },
      TEXACO: { NOME: "MULTIFAK EP 2", BASE: "LÍTIO", IV: "N/A", PONTO_FULGOR: "N/A", PONTO_FLUIDEZ: "N/A" },
      TOTAL: { NOME: "MULTIS EP 2", BASE: "LÍTIO", IV: "N/A", PONTO_FULGOR: "N/A", PONTO_FLUIDEZ: "N/A" },
      PETRONAS: { NOME: "TUTELA MR 2", BASE: "LÍTIO", IV: "N/A", PONTO_FULGOR: "N/A", PONTO_FLUIDEZ: "N/A" }
    }
  },
  {
    APLICACAO: "GRAXA DE COMPLEXO DE LÍTIO ALTA TEMPERATURA",
    ISO_VG: "NLGI 2",
    PRODUTOS: {
      MOBIL: { NOME: "MOBILGREASE XHP 222", BASE: "COMPLEXO DE LÍTIO", IV: "N/A", PONTO_FULGOR: "N/A", PONTO_FLUIDEZ: "N/A" },
      SHELL: { NOME: "GADUS S3 V220C 2", BASE: "COMPLEXO DE LÍTIO", IV: "N/A", PONTO_FULGOR: "N/A", PONTO_FLUIDEZ: "N/A" },
      TEXACO: { NOME: "STARPLEX EP 2", BASE: "COMPLEXO DE LÍTIO", IV: "N/A", PONTO_FULGOR: "N/A", PONTO_FLUIDEZ: "N/A" },
      TOTAL: { NOME: "CERAN WR 2", BASE: "COMPLEXO DE CÁLCIO", IV: "N/A", PONTO_FULGOR: "N/A", PONTO_FLUIDEZ: "N/A" }, // Exceção de base
      PETRONAS: { NOME: "TUTELA WBLC", BASE: "COMPLEXO DE LÍTIO", IV: "N/A", PONTO_FULGOR: "N/A", PONTO_FLUIDEZ: "N/A" }
    }
  }
];

// Matriz de compatibilidade (sem alterações)
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
    },
    "LÍTIO": {
        "LÍTIO": { "status": "OK", "descricao": "Graxas de mesma base (Lítio) são geralmente compatíveis. No entanto, sempre verifique a compatibilidade dos espessantes e aditivos." },
        "COMPLEXO DE LÍTIO": { "status": "CUIDADO", "descricao": "A mistura é possível, mas pode haver uma leve alteração nas propriedades, como o ponto de gota. Monitore a consistência da graxa após a mistura." }
    },
    "COMPLEXO DE LÍTIO": {
        "LÍTIO": { "status": "CUIDADO", "descricao": "A mistura é possível, mas pode haver uma leve alteração nas propriedades, como o ponto de gota. Monitore a consistência da graxa após a mistura." },
        "COMPLEXO DE LÍTIO": { "status": "OK", "descricao": "Graxas de mesma base (Complexo de Lítio) são totalmente compatíveis." }
    }
};

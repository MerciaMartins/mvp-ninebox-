// src/core/NineBox.ts

export class NineBox {
  classificar(mediaDesempenho: number, mediaPotencial: number) {
    const potencial =
      mediaPotencial >= 4 ? "alto" :
      mediaPotencial >= 2.6 ? "medio" : "baixo";

    const desempenho =
      mediaDesempenho >= 4 ? "acima" :
      mediaDesempenho >= 2.6 ? "esperado" : "abaixo";

    const mapa: any = {
      "baixo-abaixo": { quadrante: 1, descricao: "Insuficiente" },
      "baixo-esperado": { quadrante: 2, descricao: "Eficaz" },
      "baixo-acima": { quadrante: 3, descricao: "Comprometido" },

      "medio-abaixo": { quadrante: 4, descricao: "Questionável" },
      "medio-esperado": { quadrante: 5, descricao: "Mantenedor" },
      "medio-acima": { quadrante: 6, descricao: "Forte Desempenho" },

      "alto-abaixo": { quadrante: 7, descricao: "Enigma" },
      "alto-esperado": { quadrante: 8, descricao: "Forte Desempenho" },
      "alto-acima": { quadrante: 9, descricao: "Alto Potencial" }
    };

    return mapa[`${potencial}-${desempenho}`];
  }
}

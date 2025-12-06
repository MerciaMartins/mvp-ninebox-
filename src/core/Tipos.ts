// src/core/Tipos.ts
export interface Resposta {
  pergunta: string;
  indiceResposta: number;
  pontuacao: number;
}

export interface Pergunta {
  texto: string;
}
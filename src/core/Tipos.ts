// src/core/Tipos.ts
export enum PapelUsuario {
  admin = 1,
  rh = 2,
  gestor = 3,
  colaborador = 4,
}

export type NivelAcesso = PapelUsuario;

export interface Opcao {
  texto: string;
  pontuacao: number;
}

export interface Pergunta {
  id: string;
  texto: string;
  opcoes: Opcao[];
  categoria: "desempenho" | "potencial";
  ativa: boolean;
}

export interface Resposta {
  perguntaId: string;
  indiceOpcao: number;
  pontuacao: number;
}
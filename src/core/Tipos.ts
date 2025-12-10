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

export interface ResultadoAvaliacao {
  mediaDesempenho: number;
  mediaPotencial: number;
  quadrante: string;
  descricao: string;
}

export interface Usuario {
  id: string;
  nome: string;
  papel: PapelUsuario;
  // Para simplificar, vamos assumir que o colaborador é o único avaliado
  // e o gestor é o único avaliador.
  // Em um sistema real, isso seria mais complexo.
  // Aqui, vamos usar um campo para armazenar o resultado da avaliação do gestor sobre o colaborador
  // e outro para a autoavaliação do colaborador.
  respostasGestor?: Resposta[];
  respostasColaborador?: Resposta[];
  resultadoFinal?: ResultadoAvaliacao;
}
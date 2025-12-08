// src/core/Tipos.ts
export type PapelUsuario = "admin" | "rh" | "gestor" | "colaborador";
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
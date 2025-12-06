// src/core/Questionario.ts
import { Resposta } from "./Tipos";

export class Questionario {
  constructor(
    private perguntas: string[],
    private opcoes: string[],
    private pontuacoes: number[],
    private ui: { perguntar: (msg: string) => Promise<string> }
  ) {}

  async coletarRespostas(): Promise<Resposta[]> {
    const respostas: Resposta[] = [];

    for (const pergunta of this.perguntas) {
      console.log(`\n${pergunta}`);

      this.opcoes.forEach((opcao, index) =>
        console.log(`${index + 1} - ${opcao}`)
      );

      let digitado = await this.ui.perguntar("Escolha uma opção: ");
      let indice = parseInt(digitado) - 1;

      while (isNaN(indice) || indice < 0 || indice >= this.opcoes.length) {
        console.log("Opção inválida! Tente novamente.");
        digitado = await this.ui.perguntar("Escolha uma opção: ");
        indice = parseInt(digitado) - 1;
      }

      respostas.push({
        pergunta,
        indiceResposta: indice,
        pontuacao: this.pontuacoes[indice]!,
      });
    }

    return respostas;
  }

  calcularMedia(respostas: Resposta[]): number {
    const soma = respostas.reduce((acc, r) => acc + r.pontuacao, 0);
    return soma / respostas.length;
  }
}

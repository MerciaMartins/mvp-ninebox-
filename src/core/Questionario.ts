// src/core/Questionario.ts
import { Pergunta, Resposta } from "./Tipos";

export class Questionario {
  constructor(
    private perguntas: Pergunta[],
    private ui: { perguntar: (msg: string) => Promise<string> }
  ) {}

  async coletarRespostas(): Promise<Resposta[]> {
    const respostas: Resposta[] = [];

    for (const pergunta of this.perguntas) {
      if (!pergunta.ativa) continue; // Garante que só perguntas ativas sejam aplicadas
      console.log(`\n${pergunta.texto}`);

      pergunta.opcoes.forEach((opcao, index) =>
        console.log(`${index + 1} - ${opcao.texto}`)
      );

      let digitado = await this.ui.perguntar("Escolha uma opção: ");
      let indice = parseInt(digitado) - 1;

      while (isNaN(indice) || indice < 0 || indice >= pergunta.opcoes.length) {
        console.log("Opção inválida! Tente novamente.");
        digitado = await this.ui.perguntar("Escolha uma opção: ");
        indice = parseInt(digitado) - 1;
      }

      respostas.push({
        perguntaId: pergunta.id,
        indiceOpcao: indice,
        pontuacao: pergunta.opcoes[indice].pontuacao,
      });
    }

    return respostas;
  }

  calcularMedia(respostas: Resposta[]): number {
    if (respostas.length === 0) return 0;
    const soma = respostas.reduce((acc, r) => acc + r.pontuacao, 0);
    return soma / respostas.length;
  }
}

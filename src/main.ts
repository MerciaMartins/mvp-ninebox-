// src/main.ts
import { Questionario } from "./core/Questionario";
import { BancoQuestoes } from "./core/BancoQuestoes";
import { MenuQuestoes } from "./ui/MenuQuestoes";
import { NivelAcesso, Resposta, Usuario, PapelUsuario, ResultadoAvaliacao, Pergunta } from "./core/Tipos";
import { NineBox } from "./core/NineBox";
import { ConsoleInterface } from "./ui/ConsoleInterface";

// Variáveis globais para simular o estado do sistema
const colaborador: Usuario = {
  id: "colab-001",
  nome: "Colaborador Teste",
  papel: PapelUsuario.colaborador,
};

const gestor: Usuario = {
  id: "gestor-001",
  nome: "Gestor Teste",
  papel: PapelUsuario.gestor,
};

function filtrarPorCategoria(respostas: Resposta[], listaPerguntas: Pergunta[], categoria: "desempenho" | "potencial"): Resposta[] {
  const idsPerguntas = listaPerguntas
    .filter(p => p.categoria === categoria)
    .map(p => p.id);
  return respostas.filter(r => idsPerguntas.includes(r.perguntaId));
}

function exibirResultadoFinal(resultado: ResultadoAvaliacao): void {
  console.log("\n===== RESULTADO FINAL DA AVALIAÇÃO DO COLABORADOR =====");
  console.log("Desempenho do colaborador:", resultado.mediaDesempenho.toFixed(2));
  console.log("Potencial do colaborador:", resultado.mediaPotencial.toFixed(2));
  console.log(`O colaborador ficou no quadrante ${resultado.quadrante}: ${resultado.descricao}`);
  console.log("=======================================================");
}

async function realizarAvaliacao(
  avaliador: Usuario,
  avaliado: Usuario,
  banco: BancoQuestoes,
  ui: ConsoleInterface,
  tipoAvaliacao: "gestor" | "colaborador"
): Promise<void> {
  const perguntasAtivas = banco.listar(true);
  if (perguntasAtivas.length === 0) {
    console.log("❌ Não há perguntas ativas para realizar a avaliação.");
    return;
  }

  const perguntasDesempenho = perguntasAtivas.filter(p => p.categoria === "desempenho");
  const perguntasPotencial = perguntasAtivas.filter(p => p.categoria === "potencial");

  if (perguntasDesempenho.length === 0 || perguntasPotencial.length === 0) {
    console.log("❌ É necessário ter perguntas ativas de 'desempenho' e 'potencial' para a avaliação.");
    return;
  }

  const questionario = new Questionario(perguntasAtivas, ui);

  if (tipoAvaliacao === "gestor") {
    console.log(`\n=== Avaliação do Gestor (${avaliador.nome}) sobre o Colaborador (${avaliado.nome}) ===`);
    const respostas = await questionario.coletarRespostas();
    
    if (respostas.length === 0) {
      // Desistiu da avaliação, retorna sem salvar ou processar
      return;
    }

    avaliado.respostasGestor = respostas;

    const respostasDesempenho = filtrarPorCategoria(respostas, perguntasAtivas, "desempenho");
    const respostasPotencial = filtrarPorCategoria(respostas, perguntasAtivas, "potencial");

    const mediaDesempenho = questionario.calcularMedia(respostasDesempenho);
    const mediaPotencial = questionario.calcularMedia(respostasPotencial);

    console.log("\n===== RESULTADO INDIVIDUAL DA AVALIAÇÃO DO GESTOR =====");
    console.log("Desempenho do colaborador (Gestor):", mediaDesempenho.toFixed(2));
    console.log("Potencial do colaborador (Gestor):", mediaPotencial.toFixed(2));
    console.log("=======================================================");

  } else if (tipoAvaliacao === "colaborador") {
    console.log(`\n=== Autoavaliação do Colaborador (${avaliado.nome}) ===`);
    const respostas = await questionario.coletarRespostas();
    
    if (respostas.length === 0) {
      // Desistiu da autoavaliação, retorna sem salvar ou processar
      return;
    }

    avaliado.respostasColaborador = respostas;

    const respostasDesempenho = filtrarPorCategoria(respostas, perguntasAtivas, "desempenho");
    const respostasPotencial = filtrarPorCategoria(respostas, perguntasAtivas, "potencial");

    const mediaDesempenho = questionario.calcularMedia(respostasDesempenho);
    const mediaPotencial = questionario.calcularMedia(respostasPotencial);

    console.log("\n===== RESULTADO INDIVIDUAL DA AUTOAVALIAÇÃO =====");
    console.log("Desempenho do colaborador (Auto):", mediaDesempenho.toFixed(2));
    console.log("Potencial do colaborador (Auto):", mediaPotencial.toFixed(2));
    console.log("=================================================");
  }
}

function calcularResultadoFinal(avaliado: Usuario, nineBox: NineBox, banco: BancoQuestoes): ResultadoAvaliacao | undefined {
  if (!avaliado.respostasGestor || !avaliado.respostasColaborador) {
    return undefined;
  }

  const perguntasAtivas = banco.listar(true);
  const respostasGestor = avaliado.respostasGestor;
  const respostasColab = avaliado.respostasColaborador;

  const questionario = new Questionario([], new ConsoleInterface()); // Usado apenas para o método calcularMedia

  const respostasDesempenhoGestor = filtrarPorCategoria(respostasGestor, perguntasAtivas, "desempenho");
  const respostasPotencialGestor = filtrarPorCategoria(respostasGestor, perguntasAtivas, "potencial");
  const respostasDesempenhoColab = filtrarPorCategoria(respostasColab, perguntasAtivas, "desempenho");
  const respostasPotencialColab = filtrarPorCategoria(respostasColab, perguntasAtivas, "potencial");

  const mediaDesempenhoGestor = questionario.calcularMedia(respostasDesempenhoGestor);
  const mediaPotencialGestor = questionario.calcularMedia(respostasPotencialGestor);
  const mediaDesempenhoAuto = questionario.calcularMedia(respostasDesempenhoColab);
  const mediaPotencialAuto = questionario.calcularMedia(respostasPotencialColab);

  const mediaFinalDesempenho = (mediaDesempenhoGestor + mediaDesempenhoAuto) / 2;
  const mediaFinalPotencial = (mediaPotencialGestor + mediaPotencialAuto) / 2;

  const classificacao = nineBox.classificar(mediaFinalDesempenho, mediaFinalPotencial);

  return {
    mediaDesempenho: mediaFinalDesempenho,
    mediaPotencial: mediaFinalPotencial,
    quadrante: classificacao.quadrante,
    descricao: classificacao.descricao,
  };
}

async function main() {
  const ui = new ConsoleInterface();
  const banco = new BancoQuestoes();
  banco.popularExemplo();
  const menuQuestoes = new MenuQuestoes(banco, ui);
  const nineBox = new NineBox();

  while (true) {
    const nivel = await ui.perguntar(`
     Informe seu nível de acesso:
     1 - Admin
     2 - RH
     3 - Gestor
     4 - Colaborador
     5 - Visualizar Resultado Final
     0 - Sair
     Digite o número correspondente:`);

    const nivelNumber = parseInt(nivel);

    if (nivelNumber === 0) {
      console.log("Saindo do sistema.");
      break;
    }

    if (nivelNumber === 5) {
      // Tenta calcular o resultado final antes de exibir
      const novoResultado = calcularResultadoFinal(colaborador, nineBox, banco);
      if (novoResultado) {
        colaborador.resultadoFinal = novoResultado;
        exibirResultadoFinal(colaborador.resultadoFinal);
      } else {
        console.log("\n❌ O resultado final não pode ser calculado. Certifique-se de que o Gestor e o Colaborador realizaram suas avaliações.");
      }
      continue;
    }

    if (![1, 2, 3, 4].includes(nivelNumber)) {
      console.log("Nível de acesso inválido. Tente novamente.");
      continue;
    }

    const nivelAcesso = nivelNumber as PapelUsuario;

    // 1 e 2 (Admin/RH) - Acesso ao CRUD de perguntas
    if (nivelAcesso === PapelUsuario.admin || nivelAcesso === PapelUsuario.rh) {
      await menuQuestoes.exibirMenu(nivelAcesso);
      continue;
    }

    // 3 (Gestor) - Realiza a avaliação
    if (nivelAcesso === PapelUsuario.gestor) {
      await realizarAvaliacao(gestor, colaborador, banco, ui, "gestor");
      continue; // Volta para o menu de nível de acesso
    }

    // 4 (Colaborador) - Realiza a autoavaliação
    if (nivelAcesso === PapelUsuario.colaborador) {
      await realizarAvaliacao(colaborador, colaborador, banco, ui, "colaborador");
      continue; // Volta para o menu de nível de acesso
    }
  }

  ui.fechar();
}

main();

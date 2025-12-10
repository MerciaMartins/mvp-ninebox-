// src/main.ts
import { Questionario } from "./core/Questionario";
import { BancoQuestoes } from "./core/BancoQuestoes";
import { MenuQuestoes } from "./ui/MenuQuestoes";
import { NivelAcesso, Resposta } from "./core/Tipos";
import { NineBox } from "./core/NineBox";
import { ConsoleInterface } from "./ui/ConsoleInterface";

async function main() {
  const ui = new ConsoleInterface();
  const banco = new BancoQuestoes();
  banco.popularExemplo();
  const menuQuestoes = new MenuQuestoes(banco, ui);

  let nivelAcesso: NivelAcesso;

  while (true) {
    const nivel = await ui.perguntar(`
     Informe seu nível de acesso:
     1 - Admin
     2 - RH
     3 - Gestor
     4 - Colaborador
     Digite o número correspondente:`);

    const nivelNumber = parseInt(nivel);
    if (![1, 2, 3, 4].includes(nivelNumber)) {
      console.log("Nível de acesso inválido. Tente novamente.");
      continue;
    }

    nivelAcesso = nivelNumber as NivelAcesso;

    // Acesso ao CRUD de perguntas
    if (nivelAcesso === 1 || nivelAcesso === 2) {
      await menuQuestoes.exibirMenu(nivelAcesso);
    }

    // Se for Gestor (3) ou Colaborador (4), prossegue para a avaliação.
    if (nivelAcesso === 3 || nivelAcesso === 4) {
      break; // Sai do loop para iniciar a avaliação
    }
    // Caso contrário, volta para o menu de nível de acesso (o continue já está implícito no loop)
  }


  // Escolha de perguntas para avaliação
  const perguntasAtivas = banco.listar(true);
  if (perguntasAtivas.length === 0) {
    console.log("❌ Não há perguntas ativas para realizar a avaliação.");
    ui.fechar();
    return;
  }

  const perguntasDesempenho = perguntasAtivas.filter(p => p.categoria === "desempenho");
  const perguntasPotencial = perguntasAtivas.filter(p => p.categoria === "potencial");

  if (perguntasDesempenho.length === 0 || perguntasPotencial.length === 0) {
    console.log("❌ É necessário ter perguntas ativas de 'desempenho' e 'potencial' para a avaliação.");
    ui.fechar();
    return;
  }

  const listaPerguntas = perguntasAtivas;

  const qGestor = new Questionario(listaPerguntas, ui);
  const qColaborador = new Questionario(listaPerguntas, ui);

  console.log("=== Avaliação do Gestor ===");
  const respostasGestor = await qGestor.coletarRespostas();

  console.log("\n=== Autoavaliação do Colaborador ===");
  const respostasColab = await qColaborador.coletarRespostas();

  const filtrarPorCategoria = (respostas: Resposta[], categoria: "desempenho" | "potencial") => {
    const idsPerguntas = listaPerguntas
      .filter(p => p.categoria === categoria)
      .map(p => p.id);
    return respostas.filter(r => idsPerguntas.includes(r.perguntaId));
  };

  const respostasDesempenhoGestor = filtrarPorCategoria(respostasGestor, "desempenho");
  const respostasPotencialGestor = filtrarPorCategoria(respostasGestor, "potencial");
  const respostasDesempenhoColab = filtrarPorCategoria(respostasColab, "desempenho");
  const respostasPotencialColab = filtrarPorCategoria(respostasColab, "potencial");

  const mediaDesempenhoGestor = qGestor.calcularMedia(respostasDesempenhoGestor);
  const mediaPotencialGestor = qGestor.calcularMedia(respostasPotencialGestor);
  const mediaDesempenhoAuto = qColaborador.calcularMedia(respostasDesempenhoColab);
  const mediaPotencialAuto = qColaborador.calcularMedia(respostasPotencialColab);

  // =======================
  // CÁLCULO FINAL
  // =======================

  const mediaFinalDesempenho = (mediaDesempenhoGestor + mediaDesempenhoAuto) / 2;
  const mediaFinalPotencial = (mediaPotencialGestor + mediaPotencialAuto) / 2;

  const nineBox = new NineBox();
  const classificacao = nineBox.classificar(mediaFinalDesempenho, mediaFinalPotencial);

  console.log("\n===== RESULTADO FINAL =====");
  console.log("Desempenho do colaborador:", mediaFinalDesempenho.toFixed(2));
  console.log("Potencial do colaborador:", mediaFinalPotencial.toFixed(2));
  console.log(`O colaborador ficou no quadrante ${classificacao.quadrante}: ${classificacao.descricao}`);

  ui.fechar();
}

main();
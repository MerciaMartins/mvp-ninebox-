// src/main.ts
import { Questionario } from "./core/Questionario";
import { NineBox } from "./core/NineBox";
import { ConsoleInterface } from "./ui/ConsoleInterface";

async function main() {
  const ui = new ConsoleInterface();

  const opcoes = ["Excelente", "Bom", "Satisfatório", "Insatisfatório", "Precisa melhorar"];
  const pontuacoes = [5, 4, 3, 2, 1];

  const perguntasDesempenho = [
    "Qualidade da entrega e cumprimento das metas",
    "Organização e produtividade",
    "Resolução de problemas",
    "Comprometimento com prazos",
  ];

  const perguntasPotencial = [
    "Capacidade de aprender",
    "Abertura para feedback",
    "Perfil de liderança",
    "Capacidade de lidar com desafios",
  ];

  const qDesempenho = new Questionario(perguntasDesempenho, opcoes, pontuacoes, ui);
  const qPotencial = new Questionario(perguntasPotencial, opcoes, pontuacoes, ui);

  console.log("=== Avaliação do Gestor ===");

  console.log("\n Avaliação de DESEMPENHO do Colaborador realizada pelo Gestor:");
  const respDesempenhoGestor = await qDesempenho.coletarRespostas();
  const mediaDesempenhoGestor = qDesempenho.calcularMedia(respDesempenhoGestor);
  console.clear();
  console.log("=== RESULTADO DA AVALIAÇÃO DE DESEMPENHO FEITA DO GESTOR AO COLABORADOR ===");
  console.log(`Desempenho do Colaborador: ${mediaDesempenhoGestor.toFixed(2)}`);


  console.log("\nAvaliação de POTENCIAL do Colaborador realizada pelo Gestor:");
  const respPotencialGestor = await qPotencial.coletarRespostas();
  const mediaPotencialGestor = qPotencial.calcularMedia(respPotencialGestor);


  console.log("\n\n=== RESULTADO FINAL DA AVALIAÇÃO FEITA DO GESTOR AO COLABORADOR ===");
  console.log(`Avaliação de Desempenho do Colaborador feita pelo Gestor: ${mediaDesempenhoGestor.toFixed(2)}`);
  console.log(`Avaliação de Potencial do Colaborador feita pelo Gestor:   ${mediaPotencialGestor.toFixed(2)}`);

  console.log("\nAutoavaliação de DESEMPENHO DO COLABORADOR:");

  const respDesempenhoAuto = await qDesempenho.coletarRespostas();
  const mediaDesempenhoAuto = qDesempenho.calcularMedia(respDesempenhoAuto);

  // LIMPA A TELA ANTES DE EXIBIR O RESULTADO MÉDIA POTENCIAL DO GESTOR PARA O AVALIADO
  console.clear();
  console.log("=== RESULTADO DA AUTOAVALIAÇÃO DE DESEMPENHO FEITA PELO COLABORADOR ===");
  console.log(`Desempenho do Colaborador: ${mediaDesempenhoAuto.toFixed(2)}`);

  console.log("\n Autoavaliação de POTENCIAL DO COLABORADOR:");

  const respPotencialAuto = await qPotencial.coletarRespostas();
  const mediaPotencialAuto = qPotencial.calcularMedia(respPotencialAuto);

  console.log("\n\n\n=== RESULTADO DA AUTOAVALIAÇÃO FEITA PELO COLABORADOR===");
  console.log(`Desempenho (Auto): ${mediaDesempenhoAuto.toFixed(2)}`);
  console.log(`Potencial (Auto):   ${mediaPotencialAuto.toFixed(2)}`);

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
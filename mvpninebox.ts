import * as readline from "readline";


interface Resposta {
  pergunta: string;
  indiceResposta: number;
  pontuacao: number;
}

// Opções de resposta
const opcoesDeRespostas = [
  "Excelente",
  "Bom",
  "Satisfatório",
  "Insatisfatório",
  "Precisa melhorar"
];

const pontuacoes = [5, 4, 3, 2, 1];

// Perguntas 
const perguntasDesempenho = [
  "Qualidade da entrega e cumprimento das metas",
  "Organização e produtividade no dia a dia",
  "Resolução de problemas e tomada de decisão",
  "Comprometimento com prazos e resultados"
];

const perguntasPotencial = [
  "Capacidade de aprender rapidamente coisas novas",
  "Abertura para feedbacks e evolução contínua",
  "Perfil de liderança (iniciativa, influência, responsabilidade)",
  "Capacidade de lidar com desafios e mudanças"
];

// Configuração readline
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function perguntar(texto: string): Promise<string> {
  return new Promise((resolve) => rl.question(texto, resolve));
}

// Coleta respostas com validação
async function coletar(perguntas: string[]): Promise<Resposta[]> {
  const respostas: Resposta[] = [];

  for (const pergunta of perguntas) {
    console.log(`\n${pergunta}`);

    opcoesDeRespostas.forEach((opcao, index) =>
      console.log(`${index + 1} - ${opcao}`)
    );

    let respostaDigitada = await perguntar("Escolha o número da resposta: ");
    let indiceResposta = parseInt(respostaDigitada) - 1; 

 

    while (
      isNaN(indiceResposta) ||
      indiceResposta < 0 ||
      indiceResposta >= opcoesDeRespostas.length
    ) {
      console.log("Resposta inválida! Tente novamente.");
      respostaDigitada = await perguntar("Escolha o número da resposta: ");
      indiceResposta = parseInt(respostaDigitada) - 1;
    }

    respostas.push({
      pergunta: pergunta,
      indiceResposta,
      pontuacao: pontuacoes[indiceResposta]
    });
  }

  return respostas;
}

// Média
function calcularMedia(respostas: Resposta[]): number {
  const soma = respostas.reduce((acc, r) => acc + r.pontuacao, 0);
  return soma / respostas.length;
}

// Classificação Nine Box
function classificarNineBox(mediaDesempenho: number, mediaPotencial: number): { quadrante: number; descricao: string } {
  
   const potencial =
    mediaPotencial >= 4 ? "alto" :
      mediaPotencial >= 2.6 ? "medio" :
        "baixo";
  
  const desempenho =
    mediaDesempenho >= 4 ? "acima-do-esperado" :
      mediaDesempenho >= 2.6 ? "esperado" :
        "abaixo-do-esperado";
 

  const matriz: Record<string, { quadrante: number; descricao: string }> = {
    // POTENCIAL BAIXO (LINHA DE BAIXO)
    "baixo-abaixo-do-esperado": { quadrante: 1, descricao: "Insuficiente" },
    "baixo-esperado": { quadrante: 2, descricao: "Eficaz" },
    "baixo-acima-do-esperado": { quadrante: 3, descricao: "Comprometido" },

    // POTENCIAL MÉDIO (LINHA DO MEIO)
    "medio-abaixo-do-esperado": { quadrante: 4, descricao: "Questionável" },
    "medio-esperado": { quadrante: 5, descricao: "Mantenedor" },
    "medio-acima-do-esperado": { quadrante: 6, descricao: "Forte Desempenho" },

    // POTENCIAL ALTO (LINHA DE CIMA)
    "alto-abaixo-do-esperado": { quadrante: 7, descricao: "Enigma" },
    "alto-esperado": { quadrante: 8, descricao: "Forte Desempenho" },
    "alto-acima-do-esperado": { quadrante: 9, descricao: "Alto Potencial" }
  };

  return matriz[`${potencial}-${desempenho}`];
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}


// Execução principal

async function executar() {
  console.log("=== MVP Avaliação de Desempenho com Nine Box ===");

  // =======================
  // AVALIAÇÃO DO GESTOR
  // =======================
  console.log("\n Avaliação de DESEMPENHO do Colaborador realizada pelo Gestor:");
  const respostasDesempenhoAvaliado = await coletar(perguntasDesempenho);


  const mediaDesempenhoAvaliado = calcularMedia(respostasDesempenhoAvaliado);

  // LIMPA A TELA ANTES DE EXIBIR O RESULTADO MÉDIA DESEMPENHO DO GESTOR PARA O AVALIADO
  console.clear();
  console.log("=== RESULTADO DA AVALIAÇÃO DE DESEMPENHO FEITA DO GESTOR AO COLABORADOR ===");
  console.log(`Desempenho do Colaborador: ${mediaDesempenhoAvaliado.toFixed(2)}`);


  console.log("\n Avaliação de POTENCIAL do Colaborador realizada pelo Gestor:");
  const respostasPotencialAvaliado = await coletar(perguntasPotencial);
  const mediaPotencialAvaliado = calcularMedia(respostasPotencialAvaliado);

  console.log("=== RESULTADO FINAL DA AVALIAÇÃO FEITA DO GESTOR AO COLABORADOR ===");
  console.log(`Avaliação de Desempenho do Colaborador feita pelo Gestor: ${mediaDesempenhoAvaliado.toFixed(2)}`);
  console.log(`Avaliação de Potencial do Colaborador feita pelo Gestor:   ${mediaPotencialAvaliado.toFixed(2)}`);

  // Mantém essa tela por 1 segundo
  await sleep(1000);

  // =======================
  // AUTOAVALIAÇÃO
  // =======================
  console.log("\n================ AUTOAVALIAÇÃO DO COLABORADOR ================");

  console.log("\n Autoavaliação de DESEMPENHO:");
  const respostasDesempenhoAutoavaliacao = await coletar(perguntasDesempenho);
  const mediaDesempenhoAutoavaliacao = calcularMedia(respostasDesempenhoAutoavaliacao);


  // LIMPA A TELA ANTES DE EXIBIR O RESULTADO MÉDIA POTENCIAL DO GESTOR PARA O AVALIADO
  console.clear();
  console.log("=== RESULTADO DA AUTOAVALIAÇÃO DE DESEMPENHO FEITA PELO COLABORADOR ===");
  console.log(`Desempenho do Colaborador: ${mediaDesempenhoAutoavaliacao.toFixed(2)}`);


  console.log("\n Autoavaliação de POTENCIAL:");
  const respostasPotencialAutoavaliacao = await coletar(perguntasPotencial);
  const mediaPotencialAutoavaliacao = calcularMedia(respostasPotencialAutoavaliacao);

  console.log("\n=== RESULTADO DA AUTOAVALIAÇÃO FEITA PELO COLABORADOR===");
  console.log(`Desempenho (Auto): ${mediaDesempenhoAutoavaliacao.toFixed(2)}`);
  console.log(`Potencial (Auto):   ${mediaPotencialAutoavaliacao.toFixed(2)}`);

  // =======================
  // CÁLCULO FINAL
  // =======================
  const mediaTotalDesempenhoAvaliado =
    (mediaDesempenhoAvaliado + mediaDesempenhoAutoavaliacao) / 2;

  const mediaTotalPotencialAvaliado =
    (mediaPotencialAvaliado + mediaPotencialAutoavaliacao) / 2;

  const resultado = classificarNineBox(mediaTotalDesempenhoAvaliado, mediaTotalPotencialAvaliado);

  // ======================
  // COMPARAÇÃO FINAL
  // ======================
  console.log("\n================ COMPARAÇÃO FINAL =================");

  console.log(`
DESCRIÇÃO                GESTOR      AUTOAVALIAÇÃO      MÉDIA FINAL
----------------------------------------------------------------------
Desempenho:             ${mediaDesempenhoAvaliado.toFixed(2)}           ${mediaDesempenhoAutoavaliacao.toFixed(2)}             ${mediaTotalDesempenhoAvaliado.toFixed(2)}
Potencial:              ${mediaPotencialAvaliado.toFixed(2)}           ${mediaPotencialAutoavaliacao.toFixed(2)}             ${mediaTotalPotencialAvaliado.toFixed(2)}
  `);

  console.log("===============================================================");
  console.log(`O colaborador foi enquadrado no Quadrante ${resultado.quadrante}: ${resultado.descricao}.`);

  rl.close();
}


executar();

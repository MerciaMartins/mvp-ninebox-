const readline = require("readline");

const opcoesDeRespostas = [
  "Excelente",
  "Bom",
  "Satisfatório",
  "Insatisfatório",
  "Precisa melhorar"
];

const pontuacoes = [5, 4, 3, 2, 1];

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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function perguntar(texto) {
  return new Promise((resolve) => rl.question(texto, resolve));
}

async function coletar(perguntas) {
  const respostas = [];

  for (const pergunta of perguntas) {
    console.log(`\n${pergunta}`);

    opcoesDeRespostas.forEach((opcao, index) =>
      console.log(`${index} - ${opcao}`)
    );

    let respostaDigitada = await perguntar("Escolha o número da resposta: ");
    let indiceResposta = parseInt(respostaDigitada);

    while (
      isNaN(indiceResposta) ||
      indiceResposta < 0 ||
      indiceResposta >= opcoesDeRespostas.length
    ) {
      console.log("Resposta inválida! Tente novamente.");
      respostaDigitada = await perguntar("Escolha o número da resposta: ");
      indiceResposta = parseInt(respostaDigitada);
    }

    respostas.push({
      pergunta,
      indiceResposta,
      pontuacao: pontuacoes[indiceResposta]
    });
  }

  return respostas;
}

function calcularMedia(respostas) {
  const soma = respostas.reduce((acc, r) => acc + r.pontuacao, 0);
  return soma / respostas.length;
}

function classificarNineBox(mediaDesempenho, mediaPotencial) {
  const desempenho =
    mediaDesempenho >= 4.0 ? "Alto" :
    mediaDesempenho >= 2.6 ? "Médio" : "Baixo";

  const potencial =
    mediaPotencial >= 4.0 ? "Alto" :
    mediaPotencial >= 2.6 ? "Médio" : "Baixo";

  const matriz = {
    "Alto-Alto": "Estrela (Top Talent) ",
    "Alto-Médio": "Alto desempenho, médio potencial",
    "Alto-Baixo": "Alto desempenho, baixo potencial",
    "Médio-Alto": "Talento em desenvolvimento",
    "Médio-Médio": "Regular",
    "Médio-Baixo": "Desempenho médio, baixo potencial",
    "Baixo-Alto": "Alto potencial, baixo desempenho",
    "Baixo-Médio": "Desempenho fraco",
    "Baixo-Baixo": "Crítico — atenção urgente"
  };

  return matriz[`${desempenho}-${potencial}`];
}

async function executar() {
  console.log("=== MVP Avaliação de Desempenho com Nine Box ===");

  console.log("\n Avaliação de DESEMPENHO:");
  const respostasDesempenho = await coletar(perguntasDesempenho);

  console.log("\n Avaliação de POTENCIAL:");
  const respostasPotencial = await coletar(perguntasPotencial);

  rl.close();

  const mediaDesempenho = calcularMedia(respostasDesempenho);
  const mediaPotencial = calcularMedia(respostasPotencial);

  console.log("\n=== RESULTADO FINAL ===");
  console.log(`Média de Desempenho: ${mediaDesempenho.toFixed(2)}`);
  console.log(`Média de Potencial: ${mediaPotencial.toFixed(2)}`);

  const resultado = classificarNineBox(mediaDesempenho, mediaPotencial);
  console.log(`\n Classificação Nine Box: ${resultado}`);
}

executar();
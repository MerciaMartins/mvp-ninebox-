# Sistema de Avaliação Nine Box – Node.js + TypeScript

Este projeto implementa um **Sistema de Avaliação de Desempenho e Potencial** baseado na metodologia **Nine Box (9-Box Grid)**.

## 🚀 Metodologia Nine Box

O sistema simula o processo de avaliação de desempenho e potencial dentro de uma organização, seguindo os seguintes passos:

1.  **Avaliação do Gestor:** O gestor avalia o colaborador, respondendo a perguntas sobre Desempenho e Potencial.
2.  **Autoavaliação do Colaborador:** O próprio colaborador realiza sua autoavaliação com o mesmo conjunto de perguntas.
3.  **Cálculo da Média:** O sistema calcula a média ponderada entre as avaliações (Gestor + Autoavaliação).
4.  **Classificação:** O colaborador é classificado em um dos 9 quadrantes da matriz Nine Box com base nas médias de Desempenho e Potencial.

## 🧩 Estrutura do Projeto

A estrutura proposta é simples e organizada, focando na separação de responsabilidades:

```
src/
├── core/
│ ├── Questionario.ts
│ ├── NineBox.ts
│ └── Tipos.ts
├── ui/
│ └── ConsoleInterface.ts
└── main.ts
```

## 📝 Descrição dos Arquivos

### `Tipos.ts`

Contém apenas as interfaces e tipos utilizados no projeto, como `Resposta` (armazena a resposta, índice da opção e pontuação) e `Pergunta` (representa uma pergunta simples). Isso mantém o código organizado e padronizado.

### `Questionario.ts`

Classe responsável por gerenciar o fluxo de perguntas e respostas:

*   Exibir perguntas e opções.
*   Validar entradas do usuário.
*   Coletar as respostas.
*   Calcular a média das pontuações obtidas.

**Trecho essencial para o cálculo da média:**

```typescript
const soma = respostas.reduce((acc, r) => acc + r.pontuacao, 0);
return soma / respostas.length;
```

### `NineBox.ts`

O núcleo da lógica de classificação. Este arquivo converte as médias numéricas de Desempenho e Potencial em um quadrante (1-9) da matriz Nine Box, produzindo também uma descrição textual do perfil.

**Fluxo resumido:**

1.  Recebe `mediaDesempenho` e `mediaPotencial`.
2.  Converte cada média em uma faixa:
    *   **Potencial:** `baixo` / `médio` / `alto`.
    *   **Desempenho:** `abaixo` / `esperado` / `acima`.
3.  Monta a chave no formato `"<potencial>-<desempenho>"` e consulta um mapa com as 9 combinações.
4.  Retorna um objeto `{ quadrante: number, descricao: string }`.

**Critérios de Classificação:**

| Média | Potencial | Desempenho |
| :---: | :--- | :--- |
| `>= 4` | alto | acima |
| `>= 2.6` | médio | esperado |
| `< 2.6` | baixo | abaixo |

**Trecho ilustrativo da lógica de conversão:**

```typescript
const potencial =
  mediaPotencial >= 4 ? "alto" :
  mediaPotencial >= 2.6 ? "medio" : "baixo";

const desempenho =
  mediaDesempenho >= 4 ? "acima" :
  mediaDesempenho >= 2.6 ? "esperado" : "abaixo";

return mapa[`${potencial}-${desempenho}`];
```

### `ConsoleInterface.ts`

Responsável pela interação com o usuário, gerenciando a entrada de dados no terminal usando a biblioteca `readline` do Node.js.

**Trecho essencial:**

```typescript
perguntar(msg: string): Promise<string> {
  return new Promise(resolve => this.rl.question(msg, resolve));
}
```

### `main.ts`

O ponto de entrada do sistema. Orquestra a execução de todas as etapas:

*   Executa o questionário do gestor.
*   Executa a autoavaliação do colaborador.
*   Calcula as médias individuais e finais.
*   Aplica o modelo Nine Box (`NineBox.ts`).
*   Exibe a classificação final ao usuário.

## 📊 Modelo Nine Box

A Matriz Nine Box (9-Box Grid) é uma ferramenta de gestão de talentos que avalia os colaboradores em duas dimensões: Potencial (eixo Y) e Desempenho (eixo X).

![Matriz Nine Box](https://private-us-east-1.manuscdn.com/sessionFile/xA16mghhAK6dqeewhi9i10/sandbox/pSmIyhxGoSgvmo1S9eVXo8-images_1765178955161_na1fn_L2hvbWUvdWJ1bnR1L21hdHJpei05LWJveA.png?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUveEExNm1naGhBSzZkcWVld2hpOWkxMC9zYW5kYm94L3BTbUl5aHhHb1Nndm1vMVM5ZVZYbzgtaW1hZ2VzXzE3NjUxNzg5NTUxNjFfbmExZm5fTDJodmJXVXZkV0oxYm5SMUwyMWhkSEpwZWkwNUxXSnZlQS5wbmciLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=TfNXwFtu~Az2X0ZNOy8Jtn-jgWr05qAtg0XYt2-qmYgUpLYM9FYL3~yExwYn7AQWnKXw57bwpFq5GOzMrx8lRj5o4J62SLjxGws-6k-7qlM6If8nCUpQeqhg3skckgpQ~kDeZpM4I2mSBFIoPE5EOBxRQ94YU6MDO-mzOznROAVrWPh0wNe1H4WUw3P2u1vU4IcIhWYyvG4SD7NBc8Sh~AqgErvWDlLRhfpfe7EBJkdHrG8n1~V~FEH9eyxQ4odAhKo~aMIR0HlmwIwJsi80VYCu7sN8uW2z3swCQP0Rw8qHO2lPK3RY3JrYYc2~nm3dgEsKdm91l3vxbfjX4222PA__)

### Significado dos 9 Quadrantes

A tabela a seguir detalha o significado de cada quadrante da matriz Nine Box:

| Quadrante | Nome | Descrição |
| :---: | :--- | :--- |
| 1 | **Insuficiente** | Baixo potencial e baixo desempenho |
| 2 | **Eficaz** | Entrega esperada, mas com baixo potencial |
| 3 | **Comprometido** | Ótimo desempenho, mas com baixo potencial |
| 4 | **Questionável** | Potencial médio, mas com desempenho baixo |
| 5 | **Mantenedor** | Consistente e estável, com desempenho e potencial medianos |
| 6 | **Forte Desempenho** | Alta entrega, com potencial mediano |
| 7 | **Enigma** | Alto potencial, mas com desempenho baixo |
| 8 | **Forte Desempenho** | Potencial alto, com desempenho esperado |
| 9 | **Alto Potencial** | Destaque total, com alto potencial e alto desempenho |

## ▶ Como Executar

Para rodar o sistema localmente, siga os passos abaixo:

1.  **Instale as dependências:**

    ```bash
    npm install
    ```

2.  **Execute o sistema:**

    ```bash
    npm start
    ```

    *Ou, alternativamente:*

    ```bash
    npx ts-node src/main.ts
    ```

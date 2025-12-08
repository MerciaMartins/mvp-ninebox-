import { BancoQuestoes } from "../core/BancoQuestoes";
import { InterfaceUsuario } from "./ConsoleInterface";
import { PapelUsuario, Opcao, Pergunta } from "../core/Tipos";

export class MenuQuestoes {
    constructor(
        private banco: BancoQuestoes,
        private ui: InterfaceUsuario
    ) { }

    async exibirMenu(nivel: PapelUsuario): Promise<void> {
        if (nivel !== "admin" && nivel !== "rh") {
            console.log("\n❌ Você não tem permissão para gerenciar perguntas.");
            return;
        }

        while (true) {
            console.log(`
===== MENU DE GESTÃO DE QUESTÕES =====
1. Criar nova pergunta
2. Listar perguntas
3. Atualizar pergunta
4. Excluir pergunta
0. Voltar
`);

            const opc = await this.ui.perguntar("Escolha uma opção: ");

            switch (opc) {
                case "1":
                    await this.criarPergunta();
                    break;
                case "2":
                    this.listarPerguntas();
                    break;
                case "3":
                    await this.atualizarPergunta();
                    break;
                case "4":
                    await this.excluirPergunta();
                    break;
                case "0":
                    return;
                default:
                    console.log("Opção inválida.");
            }
        }
    }

    private listarPerguntas(): void {
        const perguntas = this.banco.listar(false);
        if (perguntas.length === 0) {
            console.log("\nNenhuma pergunta cadastrada.");
            return;
        }

        console.log("\n===== LISTA DE PERGUNTAS =====");
        perguntas.forEach(p => {
            console.log(`
ID: ${p.id}
Texto: ${p.texto}
Categoria: ${p.categoria}
Ativa: ${p.ativa ? "Sim" : "Não"}
Opções:
${p.opcoes.map(o => `  - ${o.texto} (Pontuação: ${o.pontuacao})`).join("\n")}
`);
        });
    }

    private async criarPergunta(): Promise<void> {
        console.log("\n--- CRIAR NOVA PERGUNTA ---");
        const texto = await this.ui.perguntar("Digite o texto da pergunta: ");
        let categoria = await this.ui.perguntar("Categoria (desempenho/potencial): ");
        categoria = categoria.toLowerCase();

        if (categoria !== "desempenho" && categoria !== "potencial") {
            console.log("❌ Categoria inválida. Use 'desempenho' ou 'potencial'.");
            return;
        }

        const opcoes: Opcao[] = [];
        console.log("--- OPÇÕES DE RESPOSTA (5 opções, pontuação de 1 a 5) ---");
        for (let i = 1; i <= 5; i++) {
            const textoOpcao = await this.ui.perguntar(`Texto da opção ${i} (Pontuação ${i}): `);
            opcoes.push({ texto: textoOpcao, pontuacao: i });
        }

        this.banco.criar({
            texto,
            opcoes,
            categoria: categoria as "desempenho" | "potencial",
            ativa: true, // Nova pergunta é ativa por padrão
        } as Omit<Pergunta, "id">);

        console.log("✔ Pergunta criada com sucesso!");
    }

    private async atualizarPergunta(): Promise<void> {
        this.listarPerguntas();
        const id = await this.ui.perguntar("\nID da pergunta para atualizar: ");

        const pergunta = this.banco.obter(id);
        if (!pergunta) {
            console.log("❌ Pergunta não encontrada.");
            return;
        }

        console.log(`\n--- ATUALIZAR PERGUNTA (ID: ${id}) ---`);
        const novoTexto = await this.ui.perguntar(`Texto atual: ${pergunta.texto}\nNovo texto (ou Enter para manter): `);
        const novaCat = await this.ui.perguntar(`Categoria atual: ${pergunta.categoria}\nNova categoria (desempenho/potencial, ou Enter para manter): `);
        const novaAtiva = await this.ui.perguntar(`Ativa atual: ${pergunta.ativa ? "Sim" : "Não"}\nNova ativa (sim/não, ou Enter para manter): `);

        const dadosAtualizacao: Partial<Omit<Pergunta, "id">> = {};

        if (novoTexto) {
            dadosAtualizacao.texto = novoTexto;
        }

        if (novaCat) {
            const catLower = novaCat.toLowerCase();
            if (catLower === "desempenho" || catLower === "potencial") {
                dadosAtualizacao.categoria = catLower as "desempenho" | "potencial";
            } else {
                console.log("❌ Categoria inválida. Mantendo a anterior.");
            }
        }

        if (novaAtiva) {
            const ativaLower = novaAtiva.toLowerCase();
            if (ativaLower === "sim") {
                dadosAtualizacao.ativa = true;
            } else if (ativaLower === "não" || ativaLower === "nao") {
                dadosAtualizacao.ativa = false;
            } else {
                console.log("❌ Valor para 'ativa' inválido. Mantendo o anterior.");
            }
        }

        const atualizarOpcoes = await this.ui.perguntar("Deseja atualizar as opções de resposta? (s/n, Enter para n): ");
        if (atualizarOpcoes.toLowerCase() === "s") {
            const novasOpcoes: Opcao[] = [];
            console.log("--- NOVAS OPÇÕES DE RESPOSTA (5 opções, pontuação de 1 a 5) ---");
            for (let i = 1; i <= 5; i++) {
                const textoOpcao = await this.ui.perguntar(`Texto da opção ${i} (Pontuação ${i}): `);
                novasOpcoes.push({ texto: textoOpcao, pontuacao: i });
            }
            dadosAtualizacao.opcoes = novasOpcoes;
        }


        const atualizada = this.banco.atualizar(id, dadosAtualizacao);

        if (atualizada) {
            console.log("✔ Pergunta atualizada!");
        } else {
            console.log("❌ Falha ao atualizar a pergunta.");
        }
    }

    private async excluirPergunta(): Promise<void> {
        this.listarPerguntas();
        const id = await this.ui.perguntar("\nID da pergunta para excluir: ");

        const ok = this.banco.excluir(id);
        if (ok) console.log("✔ Pergunta excluída!");
        else console.log("❌ Pergunta não encontrada.");
    }
}

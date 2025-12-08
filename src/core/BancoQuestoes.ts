import { Pergunta } from "./Tipos";
import { randomUUID } from "crypto";

export class BancoQuestoes {
    private questoes: Pergunta[] = [];

    criar(pergunta: Omit<Pergunta, "id">): Pergunta {
        const nova: Pergunta = { ...pergunta, id: randomUUID() };
        this.questoes.push(nova);
        return nova;
    }

    listar(soAtivas = false): Pergunta[] {
        return soAtivas ? this.questoes.filter(q => q.ativa) : [...this.questoes];
    }

    obter(id: string): Pergunta | undefined {
        return this.questoes.find(q => q.id === id);
    }

    atualizar(id: string, dados: Partial<Omit<Pergunta, "id">>): Pergunta | undefined {
        const p = this.obter(id);
        if (!p) return undefined;
        Object.assign(p, dados);
        return p;
    }

    excluir(id: string): boolean {
        const index = this.questoes.findIndex(q => q.id === id);
        if (index === -1) return false;
        this.questoes.splice(index, 1);
        return true;
    }

    // método utilitário para popular com exemplos
    popularExemplo() {
        if (this.questoes.length) return;
        this.criar({
            texto: "Entrega resultados de qualidade consistentemente?",
            opcoes: [
                { texto: "Nunca", pontuacao: 1 },
                { texto: "Raramente", pontuacao: 2 },
                { texto: "Às vezes", pontuacao: 3 },
                { texto: "Quase sempre", pontuacao: 4 },
                { texto: "Sempre", pontuacao: 5 },
            ],
            categoria: "desempenho",
            ativa: true,
        });

        this.criar({
            texto: "Demonstra potencial para assumir responsabilidades maiores?",
            opcoes: [
                { texto: "Não", pontuacao: 1 },
                { texto: "Pouco", pontuacao: 2 },
                { texto: "Moderado", pontuacao: 3 },
                { texto: "Alto", pontuacao: 4 },
                { texto: "Muito alto", pontuacao: 5 },
            ],
            categoria: "potencial",
            ativa: true,
        });
    }
}

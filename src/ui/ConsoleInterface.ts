// src/ui/ConsoleInterface.ts
import * as readline from "readline";

export class ConsoleInterface {
  private rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  perguntar(msg: string): Promise<string> {
    return new Promise((resolve) => this.rl.question(msg, resolve));
  }

  fechar() {
    this.rl.close();
  }
}
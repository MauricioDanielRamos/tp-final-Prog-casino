import { Usuario } from "./Usuario";
import { TragamonedaBase } from "./TragamonedaBase";

export class TragamonedaAnimal extends TragamonedaBase {
    constructor(nombre: string) {
        super(nombre, 100); // Créditos mínimos para jugar
        this.rodillos = [`🦁`, `🐯`, `🐻`, `🐼`, `🐨`, `🐸`, `🐵`, `🦊`, `🐴`, `🐶`];
    }

    public girarRodillos(): string[] {
        const resultados: string[] = [];
        for (let i = 0; i < 4; i++) {
            const indiceAleatorio = Math.floor(Math.random() * this.rodillos.length);
            resultados.push(this.rodillos[indiceAleatorio]);
        }
        return resultados;
    }

    public mostrarPremio(coincidencias: number, usuario: Usuario): void {
        let premio = 0;
        switch (coincidencias) {
            case 4:
                premio = this.apuesta * 15;
                console.log(`¡Felicidades! Coincidieron los 3 emojis.`);
                break;
            case 3:
                premio = this.apuesta * 10;
                console.log(`¡Felicidades! Coincidieron los 3 emojis.`);
                break;
            case 2:
                premio = this.apuesta * 6;
                console.log(`¡Muy bien! Coincidieron 2 emojis.`);
                break;
            case 1:
                premio = this.apuesta * 2;
                console.log(`Coincidio 1 emoji.`);
                break;
            default:
                console.log(`No hubo coincidencias esta vez.`);
                break;
        }
        usuario.setCreditos(premio);
        console.log(`Tu premio es: ${premio} creditos.`);
    }
}

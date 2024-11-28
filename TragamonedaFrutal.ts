import { TragamonedaBase } from "./TragamonedaBase";
import { Usuario } from "./Usuario";


export class TragamonedaFrutal extends TragamonedaBase {
    constructor(nombre: string) {
        super(nombre, 50); // Créditos mínimos para jugar
        this.rodillos = [`🍒`, `🍋`, `🍊`, `🍉`, `🍇`, `🍓`, `🍍`, `🥝`, `🍌`, `🥥`];
    }

    protected mostrarPremio(coincidencias: number, usuario: Usuario): void {
        let premio = 0;
        if (coincidencias === 3) {
            premio = this.apuesta * 10;
            console.log(`¡Felicidades! Coincidieron los 3 emojis.`);
        } else if (coincidencias === 2) {
            premio = this.apuesta * 3;
            console.log(`¡Muy bien! Coincidieron 2 emojis.`);
        } else if (coincidencias === 1) {
            premio = this.apuesta;
            console.log(`Coincidió 1 emoji.`);
        } else {
            console.log(`No hubo coincidencias esta vez.`);
        }
        usuario.setCreditos(premio);
        console.log(`Tu premio es: ${premio} créditos.`);
    }
}

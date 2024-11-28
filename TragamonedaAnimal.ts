import { Usuario } from "./Usuario";
import { TragamonedaBase } from "./TragamonedaBase";

export class TragamonedaAnimal extends TragamonedaBase {
    constructor(nombre: string) {
        super(nombre, 100); // Créditos mínimos para jugar
        this.rodillos = [`🦁`, `🐯`, `🐻`, `🐼`, `🐨`, `🐸`, `🐵`, `🦊`, `🐴`, `🐶`];
    }

    protected mostrarPremio(coincidencias: number, usuario: Usuario): void {
        let premio = 0;
        if (coincidencias === 3) {
            premio = this.apuesta * 15;
            console.log(`¡Felicidades! Coincidieron los 3 emojis.`);
        } else if (coincidencias === 2) {
            premio = this.apuesta * 6;
            console.log(`¡Muy bien! Coincidieron 2 emojis.`);
        } else if (coincidencias === 1) {
            premio = this.apuesta * 2;
            console.log(`Coincidió 1 emoji.`);
        } else {
            console.log(`No hubo coincidencias esta vez.`);
        }
        usuario.setCreditos(premio);
        console.log(`Tu premio es: ${premio} créditos.`);
    }
}

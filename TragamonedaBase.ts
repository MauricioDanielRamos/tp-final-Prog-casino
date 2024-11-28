import { Juego } from "./Juego";
import { Usuario } from "./Usuario";
import { ITragamoneda } from "./ITragamoneda";
import * as rls from "readline-sync";

// Clase base para Tragamoneda
export abstract class TragamonedaBase extends Juego implements ITragamoneda {
    protected rodillos: string[] = [];
    protected apuesta: number = 0;
    protected emojiFavorito: string = ``;
    protected creditosMinimos: number;
    public nombreJuego: string=``;
    

    constructor(nombre: string, creditosMinimos: number) {
        super(nombre);
        this.creditosMinimos = creditosMinimos;
    }

    public jugar(usuario: Usuario): void {
        if (!usuario) {
            throw new Error(`Error: Usuario indefinido.`);
        }

        if (usuario.getCreditos() < this.creditosMinimos) {
            throw new Error(`Error: Créditos insuficientes.`);
        }

        console.log(`Bienvenido ${usuario.getNombre()} al juego de ${this.nombreJuego}`);
        console.log(
            `Créditos actuales: ${usuario.getCreditos().toLocaleString(`es-AR`, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}`
        );

        while (true) {
            console.log(`\nEstás listo para comenzar el juego?`);
            const comenzar = rls.question(`Escribe 's' para iniciar o 'n' para terminar: `).toLowerCase();

            if (comenzar === `s`) {
                this.establecerApuesta(usuario);
                this.elegirEmoji();
                this.IniciarJuego(usuario);

                if (usuario.getCreditos() < this.creditosMinimos) {
                    console.log(`No tienes suficientes créditos para jugar.`);
                    rls.keyInPause(`Presione cualquier tecla para continuar...`, {
                        guide: false,
                    });
                    break;
                }
            } else if (comenzar === `n`) {
                console.log(`¡Gracias por jugar!`);
                break;
            } else {
                console.error(`Por favor, escribe una opción válida.`);
            }
        }
    }

    protected establecerApuesta(usuario: Usuario): void {
        while (true) {
            const apuestaIngresada = rls.question(`Ingresa tu apuesta (mínimo ${this.creditosMinimos} créditos): `);
            const apuesta = parseInt(apuestaIngresada);

            if (!isNaN(apuesta) && apuesta >= this.creditosMinimos && apuesta <= usuario.getCreditos()) {
                this.apuesta = apuesta;
                usuario.setCreditos(-apuesta);
                console.log(`Has apostado ${apuesta} créditos.`);
                break;
            } else {
                console.error(
                    `Por favor, ingresa un valor válido entre ${this.creditosMinimos} y tus créditos disponibles (${usuario.getCreditos()}).`
                );
            }
        }
    }

    protected elegirEmoji(): void {
        console.log(`Elige tu emoji favorito de la lista:`);
        this.rodillos.forEach((emoji, index) => {
            console.log(`${index + 1}. ${emoji}`);
        });

        while (true) {
            const seleccion = rls.question(`Ingresa el numero del emoji que deseas: `);
            const indice = parseInt(seleccion) - 1;

            if (!isNaN(indice) && indice >= 0 && indice < this.rodillos.length) {
                this.emojiFavorito = this.rodillos[indice];
                console.log(`Has elegido: ${this.emojiFavorito}`);
                break;
            } else {
                console.error(`Por favor, selecciona un número válido.`);
            }
        }
    }

    protected IniciarJuego(usuario: Usuario): void {
        console.log(`¡Los rodillos están girando!`);
        const resultado = this.girarRodillos();
        const coincidencias = this.calcularCoincidencias(resultado);
        console.log(`Resultado: ${resultado.join(` | `)}`);
        this.mostrarPremio(coincidencias, usuario);
    }

    protected girarRodillos(): string[] {
        const resultados: string[] = [];
        for (let i = 0; i < 3; i++) {
            const indiceAleatorio = Math.floor(Math.random() * this.rodillos.length);
            resultados.push(this.rodillos[indiceAleatorio]);
        }
        return resultados;
    }

    protected calcularCoincidencias(resultado: string[]): number {
        return resultado.filter((emoji) => emoji === this.emojiFavorito).length;
    }

    protected abstract mostrarPremio(coincidencias: number, usuario: Usuario): void;
}

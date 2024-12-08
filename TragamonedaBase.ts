import { Juego } from "./Juego";
import { Usuario } from "./Usuario";
import { Util } from "./Util";
import * as rls from "readline-sync";

// Clase base para Tragamoneda
export abstract class TragamonedaBase extends Juego {
    protected rodillos: string[] = [];
    protected apuesta: number = 0;
    protected emojiFavorito: string = ``;
    protected creditosMinimos: number;

    constructor(nombre: string, creditosMinimos: number) {
        super(nombre);
        this.creditosMinimos = creditosMinimos;
    }

    public jugar(usuario: Usuario): void {
        if (!usuario) {
            throw new Error(`Error: Usuario indefinido.`);
        }

        if (usuario.getCreditos() < this.creditosMinimos) {
            throw new Error(`Error: Creditos insuficientes.`);
        }

        this.mostrarInstrucciones([{ clave: '$<NOMBRE_USUARIO>', valor: usuario.getNombre() },
        { clave: '$<CREDITOS>', valor: Util.convertirAPesosAR(usuario.getCreditos()) },
        { clave: '$<NOMBRE_JUEGO>', valor: this.getNombre() }
        ]);

        while (true) {
            console.log(` Estas listo para comenzar el juego?`);
            const comenzar = rls.question(`Escribe 's' para iniciar o 'n' para terminar: `).toLowerCase();

            if (comenzar == `s`) {
                this.establecerApuesta(usuario);
                this.elegirEmoji();
                this.IniciarJuego(usuario);

                if (usuario.getCreditos() < this.creditosMinimos) {
                    console.log(`No tienes suficientes creditos para jugar.`);
                    rls.keyInPause(`Presione cualquier tecla para continuar...`, {
                        guide: false,
                    });
                    break;
                }
            } else if (comenzar == `n`) {
                console.log(`¡Gracias por jugar!`);
                rls.keyInPause(`Presione cualquier tecla para continuar...`, {
                    guide: false,
                });
                break;
            } else {
                console.error(`Por favor, escribe una opcion valida.`);
            }
        }
    }

    protected establecerApuesta(usuario: Usuario): void {
        while (true) {
            const apuestaIngresada = rls.question(`Ingresa tu apuesta (minimo ${this.creditosMinimos} creditos): `);
            const apuesta = parseInt(apuestaIngresada);

            if (!isNaN(apuesta) && apuesta >= this.creditosMinimos && apuesta <= usuario.getCreditos()) {
                this.apuesta = apuesta;
                usuario.setCreditos(-apuesta);
                console.log(`Has apostado ${apuesta} creditos.`);
                break;
            } else {
                console.error(
                    `Por favor, ingresa un valor valido entre ${this.creditosMinimos} y tus creditos disponibles (${usuario.getCreditos()}).`
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
                console.error(`Por favor, selecciona un número valido.`);
            }
        }
    }

    protected IniciarJuego(usuario: Usuario): void {
        console.log(`¡Los rodillos estan girando!`);
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

import { Juego } from "./Juego";
import { Usuario } from "./Usuario";
import { IJuego } from "./IJuego";
import * as rls from "readline-sync";

// Definimos un valor mínimo de créditos para poder jugar
const CREDITOS_MINIMOS: number = 100;

export class RuedaFortuna extends Juego implements IJuego {
    public nombreJuego: string = "Rueda de Fortuna";
    private ruleta: string[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    private apuesta: number = 0;
    private numeroFavorito: string = ``;

    // Constructor que toma el nombre del juego y lo pasa al constructor de la clase base
    constructor(nombre: string) {
        super(nombre); // Llama al constructor de la clase base (Juego) con el nombre del juego
    }

    // Sobreescribe el método jugar de la clase para implementar la lógica de este juego
    public jugar(usuario: Usuario): void {
        // 
        if (!usuario) {
            throw new Error("Error: Usuario indefinido.");
        }

        // Verifica si los créditos disponibles en la sesión son suficientes para poder jugar
        if (usuario.getCreditos() < CREDITOS_MINIMOS) {
            // Si los créditos son insuficientes, lanza un error
            throw new Error("Error: Créditos insuficientes.");
        }

        // Si todo es válido, muestra un mensaje de bienvenida al usuario
        console.log(`Bienvenido ${usuario.getNombre()} al juego de ${this.nombreJuego}`);

        // Muestra la cantidad de créditos actuales de la sesión, formateados con 2 decimales
        console.log(
            `Créditos actuales: ${usuario.getCreditos().toLocaleString("es-AR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}`
        );

        //Ejecucion del juego
        while (true) {
            console.log(`\nEstás listo para comenzar el juego?`);

            const comenzar = rls.question(`Escribe 's' para iniciar o 'n' para terminar: `).toLowerCase();
            if (comenzar === "s") {
                this.establecerApuesta(usuario);
                this.elegirBlanco();
                this.IniciarJuego(usuario);
                if (usuario.getCreditos() < CREDITOS_MINIMOS) {
                    console.log(`No tienes suficientes créditos para jugar.`);
                    rls.keyInPause("Presione cualquier tecla para continuar...", {
                        guide: false,
                    });
                    break;

                }
            } else if (comenzar === "n") {
                console.log(`¡Gracias por jugar!`);
                break;
            } else {
                console.error(`Por favor, escribe una opción válida.`);
            }
        }
    }

    private establecerApuesta(usuario: Usuario): void {
        while (true) {
            const apuestaIngresada = rls.question(`Ingresa tu apuesta (mínimo 100 créditos): `);
            const apuesta = parseInt(apuestaIngresada);

            if (!isNaN(apuesta) && apuesta >= 50 && apuesta <= usuario.getCreditos()) {
                this.apuesta = apuesta;
                usuario.setCreditos(- apuesta);
                console.log(`Has apostado ${apuesta} créditos.`);
                break;
            } else {
                console.error(`Por favor, ingresa un valor válido entre 100 y tus créditos disponibles (${usuario.getCreditos()}).`);
            }
        }

    }

    private elegirBlanco(): void {
        console.log(`Elige tu apuesta entre 10 posibles premios`);
        this.ruleta.forEach((blanco, index) => {
            console.log(`${index + 1}. ${blanco}`);
        });

        while (true) {
            const seleccion = rls.question(`Ingresa su eleccion: `);
            const indice = parseInt(seleccion) - 1;

            if (!isNaN(indice) && indice >= 0 && indice < this.ruleta.length) {
                this.numeroFavorito = this.ruleta[indice];
                console.log(`Has elegido: ${this.numeroFavorito}`);
                break;
            } else {
                console.error(`Por favor, selecciona un número válido.`);
            }
        }
    }

    private IniciarJuego(usuario: Usuario): void {
        console.log(`¡La rueda está girando!`);
        const resultado = this.girarRuleta();
        const coincidencia = this.calcularCoincidencia(resultado);
        console.log(`Resultado: ${resultado.join(` | `)}`);
        this.mostrarPremio(coincidencia, usuario);
    }

    private girarRuleta(): string[] {
        const resultados: string[] = [];
        for (let i = 0; i < 1; i++) {
            const indiceAleatorio = Math.floor(Math.random() * this.ruleta.length);
            resultados.push(this.ruleta[indiceAleatorio]);
        }
        return resultados;
    }

    private calcularCoincidencia(resultado: string[]): number {
        const coincidencias = resultado.filter((blanco) => blanco === this.numeroFavorito).length;
        return coincidencias;
    }


    private mostrarPremio(coincidencias: number, usuario: Usuario): void {
        let premio: number = 0; // Variable local para el premio en esta jugada

        if (coincidencias === 3) {
            premio = this.apuesta * 15;
            console.log(`¡Felicidades! tu apuesta vale por 3.`);
        } else if (coincidencias === 2) {
            premio = this.apuesta * 6;
            console.log(`¡Felicidades! tu apuesta vale por 2.`);
        } else if (coincidencias === 1) {
            premio = this.apuesta * 2; // Duplica apuesta
            console.log(`¡Felicidades! tu apuesta vale por 1.`);
        } else {
            console.log(`No hubo coincidencias esta vez.`);
        }
        usuario.setCreditos(+ premio); // Sumamos el premio (si hubo)
        console.log(`Tu premio es: ${premio} créditos.`);
        console.log(
            `Saldo final: ${usuario.getCreditos().toLocaleString("es-AR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}`);
    }
}
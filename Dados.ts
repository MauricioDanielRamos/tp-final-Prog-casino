import { Juego } from "./Juego";
import { Usuario } from "./Usuario";
import * as rls from "readline-sync";

// Valor mínimo de créditos para jugar
const CREDITOS_MINIMOS: number = 50;


export class Dados extends Juego {
    constructor() {
        super("Juego de Dados");
    }

    // Genera un número aleatorio entre 1 y 6
    private lanzarDado(): number {
        return Math.floor(Math.random() * 6) + 1;
    }

    public jugar(usuario: Usuario): void {
        if (!usuario) {
            throw new Error("Error: Usuario indefinido.");
        }

        // Verifica si el usuario tiene créditos suficientes
        if (usuario.getCreditos() < CREDITOS_MINIMOS) {
            throw new Error("Error: Créditos insuficientes para jugar.");
        }

        // Muestra la información del jugador al iniciar del juego
        console.log(`Bienvenido ${usuario.getNombre()} al ${this.getNombre()}`);
        console.log(
            `Créditos actuales: ${usuario.getCreditos().toLocaleString("es-AR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}`
        );

        // Confirmación de la apuesta
        const apuesta = parseInt(
            rls.question(`Ingrese la cantidad a apostar (mínimo ${CREDITOS_MINIMOS} créditos): `),
            10
        );

        if (isNaN(apuesta) || apuesta < CREDITOS_MINIMOS || apuesta > usuario.getCreditos()) {
            console.log("Apuesta inválida. Inténtalo de nuevo.");
            return;
        }

        // Genera el lanzamiento de los dados
        console.log("Lanzando los dados...");
        const dado1 = this.lanzarDado();
        const dado2 = this.lanzarDado();
        const suma = dado1 + dado2;

        console.log(`Resultados de los dados: ${dado1} y ${dado2}. Suma: ${suma}`);

        // Muestra el resultado del juego
        if (suma === 7) {
            console.log("¡Felicidades! Ganaste.");
            usuario.setCreditos(apuesta);
        } else {
            console.log("Perdiste. Mejor suerte la próxima vez.");
            usuario.setCreditos(-apuesta);
        }

        // Muestra los créditos restantes
        console.log(  `Créditos actuales: ${usuario.getCreditos().toLocaleString("es-AR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}`
        );

        // Pausar antes de salir
        rls.keyInPause("Presione cualquier tecla para continuar...", {
            guide: false,
        });
    }
}
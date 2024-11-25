import { Juego } from "./Juego";
import { Usuario } from "./Usuario";
import * as rls from "readline-sync";

// Definimos un valor mínimo de créditos para poder jugar
const CREDITOS_MINIMOS: number = 50;

export class TragaMoneda extends Juego {
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
        console.log(`Bienvenido ${usuario.getNombre()}`);

        // Muestra la cantidad de créditos actuales de la sesión, formateados con 2 decimales
        console.log(
            `Créditos actuales: ${usuario.getCreditos().toLocaleString("es-AR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}`
        );

        console.log(); //Imprime una línea en blanco para mejorar la legibilidad

        // Muestra información sobre el juego que se está ejecutando
        console.info(
            `Ejecutando prueba de juego conceptual ${this.getNombre()}`
        );

        rls.keyInPause("Presione cualquier tecla para continuar...", {
            guide: false,
        });
    }
}
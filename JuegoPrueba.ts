import { Juego } from "./Juego";
import { Usuario } from "./Usuario";
import * as rls from "readline-sync";

// Definimos un valor mínimo de créditos para poder jugar
const CREDITOS_MINIMOS: number = 50;

export class JuegoPrueba extends Juego {
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

		this.mostrarInstrucciones([{clave: "$<NOMBRE_USUARIO>", valor: usuario.getNombre()},
								   {clave: "$<CREDITOS>", valor: usuario.getCreditos()},
								   {clave: "$<NOMBRE_JUEGO>", valor: this.getNombre()}								   
								  ]);

		rls.keyInPause("Presione cualquier tecla para continuar...", {
			guide: false,
		});
	}
}

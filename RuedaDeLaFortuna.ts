import * as rls from "readline-sync";
import { Juego } from "./Juego";
import { Usuario } from "./Usuario";
import { Util } from "./Util";

const CREDITOS_MINIMOS: number = 1000;
const PREMIOS: string[] = [
	// Premios de la rueda de la fortuna
	"¡Perdiste!",
	"¡Un Automovil 0km!",
	"¡Perdiste!",
	"¡Una Moto 250cc ENDURO!",
	"¡Perdiste!",
	"¡Perdiste!",
	"¡Perdiste!",
	"¡Un Viaje a Brasil!",
	"100",
	"200",
	"500",
	"900",
];

// Clase Rueda de la fortuna
export class RuedaDeLaFortuna extends Juego {
	private premios: string[] = PREMIOS;

	// Constructor
	constructor(nombre: string) {
		super(nombre); //Llama al constructor de la clase base Juego
	}

	// Función que muestra los creditos actuales del usuario en la consola
	private mostrarCreditos(usuario: Usuario): void {
		console.log(
			`Creditos actuales: ${Util.convertirAPesosAR(
				usuario.getCreditos()
			)}`
		);
	}

	// Funcion que obtiene un resultado aleatorio de los premios
	private obtenerResultado(): string {
		//Selecciona un Indice aleatorio
		const indice = Math.floor(Math.random() * this.premios.length);
		// Devuelve el premio correspondiente a ese indice
		return this.premios[indice];
	}

	// Función principal para iniciar el juego
	public jugar(usuario: Usuario): void {
		let salir = false;
		while (!salir) {
			console.clear();
			this.mostrarInstrucciones([
				{ clave: "$<NOMBRE_USUARIO>", valor: usuario.getNombre() },
				{
					clave: "$<CREDITOS>",
					valor: Util.convertirAPesosAR(usuario.getCreditos()),
				},
				{ clave: "$<NOMBRE_JUEGO>", valor: this.getNombre() },
				{ clave: "$<TIRADA>", valor: Util.convertirAPesosAR(CREDITOS_MINIMOS) },
			]);
			// Verifica si el usurio está definido, si no lo está, muestra un error
			if (!usuario) {
				console.log("Error: Usuario no definido.");
				// Pausa para que el usuario lea el mensaje antes de continuar
				rls.keyInPause("Presione una tecla para continuar", {
					guide: false,
				});
				salir = true;
			}

			// Verifica si el usuario tiene suficientos creditos para jugar
			if (usuario.getCreditos() < CREDITOS_MINIMOS) {
				//Muestra los creditos actuales
				this.mostrarCreditos(usuario);
				console.log(
					`No tienes suficientes creditos para jugar. Los creditos minimos para este juego son: ${Util.convertirAPesosAR(
						CREDITOS_MINIMOS
					)} `
				);
				// Pausa para que el usuario lea el mensaje antes de continuar
				rls.keyInPause("Presione una tecla para continuar", {
					guide: false,
				});
				// Termina la ejecución de la función si los creditos sin insuficientes
				salir = true;
			}

			// Muestra los premios posibles
			console.log("Premios posibles:");
			this.premios.forEach((premio, index) =>
				console.log(`${index + 1}. ${premio}`)
			);

			// Llama a la función para realizar la tirada de la ruleta
			if (!salir) {
				const opciones = ["Si", "No"];
				// Pregunta al usuario si desea hacer la tirada
				const eleccion: number = rls.keyInSelect(opciones, "¿Presione [1] para girar la rueda [2] para salir? ", {
					guide: false,
					cancel: false,
				});
				switch (eleccion) {
					case 0: this.realizarTirada(usuario);
						break;
					case 1: salir = true;
						break;
				}
			}
		}
		// Si el usuario elige "No", termina el juego
		console.log("Gracias por jugar. ¡Hasta la proxima!");
		// Pausa antes de finalizar
		rls.keyInPause("Presione una tecla para continuar", {
			guide: false,
		});
	}

	// Funcion para manejar la lógica de la tirada del juego
	private realizarTirada(usuario: Usuario): void {
		// Si el usuario tiene créditos suficientes, se le descuentan los creditos por la tirada
		usuario.setCreditos(-CREDITOS_MINIMOS);
		// Limpia la consola para mostrar el resultado
		console.clear();
		console.log("Girando la rueda...");

		// Obtiene el resultado de la rueda
		const resultado = this.obtenerResultado();
		console.log(`Resultado: ${resultado}`);

		// Si el resultado es "¡Perdiste!", muestra un mensaje
		if (resultado === "¡Perdiste!") {
			console.log("Mejor suerte la proxima vez.");
		} else if (!isNaN(parseFloat(resultado))) {
			// Si el resultado es un número, se suman los creditos obtenidos
			const premio = parseFloat(resultado);
			usuario.setCreditos(premio);
			console.log(
				`¡Felicitaciones! Ganaste ${Util.convertirAPesosAR(
					premio
				)} en creditos.`);
		} else {
			// Si el resultado es un premio en texto, muestra el premio
			console.log(`¡Felicitaciones! Ganaste: ${resultado}`);
		}
		rls.keyInPause("Presione una tecla para continuar", {
			guide: false,
		});
	}
}

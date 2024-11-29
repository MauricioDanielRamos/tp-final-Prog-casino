import * as rls from "readline-sync";
import { Juego } from "./Juego";
import { Usuario } from "./Usuario";
import { Util } from "./Util";

// Clase Rueda de la fortuna
export class RuedaDeLaFortuna extends Juego {
	private premios: string[] = [
		// Premios de la rueda de la fortuna
		"¡Perdiste!",
		"¡Un Automóvil 0km!",
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
	private creditosMinimos = 1000; // Valor minimo de la tirada

	// Constructor
	constructor(nombre: string) {
		super(nombre); //Llama al constructor de la clase base Juego
	}

	// Función que muestra los creditos actuales del usuario en la consola
	private mostrarCreditos(usuario: Usuario): void {
		console.log(
			`Créditos actuales: ${Util.convertirAPesosAR(
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
		// Verifica si el usurio está definido, si no lo está, muestra un error
		if (!usuario) {
			console.log("Error: Usuario no definido.");
			// Pausa para que el usuario lea el mensaje antes de continuar
			rls.keyInPause("Presione una tecla para continuar", {
				guide: false,
			});
		}

		// Verifica si el usuario tiene suficientos créditos para jugar
		if (usuario.getCreditos() < this.creditosMinimos) {
			//Muestra los creditos actuales
			this.mostrarCreditos(usuario);
			console.log(
				`No tienes suficientes créditos para jugar. Los créditos mínimos para este juego son: ${Util.convertirAPesosAR(
					this.creditosMinimos
				)} `
			);
			// Pausa para que el usuario lea el mensaje antes de continuar
			rls.keyInPause("Presione una tecla para continuar", {
				guide: false,
			});
			// Termina la ejecución de la función si los créditos son insuficientes
			return;
		}

		// Limpia la consola y da la bienvenida al usuario
		console.clear();
		console.log(
			`\nBienvenido/a ${usuario.getNombre()} a la ${this.getNombre()}`
		);
		// Muestra los premios posibles
		console.log("\nPremios posibles:");
		this.premios.forEach((premio, index) =>
			console.log(`${index + 1}. ${premio}`)
		);

		// Llama a la función para realizar la tirada de la ruleta
		this.realizarTirada(usuario);
	}

	// Funcion para manejar la lógica de la tirada del juego
	private realizarTirada(usuario: Usuario): void {
		// Verifica si el usuario tiene suficientes créditos para realizar una tirada
		if (usuario.getCreditos() < this.creditosMinimos) {
			console.log("\nNo tienes más créditos para realizar una tirada.");
			// Pausa para que el usuario lea el mensaje antes de continuar
			rls.keyInPause("Presione una tecla para continuar", {
				guide: false,
			});
			// Termina la ejecución de la función si no tiene los créditos suficientes
			return;
		}

		// Muestra el costo de la tirada
		console.log(`\nTirada: $1000`);
		// Muestra los créditos actuales antes de hacer la tirada
		this.mostrarCreditos(usuario);
		// Opciones que el usuario puede seleccionar (Sí o No)
		const opciones = ["Sí", "No"];
		// Pregunta al usuario si desea hacer la tirada
		const eleccion = rls.keyInSelect(opciones, "¿Desea hacer un tiro? ", {
			guide: false,
			cancel: false,
		});

		// Si el usuario elige "Sí" (elección 0)
		if (eleccion === 0) {
			// Verifica nuevamente si el usuario tiene los créditos suficientes antes de continuar
			if (usuario.getCreditos() < this.creditosMinimos) {
				console.log(
					`Error: Créditos insuficientes para realizar la tirada. Tienes ${usuario.getCreditos()} Créditos`
				);
				// Pausa antes de finalizar
				rls.keyInPause("Presione una tecla para continuar", {
					guide: false,
				});
				return;
			} else {
				// Si el usuario tiene créditos suficientes, se le descuentan los créditos por la tirada
				usuario.setCreditos(-this.creditosMinimos);
				// Limpia la consola para mostrar el resultado
				console.clear();
				console.log("\nGirando la rueda...");

				// Obtiene el resultado de la rueda
				const resultado = this.obtenerResultado();
				console.log(`Resultado: ${resultado}`);

				// Si el resultado es "¡Perdiste!", muestra un mensaje
				if (resultado === "¡Perdiste!") {
					console.log("Mejor suerte la próxima vez.");
				} else if (!isNaN(parseFloat(resultado))) {
					// Si el resultado es un número, se suman los créditos obtenidos
					const premio = parseFloat(resultado);
					usuario.setCreditos(premio);
					console.log(
						`¡Felicitaciones! Ganaste ${Util.convertirAPesosAR(
							premio
						)} en créditos.`
					);
				} else {
					// Si el resultado es un premio en texto, muestra el premio
					console.log(`¡Felicitaciones! Ganaste: ${resultado}`);
				}

				// Muestra los créditos actuales del usuario despues de la tirada
				this.mostrarCreditos(usuario);

				// Verificar si el usuario tiene suficientes créditos para seguir jugando
				if (usuario.getCreditos() < this.creditosMinimos) {
					console.log(
						"\nNo tienes suficientes créditos para realizar otra tirada."
					);
					// Pausa antes de finalizar
					rls.keyInPause("Presione una tecla para continuar", {
						guide: false,
					});
					return;
				}

				// Preguntar si desea seguir jugando
				const continuar = rls.keyInSelect(
					opciones,
					"¿Desea seguir jugando?",
					{ cancel: false, guide: false }
				);
				// Si el usuario elige "Si", se realiza otra tirada
				if (continuar === 0) {
					this.realizarTirada(usuario); // Llamada recursiva para otra tirada
				} else {
					// Si el usuario elige "No", termina el juego
					console.log("\nGracias por jugar. ¡Hasta la próxima!");
					// Pausa antes de finalizar
					rls.keyInPause("Presione una tecla para continuar", {
						guide: false,
					});
				}
			}
		} else {
			// Si el usuario elige "No", termina el juego
			console.log("\nGracias por jugar. ¡Hasta la próxima!");
		}
	}
}

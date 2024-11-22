import { Juego } from "./Juego";
import { Sesion } from "./Sesion";

import * as rls from "readline-sync";

//Implementación de la clase SesionCasino
export class Casino {
	private juegos: Juego[]; // Lista de juegos disponibles en el casino
	private sesion: Sesion; // Objeto para gestionar sesiones de usuario
	private nombre: string; // nombre del casino

	// Constructor de la clase SesionCasino
	constructor(nombre: string, juegos: Juego[]) {
		// Valida que el nombre del casino sea válido
		if (nombre == undefined || nombre.length < 1) {
			throw new Error("Nombre no válido.");
		}
		this.nombre = nombre;
		this.juegos = juegos;
		this.sesion = new Sesion();
	}

	// Retorna el nombre de la sesión
	public getNombre(): string {
		return this.nombre;
	}

	//Muestra una guía que indica al usuario como jugar en el Casino
	private mostrarInstrucciones() {
		console.clear(); // Limpia la consola para mostrar solo las instrucciones
		console.log("╔════════════════════════════════════════════════╗");
		console.log("║          Guía para jugar en el Casino          ║");
		console.log("╚════════════════════════════════════════════════╝");
		console.log(`
        Bienvenido a ${this.getNombre()}
      
        Para comenzar a jugar, siga estos pasos:
        
            1. Ingrese su nombre de usuario.
            2. Cargue créditos para jugar.
            3. Seleccione el juego de su preferencia.
            4. Siga las instrucciones del juego elegido.
      
        ¡Disfrute y buena suerte!
        `);
		console.log("══════════════════════════════════════════════════");
	}

	//Muestra el Menú Principal
	public mostrarMenu(): void {
		const menuPrincipal: string[] = [
			// Opciones del menú principal
			"CONFIGURACION DE USUARIO",
			"CARGA O RETIRO DE CREDITO",
			"JUEGOS DISPONIBLES",
			"SALIR",
		];
		let opcion: number = -1;
		while (opcion !== 3) {
			// Repite hasta que se seleccione la opción de salir
			try {
				console.clear();
				this.mostrarInstrucciones(); // Mostrar las instrucciones

				opcion = rls.keyInSelect(menuPrincipal, "Opción: ", {
					guide: false,
					cancel: false,
				});
				switch (
					opcion // Ejecuta acciones basadas en la opción seleccionada
				) {
					case 0:
						// Configuración de usuarios
						this.configurarNombreUsuario();
						break;
					case 1:
						// Carga o retiro de Créditos
						this.solicitarMonto();
						break;
					case 2:
						// Muestra la lista de Juegos Disponibles en el casino para jugar
						this.menuJuegos();
						break;
				}
			} catch (error) {
				// Captura errores durante la ejecución del menú
				console.error(
					`${(error as Error).name}: ${(error as Error).message}`
				);
				rls.keyInPause("Presione cualquier tecla para continuar...", {
					guide: false, // Pausa antes del volver al menú
				});
			}
		}
	}

	// Funcion para solicitar el nombre de usuario
	private configurarNombreUsuario(): void {
		let opcion: number = -1;

		while (opcion !== 2) {
			// Repite hasta que la opción sea "VOLVER" (indice 2)
			console.clear();
			console.log("╔═══════════════════════════════════════╗");
			console.log("║       Configuración de Usuario        ║");
			console.log("╚═══════════════════════════════════════╝");

			// Mostrar lista de usuarios registrados
			const usuarios = this.sesion.getUsuarios(); // Obtiene la lista de usuarios actuales
			if (usuarios.length > 0) {
				// Verifica si hay usuarios configurados
				console.log("Usuarios configurados:");
				usuarios.forEach(({ id, nombre }) => {
					console.log(`  ID: ${id} - Nombre: ${nombre}`);
				}); // Lista los usuarios con su ID y su nombre
			} else {
				console.log("No hay usuarios configurados."); // Mensaje si no hay usuarios
			}

			// Opciones del submenú
			const opciones = [
				"AGREGAR UN USUARIO",
				"ELIMINAR UN USUARIO",
				"VOLVER",
			];
			opcion = rls.keyInSelect(opciones, "Seleccione una opción: ", {
				guide: false,
				cancel: false,
			});

			switch (opcion) {
				case 0: // Agregar un nuevo usuario
					try {
						// Solicita el nombre para un nuevo usuario
						const nuevoNombre = rls.question(
							"Ingrese el nombre del nuevo usuario: "
						);

						// Agrega al usuario usando el método de la clase Sesión
						this.sesion.agregarUsuario(nuevoNombre);
						console.log(
							`¡Usuario "${nuevoNombre}" agregado con éxito!`
						); // Mensaje de confirmación si se agrego correctamente
					} catch (error) {
						// Maneja errores de validación
						console.error(`${(error as Error).message}`);
						rls.keyInPause(
							"Presione cualquier tecla para continuar...",
							{ guide: false, cancel: false }
						);
					}
					break;

				case 1: // Eliminar un usuario
					// Verifica que haya usuarios para eliminar
					if (usuarios.length > 0) {
						try {
							// Solicita el ID del usuario
							const idEliminar = rls.questionInt(
								"Ingrese el ID del usuario a eliminar: "
							);

							// Elimina al usuario con el ID especificado
							this.sesion.eliminarUsuarioPorId(idEliminar);
							console.log(
								`¡Usuario con ID ${idEliminar} eliminado con éxito!` //Mensaje de confirmación
							);
							rls.keyInPause(
								"Presione cualquier tecla para continuar...",
								{ guide: false }
							);
						} catch (error) {
							// Maneja errores en la eliminación
							console.error(`${(error as Error).message}`);
							rls.keyInPause(
								"Presione cualquier tecla para continuar...",
								{ guide: false }
							);
						}
					} else {
						// Mensaje si no hay usuarios para eliminar
						console.log("No hay usuarios para eliminar.");
						rls.keyInPause(
							"Presione cualquier tecla para continuar...",
							{ guide: false }
						);
					}
					break;

				case 2: // Volver al menú principal
					break;
			}
		}
	}

	// Función para solicitar el monto de crédito o retiro
	private solicitarMonto(): void {
		console.clear();
		console.log("╔═════════════════════════════════════════════╗");
		console.log("║       Cargar o Retirar Monto de Dinero      ║");
		console.log("╚═════════════════════════════════════════════╝");

		const usuarios = this.sesion.getUsuarios(); //Obtener la lista de usuarios desde la sesion
		if (usuarios.length === 0) {
			// Verifica si hay usuarios registrados
			console.log(
				// Muestra mensaje si no hay usuarios registrados
				"No hay usuarios registrados. Agregue un usuario primero."
			);
			rls.keyInPause("Presione cualquier tecla para continuar...", {
				guide: false,
			});
			return; // Sale de la función si no hay usuarios
		}

		// Mostrar usuarios registrados con su ID , nombre y créditos disponibles
		console.log("Usuarios registrados:");
		usuarios.forEach(({ id, nombre, creditos }) => {
			console.log(
				`  ID: ${id} - Nombre: ${nombre} - Créditos: $${creditos.toLocaleString(
					"es-AR",
					{
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					}
				)} ARS` // Formatea los créditos en 2 decimales y Pesos ARS
			);
		});

		// Presenta opciones al usuario para cargar, retirar créditos o volver
		const opciones = ["Cargar Crédito", "Retirar Crédito", "Volver"];
		const opcion = rls.keyInSelect(opciones, "Seleccione una opción: ", {
			guide: false,
			cancel: false,
		});

		switch (opcion) {
			case 0: // Cargar crédito
				this.cargarCredito(usuarios);
				break;

			case 1: // Retirar crédito
				this.retirarCredito(usuarios);
				break;

			case 2: // Volver al menú anterior
				return;
		}
	}

	// Función para retirar crédito de un usuario
	private retirarCredito(
		usuarios: { id: number; nombre: string; creditos: number }[]
	): void {
		try {
			// Solicita el ID del usuario
			const idUsuario = rls.questionInt(
				"Ingrese el ID del usuario del que desea retirar crédito: "
			);

			// Solicita el monto a retirar
			const monto = rls.questionFloat("Ingrese el monto a retirar: ");

			// Verifica que el monto sea mayor a 0
			if (monto <= 0) {
				// Lanza un error si el monto es inválido
				throw new Error("El monto debe ser mayor a cero.");
			}

			// Busca al usuario con el ID proporcionado
			const usuario = usuarios.find((u) => u.id === idUsuario);
			// Verificar si el usuario existe
			if (!usuario) {
				throw new Error(
					`No se encontró un usuario con el ID ${idUsuario}.`
				);
			}

			// Realiza el retiro de crédito utilizando el metedo setCreditos
			this.sesion.setCreditos(idUsuario, -monto); // Reduce el monto en los creditos del usurio
			console.log(
				`¡Retiro exitoso! Se han retirado $${monto.toLocaleString(
					"es-AR",
					{
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					}
				)} ARS del usuario con ID ${idUsuario}.` // Muestra confirmación
			);
			rls.keyInPause("Presione cualquier tecla para continuar...", {
				guide: false,
			});
			this.solicitarMonto(); // Vuelve al menú de créditos
		} catch (error) {
			// Maneja errores durante el proceso
			console.error(`${(error as Error).message}`);
			rls.keyInPause("Presione cualquier tecla para continuar...", {
				guide: false,
			});
			this.solicitarMonto(); // Vuelve al menú de créditos
		}
		return; // Finaliza la función
	}

	// Función para cargar créditos a un usuario
	private cargarCredito(
		usuarios: { id: number; nombre: string; creditos: number }[]
	): void {
		try {
			// Solicita el ID a el usuario
			const idUsuario = rls.questionInt(
				"Ingrese el ID del usuario al que desea cargar crédito: "
			);
			// Solicita el monto
			const monto = rls.questionFloat("Ingrese el monto a cargar: ");

			// Verifica que el monto sea mayor a 0
			if (monto <= 0) {
				// Lanza un error si el monto es inválido
				throw new Error("El monto debe ser mayor a cero.");
			}

			// Busca el usuario con el ID proporcionado
			const usuario = usuarios.find((u) => u.id === idUsuario);
			// Verificar si el usuario existe
			if (!usuario) {
				throw new Error(
					`No se encontró un usuario con el ID ${idUsuario}.`
				);
			}

			// Agrega el monto a los créditos del usuario
			this.sesion.setCreditos(idUsuario, monto); // Incrementa los créditos del usuario
			console.log(
				`¡Carga Exitosa! Se han cargado $${monto.toLocaleString(
					"es-AR",
					{
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					}
				)} ARS al usuario con ID ${idUsuario}.` // Muestra la confirmación
			);
			rls.keyInPause("Presione cualquier tecla para continuar...", {
				guide: false,
			});
			this.solicitarMonto(); // Vuelve al menú de créditos
		} catch (error) {
			// Maneja errores durante el proceso
			console.error(`${(error as Error).message}`);
			rls.keyInPause("Presione cualquier tecla para continuar...", {
				guide: false,
			});
			this.solicitarMonto(); // Vuelve al menú de créditos
		}
	}

	/* 
        Muestra un menú generado dinámicamente con los nombres del arreglo de juegos
        y ejecuta el juego seleccionado o vuelve al menú anterior de acuerdo a la 
        selección del usuario
    */
	// Función para mostrar un menú con los juegos disponibles
	private menuJuegos(): void {
		// Crea un arreglo con los nombres de los juegos cargados en el Casino
		const menuJuegos: string[] = this.juegos.flatMap((juego) =>
			juego.getNombre()
		);
		// Agrega una opcion para volver al menú anterior
		menuJuegos.push("VOLVER");

		let opcionJuegos: number = -1;
		//Repite hasta que se elija la útima opción (VOLVER)
		while (opcionJuegos !== menuJuegos.length - 1) {
			console.clear();
			opcionJuegos = rls.keyInSelect(menuJuegos, "Opción: ", {
				guide: false,
				cancel: false,
			});

			// Si no se elige la opción "Volver", inicia el juego seleccionado
			if (opcionJuegos !== menuJuegos.length - 1) {
				this.juegos[opcionJuegos].jugar(this.sesion); // Llama al método jugar del juego seleccionado, pasándole la sesión actual
			}
		}
	}
}

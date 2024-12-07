import { Juego } from "./Juego";
import { Sesion } from "./Sesion";
import { Usuario } from "./Usuario";
import { Util, ParValorClave } from "./Util";
import * as rls from "readline-sync";

//Implementación de la clase SesionCasino
export class Casino {
	private nombre: string; // nombre del casino
	private juegos: Juego[]; // Lista de juegos disponibles en el casino
	private sesion: Sesion;
	//private sesion: Sesion; // Objeto para gestionar sesiones de usuario

	// Constructor de la clase SesionCasino
	constructor(nombre: string, juegos: Juego[]) {
		// Valida que el nombre del casino sea válido
		if (nombre == undefined || nombre.length < 1) {
			throw new Error("Nombre no valido.");
		}
		this.nombre = nombre;
		this.juegos = juegos;        //Falta validar acá
		this.sesion = new Sesion();
	}

	// Retorna el nombre del Casino
	public getNombre(): string {
		return this.nombre;
	}

	//Muestra una guía que indica al usuario como jugar en el Casino
	private mostrarInstrucciones(reemplazos?: ParValorClave[]) {
		console.log(Util.leerArchivo(`./assets/${this.constructor.name}.ins`, reemplazos));
	}

	//Muestra el Menú Principal
	public mostrarMenu(): void {
		const menuPrincipal: string[] = [
			// Opciones del menú principal
			"Menu de Usuarios",
			"Juegos Disponibles",
			"Salir",
		];
		let opcion: number = -1;
		while (opcion !== 2) {
			// Repite hasta que se seleccione la opción de salir
			try {
				console.clear();
				this.mostrarInstrucciones([{ clave: '$<NOMBRE>', valor: this.nombre }]); // Mostrar las instrucciones

				opcion = rls.keyInSelect(menuPrincipal, "Opcion: ", {
					guide: false,
					cancel: false,
				});
				switch (
				opcion // Ejecuta acciones basadas en la opcion seleccionada
				) {
					case 0: this.menuUsuarios(); break;
					case 1:
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
	private menuUsuarios(): void {
		let opcion: number = -1;

		while (opcion !== 3) {
			// Repite hasta que la opción sea "VOLVER" (indice 2)
			console.clear();
			console.log("╔═══════════════════════════════════════╗");
			console.log("║       Configuración de Usuario        ║");
			console.log("╚═══════════════════════════════════════╝");

			// Mostrar lista de usuarios registrados
			if (this.sesion.getCantUsuarios() > 0) {
				// Verifica si hay usuarios configurados
				console.log("Usuarios configurados:");
				this.sesion.imprimirListadoUsuarios();
			} else {
				console.error(
					// Muestra mensaje si no hay usuarios registrados
					"No hay usuarios registrados. Agregue un usuario primero."
				);
			}

			// Opciones del submenú
			const opciones = [
				"Agregar Usuario",
				"Eliminar Usuario",
				"Cargar/Retirar Credito",
				"Volver",
			];
			opcion = rls.keyInSelect(opciones, "Seleccione una opcion: ", {
				guide: false,
				cancel: false,
			});

			switch (opcion) {
				case 0:
					this.agregarUsuario();
					opcion = 3;
					break;
				case 1:
					this.eliminarUsuario();
					break;
				case 2:
					this.menuSolicitarMonto();
					break;
			}
		}
	}

	// Agregar un nuevo usuario
	private agregarUsuario(): void {
		try {
			// Solicita el nombre para un nuevo usuario
			const nuevoNombre = rls.question(
				"Ingrese el nombre del nuevo usuario: "
			);

			// Agrega al usuario usando el método de la clase Sesión
			const usuario = this.sesion.agregarUsuario(nuevoNombre);
			// Mensaje de confirmación si se agrego correctamente
			console.log(`Usuario "${nuevoNombre}" agregado con exito!`);
			this.cargarCredito(usuario.getId());

		} catch (error) {
			// Maneja errores de validación
			console.error(`${(error as Error).message}`);
			rls.keyInPause(
				"Presione cualquier tecla para continuar...",
				{ guide: false, cancel: false }
			);
			this.agregarUsuario();
		}
	}

	// Función para solicitar el monto de credito o retiro
	private menuSolicitarMonto(): void {
		console.clear();
		console.log("╔═════════════════════════════════════════════╗");
		console.log("║       Cargar o Retirar Monto de Dinero      ║");
		console.log("╚═════════════════════════════════════════════╝");

		if (this.sesion.getCantUsuarios() === 0) {
			// Verifica si hay usuarios registrados
			console.error(
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
		this.sesion.imprimirListadoUsuarios();

		// Presenta opciones al usuario para cargar, retirar créditos o volver
		const opciones = ["Cargar Credito", "Retirar Credito", "Volver"];
		const opcion = rls.keyInSelect(opciones, "Seleccione una opcion: ", {
			guide: false,
			cancel: false,
		});

		switch (opcion) {
			case 0: // Cargar crédito
				this.cargarCredito();
				break;

			case 1: // Retirar crédito
				this.retirarCredito();
				break;

			case 2: // Volver al menú anterior
				return;
		}
	}

	// Función para retirar crédito de un usuario
	private retirarCredito(): void {
		try {
			// Si no se proporciona un ID como argumento
			let idUsuario: number = Util.solicitarID(
				"Ingrese el ID del usuario al que desea retirar créditos: "
			);

			// Busca al usuario con el ID proporcionado
			const usuario = this.sesion.getUsuario(idUsuario);

			let monto: number = Util.solicitarMonto(
				"Ingrese el monto a retirar: "
			);

			// Si el usuario es encontrado, realiza el retiro de crédito
			usuario?.setCreditos(-monto); // Aplica el retiro usando un monto negativo

			console.log(
				`¡Retiro Exitoso! Se han retirado ${Util.convertirAPesosAR(
					monto
				)} al jugador ${usuario.getNombre()}.` // Proporciona una confirmación al usuario
			);
			rls.keyInPause("Presione cualquier tecla para continuar...", {
				guide: false,
			});

			// Regresa al menú principal de créditos después de completar el retiro
			this.menuSolicitarMonto();
		} catch (error) {
			// Maneja cualquier error que ocurra en el proceso
			console.error(`${(error as Error).message}`);
			rls.keyInPause("Presione cualquier tecla para continuar...", {
				guide: false,
			});

			// Redirige al menú de créditos en caso de error
			this.menuSolicitarMonto();
		}
		return; // Finaliza la ejecución de la función
	}

	// Función para cargar créditos a un usuario
	private cargarCredito(idUsuario?: number): void {
		try {
			let entrePorID = false; // Bandera para determinar si la función fue llamada con un ID directo

			if (!idUsuario) {
				// Si no se proporciona un ID como argumento
				idUsuario = Util.solicitarID(
					"Ingrese el ID del usuario al que desea cargar créditos: "
				);
			} else {
				entrePorID = true;  // Indica que la función fue llamada con un ID predefinido
			}

			// Busca al usuario con el ID proporcionado
			const usuario = this.sesion.getUsuario(idUsuario);

			// Si no se encuentra un usuario con el ID, lanza un error
			if (!usuario) {
				throw new Error(
					`No se encontró un usuario con el ID ${idUsuario}.`
				);
			}
			let monto: number = Util.solicitarMonto(
				"Ingrese el monto a cargar: "
			);
			// Carga el monto al crédito del usuario
			usuario.setCreditos(monto); // Incrementa los créditos del usuario
			console.log(
				`¡Carga Exitosa! Se han cargado ${Util.convertirAPesosAR(
					monto
				)} al jugador ${usuario.getNombre()}.` // Confirma la operación con un mensaje
			);
			rls.keyInPause("Presione cualquier tecla para continuar...", {
				guide: false,
			});
			// Dependiendo de cómo se llamó la función, regresa a un menú diferente
			if (entrePorID) {
				this.menuUsuarios(); // Si se llamó con un ID predefinido, regresa al menú de usuarios
			} else {
				this.menuSolicitarMonto(); // Si no, regresa al menú de créditos
			}
		} catch (error) {
			// Captura y maneja cualquier error que ocurra en el proceso
			console.error(`${(error as Error).message}`);
			rls.keyInPause("Presione cualquier tecla para continuar...", {
				guide: false,
			});
			// En caso de error, regresa al menú de créditos
			this.menuSolicitarMonto();
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
		menuJuegos.push("Volver");

		let opcionJuegos: number = -1;
		//Repite hasta que se elija la útima opción (VOLVER)
		while (opcionJuegos !== menuJuegos.length - 1) {
			try {
				console.clear();
				console.log("╔═════════════════════════════════════════════╗");
				console.log("║                   Juegos                    ║");
				console.log("╚═════════════════════════════════════════════╝");

				opcionJuegos = rls.keyInSelect(menuJuegos, "Opcion: ", {
					guide: false,
					cancel: false,
				});

				// Si no se elige la opción "Volver", inicia el juego seleccionado
				if (opcionJuegos !== menuJuegos.length - 1) {
					this.juegos[opcionJuegos].jugar(this.obtenerUsuario()); // Llama al método jugar del juego seleccionado, pasándole la sesión actual
				}
			} catch (error) {
				// Maneja errores durante el proceso
				console.error(`${(error as Error).message}`);
				rls.keyInPause("Presione cualquier tecla para continuar...", {
					guide: false,
				});
			}
		}
	}

	// Método para obtener el ID del usuario desde la sesión
	// Este método se adapta en función del número de usuarios disponibles
	private obtenerUsuario(): Usuario {
		// Si hay más de un usuariom, muestra los usuarios disponibles
		console.log("Usuarios disponibles:");
		this.sesion.imprimirListadoUsuarios();
		// Solicita el ID a el usuario
		const idUsuario = Util.solicitarID("Ingrese el ID del usuario: ");
		return this.sesion.getUsuario(idUsuario);
	}
	// Eliminar un usuario
	private eliminarUsuario(): void {
		// Verifica que haya usuarios para eliminar
		while (true) {
			if (this.sesion.getCantUsuarios() > 0) {
				try {
					// Solicita el ID del usuario
					const idEliminar = Util.solicitarID(
						"Ingrese el ID de usuario a eliminar: "
					);
					// Elimina al usuario con el ID especificado
					this.sesion.eliminarUsuarioPorId(idEliminar);
					console.log(
						`¡Usuario con ID ${idEliminar} eliminado con exito!` //Mensaje de confirmación
					);
					rls.keyInPause(
						"Presione cualquier tecla para continuar...",
						{
							guide: false,
						}
					);
					break; // Sale del bucle si hay éxito
				} catch (error) {
					// Maneja errores en la eliminación
					console.error(`${(error as Error).message}`);
					rls.keyInPause(
						"Presione cualquier tecla para continuar...",
						{
							guide: false,
						}
					);
				}
			} else {
				// Mensaje si no hay usuarios para eliminar
				console.error(
					// Muestra mensaje si no hay usuarios registrados
					"No hay usuarios registrados. Agregue un usuario primero."
				);
				rls.keyInPause("Presione cualquier tecla para continuar...", {
					guide: false,
				});
			}
		}
	}
}

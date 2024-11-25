import { Juego } from "./Juego";
import { Sesiones } from "./Sesiones";
import { Usuario } from "./Usuario";
import { Util, ParValorClave } from "./Util";
import * as rls from "readline-sync";

//Implementación de la clase SesionCasino
export class Casino {
	private nombre: string; // nombre del casino
    private juegos: Juego[]; // Lista de juegos disponibles en el casino
    private sesiones: Sesiones;
	//private sesion: Sesion; // Objeto para gestionar sesiones de usuario
	
	// Constructor de la clase SesionCasino
	constructor(nombre: string, juegos: Juego[]) {
		// Valida que el nombre del casino sea válido
		if (nombre == undefined || nombre.length < 1) {
			throw new Error("Nombre no válido.");
		}
        this.nombre = nombre;        
		this.juegos = juegos;        //Falta validar acá
        this.sesiones = new Sesiones();
	}

	// Retorna el nombre del Casino
	public getNombre(): string {
		return this.nombre;
	}

	//Muestra una guía que indica al usuario como jugar en el Casino
	private mostrarInstrucciones(reemplazos?:ParValorClave[]) {
		console.log(Util.leerArchivo(`${this.constructor.name}.ins`, reemplazos));
	}

	//Muestra el Menú Principal
	public mostrarMenu(): void {
		const menuPrincipal: string[] = [
			// Opciones del menú principal
			"CONFIGURACION DE USUARIO",
			"JUEGOS DISPONIBLES",
			"SALIR",
		];
		let opcion: number = -1;
		while (opcion !== 2) {
			// Repite hasta que se seleccione la opción de salir
			try {
				console.clear();
				this.mostrarInstrucciones([{clave: '$<NOMBRE>', valor: this.nombre}]); // Mostrar las instrucciones

				opcion = rls.keyInSelect(menuPrincipal, "Opción: ", {
					guide: false,
					cancel: false,
				});
				switch (
					opcion // Ejecuta acciones basadas en la opción seleccionada
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
			const usuarios = this.sesiones.getUsuarios(); // Obtiene la lista de usuarios actuales
			if (usuarios.length > 0) {
				// Verifica si hay usuarios configurados
				console.log("Usuarios configurados:");
				usuarios.forEach((usuario) => {
					console.log(`  ID: ${usuario.getId()} - Nombre: ${usuario.getNombre()}`);
				}); // Lista los usuarios con su ID y su nombre
			} else {
				console.log("No hay usuarios configurados."); // Mensaje si no hay usuarios
			}

			// Opciones del submenú
			const opciones = [
				"AGREGAR UN USUARIO",
				"ELIMINAR UN USUARIO",
                "CARGAR/RETIRAR CRÉDITO",
				"VOLVER",
			];
			opcion = rls.keyInSelect(opciones, "Seleccione una opción: ", {
				guide: false,
				cancel: false,
			});

			switch (opcion) {
				case 0: this.agregarUsuario(); break;
				case 1: this.eliminarUsuario(); break;
				case 2: this.solicitarMonto(); break;
			}
		}
	}
    
    // Agregar un nuevo usuario
    private agregarUsuario(): void{    
        try {
            // Solicita el nombre para un nuevo usuario
            const nuevoNombre = rls.question(
                "Ingrese el nombre del nuevo usuario: "
            );

            // Agrega al usuario usando el método de la clase Sesión
            this.sesiones.agregarUsuario(nuevoNombre);
            // Mensaje de confirmación si se agrego correctamente
            console.log(`Usuario "${nuevoNombre}" agregado con éxito!`);             
        } catch (error) {
            // Maneja errores de validación
            console.error(`${(error as Error).message}`);
            rls.keyInPause(
                "Presione cualquier tecla para continuar...",
                { guide: false, cancel: false }
            );
        }
    }
    
	// Función para solicitar el monto de crédito o retiro
	private solicitarMonto(): void {
		console.clear();
		console.log("╔═════════════════════════════════════════════╗");
		console.log("║       Cargar o Retirar Monto de Dinero      ║");
		console.log("╚═════════════════════════════════════════════╝");

		const usuarios = this.sesiones.getUsuarios(); //Obtener la lista de usuarios desde la sesion
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
		usuarios.forEach((usuario) => {
			console.log(
				`  ID: ${usuario.getId()} - Nombre: ${usuario.getNombre()} - Créditos: $${usuario.getCreditos().toLocaleString(
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
			const usuario = this.sesiones.getUsuario(idUsuario);

            // Realiza el retiro de crédito utilizando el metedo setCreditos
			usuario?.setCreditos(-monto); // Reduce el monto en los creditos del usurio
			
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
	private cargarCredito(): void {
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
			const usuario = this.sesiones.getUsuario(idUsuario);
            
			// Agrega el monto a los créditos del usuario
			usuario.setCreditos(monto); // Incrementa los créditos del usuario
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
            try{
                console.clear();
                opcionJuegos = rls.keyInSelect(menuJuegos, "Opción: ", {
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
		this.sesiones.getUsuarios().forEach((u) => {
			// Muestra cada usuario con su ID y nombre
			console.log(`ID: ${u.getId()} - Nombre: ${u.getNombre()}`);
		});

        // Solicita el ID a el usuario
        const idUsuario = rls.questionInt(
            "Ingrese el ID del usuario: "
        );
		
		return this.sesiones.getUsuario(idUsuario);		
	}

    // Eliminar un usuario
    private eliminarUsuario(): void{
        // Verifica que haya usuarios para eliminar
        if (this.sesiones.getUsuarios().length > 0) {
            try {
                // Solicita el ID del usuario
                const idEliminar = rls.questionInt(
                    "Ingrese el ID del usuario a eliminar: "
                );

                // Elimina al usuario con el ID especificado
                this.sesiones.eliminarUsuarioPorId(idEliminar);
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
    }
}

import { Juego } from "./Juego";
import { Sesion } from "./Sesion";

// Definimos un valor mínimo de créditos para poder jugar
const CREDITOS_MINIMOS: number = 50;

export class JuegoPrueba extends Juego {
	// Constructor que toma el nombre del juego y lo pasa al constructor de la clase base
	constructor(nombre: string) {
		super(nombre); // Llama al constructor de la clase base (Juego) con el nombre del juego
	}

	// Sobreescribe el método jugar de la clase para implementar la lógica de este juego
	public jugar(sesion: Sesion): void {
		// Verifica si la sesión es indefinida o nula
		if (!sesion) {
			// Si la sesión no exite, lanza un error
			throw new Error("Error: Sesión indefinida.");
		}

		// Simula la obtención del ID del usuario actual
		const usuarioId = this.obtenerUsuarioId(sesion);

		// Busca el usuario en la lista de usuarios de la sesión usando el ID obtenido
		const usuario = sesion.getUsuarios().find((u) => u.id === usuarioId);

		// Si no se encuentra un usuario con el ID proporcionado, lanza un error
		if (!usuario) {
			throw new Error(
				`Error: No se encontró un usuario con el ID ${usuarioId}.`
			);
		}

		// Verifica si los créditos disponibles en la sesión son suficientes para poder jugar
		if (sesion.getCreditos() < CREDITOS_MINIMOS) {
			// Si los créditos son insuficientes, lanza un error
			throw new Error("Error: Créditos insuficientes.");
		}

		// Si todo es válido, muestra un mensaje de bienvenida al usuario
		console.log(`Bienvenido ${usuario.nombre}`);

		// Muestra la cantidad de créditos actuales de la sesión, formateados con 2 decimales
		console.log(
			`Créditos actuales: ${sesion.getCreditos().toLocaleString("es-AR", {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			})}`
		);

		console.log(); //Imprime una línea en blanco para mejorar la legibilidad

		// Muestra información sobre el juego que se está ejecutando
		console.info(
			`Ejecutando prueba de juego conceptual ${this.getNombre()}`
		);
	}

	// Método para obtener el ID del usuario desde la sesión
	// Este método se adapta en función del número de usuarios disponibles
	private obtenerUsuarioId(sesion: Sesion): number {
		// Obtiene la lista de usuarios de la sesión
		const usuarios = sesion.getUsuarios();

		// Si solo hay un usuario en la sesión, lo selecciona automáticamente
		if (usuarios.length === 1) {
			return usuarios[0].id; // Retorna el ID del único usuario
		}

		// Si hay más de un usuariom, muestra los usuarios disponibles
		console.log("Usuarios disponibles:");
		usuarios.forEach((u) => {
			// Muestra cada usuario con su ID y nombre
			console.log(`ID: ${u.id} - Nombre: ${u.nombre}`);
		});

		// Accede al primer usuario de la lista usuarios (que es un arreglo de objetos de tipo Usuario) Devuelve el ID del primer usuario:
		return usuarios[0].id;
	}
}

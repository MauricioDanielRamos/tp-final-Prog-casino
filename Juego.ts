import { Sesion } from "./Sesion";

export abstract class Juego {
	//nombre del juego
	private nombre: string;

	constructor(nombre: string) {
		// Asignacion de nombre por parámetro
		this.nombre = nombre;
	}

	// Obtiene el nombre del Juego
	public getNombre(): string {
		return this.nombre;
	}

	/* Declara un método abstracto llamado "jugar" que debe ser implementado en las clases hijas.
	 Este método recibe un parámetro de tipo "Sesion" y no tiene implementación en la clase base.
	Las clases que hereden de Juego deberán definir cómo se lleva a cabo el juego utilizando este método.*/
	public abstract jugar(sesion: Sesion): void;
}

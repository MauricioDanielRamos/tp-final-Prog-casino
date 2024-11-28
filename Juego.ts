import { Usuario } from "./Usuario";
import { IJuego } from "./IJuego";
import { ParValorClave, Util } from "./Util";

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


	// Lee las instrucciones desde un archivo con el mismo nombre de la clase
	// pero extension .ins "Ej: Juego.ins"
	protected  mostrarInstrucciones(reemplazos?:ParValorClave[]) : void{
		console.log(Util.leerArchivo(`./${this.constructor.name}.ins`, reemplazos));
	}

	/* Declara un método abstracto llamado "jugar" que debe ser implementado en las clases hijas.
	 Este método recibe un parámetro de tipo "Sesion" y no tiene implementación en la clase base.
	Las clases que hereden de Juego deberán definir cómo se lleva a cabo el juego utilizando este método.*/
	public abstract jugar(usuario: Usuario): void;
}

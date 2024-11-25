import { Usuario } from "./Usuario";
import { IJuego } from "./IJuego";
import { readFileSync } from 'node:fs';
import * as rls from "readline-sync";

export abstract class Juego implements IJuego {
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

	// Muestra una guía que indica al usuario como jugar
	// Lee las instrucciones desde un archivo con el mismo nombre de la clase
	// pero extension .ins "Ej: Juego.ins"
	protected  mostrarInstrucciones() : void{
		try{
			let filetext = readFileSync(`./${this.constructor.name}.ins`,'utf8');
			if (filetext.length>0){
				console.clear(); // Limpia la consola para mostrar solo las instrucciones
				console.log(filetext);
			}
		} catch (error) {
			console.error(`${(error as Error).name}: ${(error as Error).message}`);
			rls.keyInPause("Presione cualquier tecla para continuar...", {guide: false}); // Pausa antes del volver al menú			
		}		
	}

	/* Declara un método abstracto llamado "jugar" que debe ser implementado en las clases hijas.
	Este método recibe un parámetro de tipo "Usuario" y no tiene implementación en la clase base.
	Las clases que hereden de Juego deberán definir cómo se lleva a cabo el juego utilizando este método.*/
	public abstract jugar(usuario: Usuario): void;
}

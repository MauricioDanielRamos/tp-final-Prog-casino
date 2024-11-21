import { Juego } from "./Juego";
import { Sesion } from "./Sesion";

// Define como constante la cantidad de créditos mínimos para comenzar 
const CREDITOS_MINIMOS : number = 50; 

//Clase de Prueba para probar
export class JuegoPrueba extends Juego {    
    //Constructor de la clase JuegoPrueba
    constructor (nombre: string){
        super(nombre);
    }

    //Método de entrada que implementaria el juego
    public jugar(sesion: Sesion): void {
        this.setSesion(sesion);
        if (sesion==undefined){
            throw new Error('Error: Sesión indefinida.');
        }
        if (sesion.getNombre==undefined||sesion.getNombre().length<1){
            throw new Error('Error: Nombre de usuario inválido.');
        }
        if (sesion.getCreditos()<CREDITOS_MINIMOS){
            throw new Error('Error: Créditos insuficientes.')
        }

        console.log(`Bienvenido ${sesion.getNombre()}`);
        console.log(`Creditos actuales: ${sesion.getCreditos()}`);
        console.log();        
        console.info(`Ejecutando prueba de juego conceptual ${this.getNombre()}`)
    }
}
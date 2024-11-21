import { IJuego } from "./IJuego";
import { Casino } from "./Casino";
import { Sesion } from "./Sesion";

export abstract class Juego implements IJuego{
    protected nombre: string;
    protected sesion: Sesion;

    // Constructor de la clase abstracta Juego
    constructor (nombre: string){
        //Valida que el nombre no sea indefinido ni nulo
        if (nombre==undefined||nombre.length<1){
            throw new Error('Nombre no válido.');
        }
        this.nombre = nombre;
        this.sesion = new Sesion();
    }

    // Retorna el nombre del juego
    public getNombre(): string{
        return this.nombre;
    }    

    //Retorna la sesión asignada (si la hay)
    public getSesion(): Sesion{
        return this.sesion;
    }

    // Setea la sesion de juego
    public setSesion(sesion: Sesion): void{

        //Valida que se haya pasado un objeto de sesión que no sea nulo
        if (sesion==undefined){
            throw new Error('Datos de sesión inválidos o nulos.')
        }
        this.sesion = sesion;
    }
        
    // Método a implementar en las clases que heredan
    public abstract jugar(sesion: Sesion): void;
}
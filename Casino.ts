import { Juego } from "./Juego";
import { Sesion } from "./Sesion";

import * as rls from "readline-sync";

//Implementación de la clase SesionCasino
export class Casino{
    private juegos: Juego[];
    private sesion: Sesion;
    private nombre: string;

    // Constructor de la clase SesionCasino
    constructor (nombre: string, juegos: Juego[]){
        if (nombre==undefined||nombre.length<1){
            throw new Error('Nombre no válido.');
        }
        this.nombre = nombre;
        this.juegos = juegos;
        this.sesion = new Sesion();
    }

    // Retorna el nombre de la sesión
    public getNombre(): string{
        return this.nombre;
    }

    //Muestra una guía que indica al usuario como jugar en el Casino
    private mostrarInstrucciones(){
        console.log(`Bienvenido a ${this.getNombre()}`);
        console.log('Para jugar debe');
        console.log('\t* Ingresar su nombre de usuario.');
        console.log('\t* Cargar créditos.');
        console.log('\t* Elegir el juego a jugar.')        
    }

    //Muestra el Menú Principal
    public mostrarMenu(): void{

        const menuPrincipal: string[] =['Nombre de usuario', 'Monto de dinero', 'Juegos disponibles', 'Salir'];
        let opcion: number = -1;
        while (opcion!==3){
            try{
                console.clear();
                this.mostrarInstrucciones();

                opcion = rls.keyInSelect(menuPrincipal, "Opción: ", {guide:false, cancel:false});
                switch(opcion){
                    case 0: break; //Falta implementar solicitar nombre usuario
                    case 1: break; //Falta implementar solicitar monto de dinero
                    case 2: this.menuJuegos(); break;
                }
            }catch(error){
                console.error(`${(error as Error).name}: ${(error as Error).message}`);
                rls.keyInPause('Presione espacio para continuar...', {guide: false, limit:[' ']});
            }
        }
    }

    /* 
        Muestra un menú generado dinámicamente con los nombres del arreglo de juegos
        y ejecuta el juego seleccionado o vuelve al menú anterior de acuerdo a la 
        selección del usuario
    */
    private menuJuegos(): void{
        // Crea un arreglo con los nombres de los juegos cargados en el Casino   
        const menuJuegos: string[] = this.juegos.flatMap(juego=>juego.getNombre());        
        // Agrega una opcion para volver al menú anterior
        menuJuegos.push("Volver");

        let opcionJuegos : number = -1;
        //Este bucle se repite siempre que no se elija la última opción
        while (opcionJuegos!==menuJuegos.length-1){
            console.clear();
            opcionJuegos = rls.keyInSelect(menuJuegos, "Opción: ", {guide:false, cancel:false});
            
            //Si se elije un juego invoco a su método Jugar() pasándole la sesión actual
            if (opcionJuegos!==menuJuegos.length-1){
                (this.juegos[opcionJuegos].jugar(this.sesion));
            }
        }
    }
}
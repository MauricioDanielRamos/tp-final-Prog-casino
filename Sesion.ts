export class Sesion {
    private nombre: string;
    private creditos:  number;

    // Constructor
    constructor () {
        this.nombre = '';
        this.creditos = 0;
    }

    // Retorna el nombre de la usuario
    public getNombre(): string{
        return this.nombre;
    }

    // Establece el nombre de usuario
    public setNombre(nombre: string){
        if (nombre==undefined||nombre.length<1){
            throw new Error('Nombre no válido.');
        }
        this.nombre = nombre;
    }

    // Retorna la cantidad de créditos cargados en la sesión
    public getCreditos(): number{
        return this.creditos;
    }

    // Establece los créditos cargados en la sesión
    public setCreditos(creditos: number): void{
        if (creditos==undefined||creditos<1){
            throw Error('Cantidad de créditos inválida.')
        }
        this.creditos = creditos;
    }
}
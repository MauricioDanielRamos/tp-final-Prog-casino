export class Usuario {
    private id: number; 
    private nombre: string = ''; 
    private creditos: number = 0;

    //Constructor de la clase Usuario
    constructor (id: number, nombre: string, creditos: number){
        this.id = id;
        this.setNombre(nombre);
        this.setCreditos(creditos);
    }

	// Retorna el nombre de usuario
	public getNombre(): string {
		return this.nombre;
	}

    public setNombre(nombre: string): void{
        // Valida el nombre ingresado por el usuario
		if (!nombre || nombre.length < 3) {
			throw new Error("El nombre debe contener al menos 3 caracteres.");
		}
		if (nombre.match(/\d/)) {
			throw new Error("El nombre no puede contener números.");
		}
        this.nombre = nombre;
    }

    // Retorna el ID de usuario
    public getId(): number{
        return this.id;
    }

    // Retorna los créditos del usuario
    public getCreditos(): number{
        return this.creditos;
    }

    // Establece los creditos del usuario validando que no pueda
    // retirar más de lo que tiene
    public setCreditos(creditos: number): void{
		if ((this.getCreditos() + creditos) < 0) {
			throw new Error(
				"No hay suficientes créditos para realizar esta operación."
			);
		}
        this.creditos=this.getCreditos()+creditos;
    }
}
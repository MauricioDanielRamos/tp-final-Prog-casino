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

    // Establece el nombre del usuario
    public setNombre(nombre: string): void{
        // Valida el nombre ingresado por el usuario
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/.test(nombre)) {
			throw new Error("El nombre solamente puede contener caracteres a-z, letras con acento, ñ y espacios.");
		}
		if (!nombre || nombre.length < 3) {
			throw new Error("El nombre debe contener al menos 3 caracteres.");
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
				"No hay suficientes creditos para realizar esta operacion."
			);
		}
        this.creditos=this.getCreditos()+creditos;
    }
}

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
        if (!/^(?:[A-ZÁÉÍÓÚÑ][a-záéíóúñ]{2,} ?){1,6}(?<! )$/g.test(nombre)) {
			throw new Error("El nombre debe contener como mínimo 3 carácteres\n\tEstos pueden ser de a-z, letras acentuadas, ñ y espacios intermedios.");
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

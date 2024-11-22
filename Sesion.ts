export class Sesion {
	// Lista los usuarios con un ID único, nombre y créditos
	private usuarios: { id: number; nombre: string; creditos: number }[]; // Usuarios con ID único
	private creditos: number; // Créditos totales en la sesión
	private idContador: number; // Contador para IDs únicos

	constructor() {
		this.usuarios = [];
		this.creditos = 0; // Inicializa los créditos totales en 0
		this.idContador = 1; // Inicializa el contador de IDs
	}

	// Obtiene la lista de usuarios
	public getUsuarios(): { id: number; nombre: string; creditos: number }[] {
		return this.usuarios;
	}

	// Agrega un usuario nuevo con ID único y creditos iniciales
	public agregarUsuario(nombre: string): void {
		// Valida el nombre ingresado por el usuario
		if (!nombre || nombre.length < 3) {
			throw new Error("El nombre debe contener al menos 3 caracteres.");
		}
		if (nombre.match(/\d/)) {
			throw new Error("El nombre no puede contener números.");
		}

		// Si el nombre es válido
		this.usuarios.push({ id: this.idContador++, nombre, creditos: 0 }); // Agrega un nuevo usuraio
	}

	// Elimina un usuario utilizando el ID
	public eliminarUsuarioPorId(id: number): void {
		const index = this.usuarios.findIndex((usuario) => usuario.id === id);
		if (index === -1) {
			throw new Error(`No se encontró ningún usuario con el ID ${id}.`);
		}

		// Restar los créditos del usuario eliminado del total
		this.creditos -= this.usuarios[index].creditos;
		this.usuarios.splice(index, 1); // Elimina al usuario del array
	}

	// Retorna la cantidad de créditos cargados en la sesión
	public getCreditos(): number {
		return this.creditos; // Devuelve el total de créditos
	}

	// Establece o ajusta los créditos de un usuario
	public setCreditos(id: number, monto: number): void {
		const usuario = this.usuarios.find((u) => u.id === id);
		if (!usuario) {
			throw new Error(`No se encontró un usuario con el ID ${id}.`);
		}

		if (usuario.creditos + monto < 0) {
			throw new Error(
				"No hay suficientes créditos para realizar esta operación."
			);
		}
		//Actualizar los créditos totales (retar los actuales y sumar los nuevos)
		this.creditos += monto; // Ajusta el total acumulado de créditos
		usuario.creditos += monto; // Ajusta los créditos del usuario
	}
}

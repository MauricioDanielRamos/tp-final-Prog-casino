import { Usuario } from "./Usuario";

export class Sesiones {
	// Lista los usuarios con un ID único, nombre y créditos
	private usuarios: Usuario[]; // Usuarios con ID único
	private idContador: number; // Contador para IDs únicos

	constructor() {
		this.usuarios = [];
		this.idContador = 1; // Inicializa el contador de IDs
	}

	// Busca el usuario con el ID proporcionado
	public getUsuario(id: number): Usuario{
		const usuario = this.usuarios.find((u) => u.getId() === id);

		// Verificar si el usuario existe
		if (!usuario) {
			throw new Error(
				`No se encontro un usuario con el ID ${id}.`
			);
		}
		return usuario;
	}		

	// Obtiene la lista de usuarios
	public getUsuarios(): Usuario[] {
		return [...this.usuarios];
	}

	// Agrega un usuario nuevo con ID único y creditos iniciales
	public agregarUsuario(nombre: string): void {
		const usuario = new Usuario(this.idContador, nombre, 0)
		this.usuarios.push(usuario); // Agrega un nuevo Usuario
		this.idContador++;
	}

	// Elimina un usuario utilizando el ID
	public eliminarUsuarioPorId(id: number): void {
		const index = this.usuarios.findIndex((usuario) => usuario.getId() === id);
		if (index === -1) {
			throw new Error(`No se encontro ningun usuario con el ID ${id}.`);
		}
		this.usuarios.splice(index, 1); // Elimina al usuario del array
	}

	// Retorna la cantidad de créditos cargados en la sesión
	public getCreditosSesiones(): number {
		let monto: number = 0;
		this.usuarios.flatMap(usuario=>usuario.getCreditos()).forEach(montoUsuario=>monto+=montoUsuario);
		return monto;
	}

	// Establece o ajusta los créditos de un usuario
	public setCreditosUsuario(id: number, monto: number): void {
		const usuario = this.usuarios.find((u) => u.getId() === id);
		if (!usuario) {
			throw new Error(`No se encontro un usuario con el ID ${id}.`);
		}
		usuario.setCreditos(usuario.getCreditos()+monto);
	}
}

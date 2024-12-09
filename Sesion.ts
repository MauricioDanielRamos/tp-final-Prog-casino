import { Usuario } from "./Usuario";
import { Util } from "./Util";

export class Sesion {
	// Lista los usuarios con un ID único, nombre y créditos
	private usuarios: Usuario[]; // Usuarios con ID único
	private idContador: number; // Contador para IDs únicos

	constructor() {
		this.usuarios = [];
		this.idContador = 1; // Inicializa el contador de IDs
	}

	// Busca el usuario con el ID proporcionado
	public getUsuario(id: number): Usuario{
		const usuario = this.usuarios.find((u) => u.getId() == id);

		// Verificar si el usuario existe
		if (!usuario) {
			throw new Error(
				`No se encontro un usuario con el ID ${id}.`
			);
		}
		return usuario;
	}		

	// Retorna la cantidad de usuarios cargados
	public getCantUsuarios(): number{
		return this.usuarios.length;
	}

	// Imprime el listado de usuarios
	public imprimirListadoUsuarios(): void{
		this.usuarios.forEach((usuario) => {
			console.log(`  ID: ${usuario.getId()} - Nombre: ${usuario.getNombre()} - Creditos: ${Util.convertirAPesosAR(usuario.getCreditos())}`)
		});
	}

	// Agrega un usuario nuevo con ID único y creditos iniciales
	public agregarUsuario(nombre: string): Usuario {
		const usuario = new Usuario(this.idContador, nombre, 0)
		const ultimo = this.usuarios.push(usuario)-1; // Agrega un nuevo Usuario
		this.idContador++;
		return this.usuarios[ultimo];
		
	}

	// Elimina un usuario utilizando el ID
	public eliminarUsuarioPorId(id: number): void {
		const index = this.usuarios.findIndex((usuario) => usuario.getId() == id);
		if (index == -1) {
			throw new Error(`No se encontro ningun usuario con el ID ${id}.`);
		}
		this.usuarios.splice(index, 1); // Elimina al usuario del array
		// Si no hay más usuarios, reinicia el contador de IDs
		if (this.usuarios.length === 0) {
			this.idContador = 1;
		}
	}

	// Retorna la cantidad de créditos cargados en la sesión
	public getCreditosSesiones(): number {
		let monto: number = 0;
		this.usuarios.flatMap(usuario=>usuario.getCreditos()).forEach(montoUsuario=>monto+=montoUsuario);
		return monto;
	}

	// Establece o ajusta los créditos de un usuario
	public setCreditosUsuario(id: number, monto: number): void {
		const usuario = this.usuarios.find((u) => u.getId() == id);
		if (!usuario) {
			throw new Error(`No se encontro un usuario con el ID ${id}.`);
		}
		usuario.setCreditos(usuario.getCreditos()+monto);
	}
}

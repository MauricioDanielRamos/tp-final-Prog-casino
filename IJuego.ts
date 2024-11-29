import { Usuario } from "./Usuario";

export interface IJuego {
	getNombre(): string;
	jugar(usuario: Usuario): void;
}

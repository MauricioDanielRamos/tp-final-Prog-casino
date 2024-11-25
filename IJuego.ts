import { Sesion } from "./Sesion";

export interface IJuego {
	getNombre(): string;
	jugar(sesion: Sesion): void;
}

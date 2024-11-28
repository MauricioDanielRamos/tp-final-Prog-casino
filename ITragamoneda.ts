import { Usuario } from "./Usuario";

export interface ITragamoneda {
    nombreJuego: string; // Nombre del juego
    jugar(usuario: Usuario): void; // Método principal para jugar
}

import { SesionCasino } from "./Casino";

export interface IJuego{
    getNombre(): string;
    jugar(sesion: SesionCasino): void;
}
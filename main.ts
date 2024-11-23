import { Casino } from "./Casino";
import { Juego } from "./Juego";
import { JuegoPrueba } from "./JuegoPrueba";

const j1: Juego = new JuegoPrueba("Juego Conceptual 1");
const j2: Juego = new JuegoPrueba("Juego Conceptual 2");

const sesionCasino: Casino = new Casino("CASINO ROYALE", [j1, j2]);
sesionCasino.mostrarMenu();

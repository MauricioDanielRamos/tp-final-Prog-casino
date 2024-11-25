import { Casino } from "./Casino";
import { Juego } from "./Juego";
import { JuegoPrueba } from "./JuegoPrueba";
import { TragamonedaFrutal } from "./TragamonedaFrutal";
import { TragamonedaAnimal } from "./TragamonedaAnimal";

const j1: Juego = new JuegoPrueba("Juego Conceptual 1");
const j2: Juego = new JuegoPrueba("Juego Conceptual 2");
const tragamonedaFrutal:Juego = new TragamonedaFrutal("Tragamoneda Frutal");
const tragamonedaAnimal:Juego = new TragamonedaAnimal("Tragamoneda Animal");

const sesionCasino: Casino = new Casino("CASINO ROYALE", [j1, j2, tragamonedaFrutal, tragamonedaAnimal]);
sesionCasino.mostrarMenu();


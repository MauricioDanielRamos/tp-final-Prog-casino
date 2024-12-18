import { Casino } from "./Casino";
import { Juego } from "./Juego";
import { BlackJack } from "./BlackJack";
import { TragamonedaFrutal } from "./TragamonedaFrutal";
import { TragamonedaAnimal } from "./TragamonedaAnimal";
import { RuedaDeLaFortuna } from "./RuedaDeLaFortuna";

const tragamonedaFrutal: Juego = new TragamonedaFrutal(`Tragamoneda Frutal`);
const tragamonedaAnimal: Juego = new TragamonedaAnimal(`Tragamoneda Animal`);
const blackJack: Juego = new BlackJack('BlackJack');
const ruedaFortuna: Juego = new RuedaDeLaFortuna("Rueda de la Fortuna");

const sesionCasino: Casino = new Casino(`CASINO ROYALE`, [tragamonedaAnimal, tragamonedaFrutal, blackJack, ruedaFortuna, /*dados */]);

sesionCasino.mostrarMenu();


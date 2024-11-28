import { Casino } from "./Casino";
import { BlackJack } from "./BlackJack";

const sesionCasino: Casino = new Casino("CASINO ROYALE", [new BlackJack('BlackJack')]);

sesionCasino.mostrarMenu();

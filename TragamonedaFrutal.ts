import { Juego } from "./Juego";
import { Usuario } from "./Usuario";
import { ITragamoneda } from "./ITragamoneda";
import * as rls from "readline-sync";

// Definimos un valor mínimo de créditos para poder jugar
const CREDITOS_MINIMOS: number = 50;

export class TragamonedaFrutal extends Juego implements ITragamoneda {
    public nombreJuego: string="Tragamoneda Frutal";
    private rodillos: string[] = ["🍒", "🍋", "🍊", "🍉", "🍇", "🍓", "🍍", "🥝", "🍌", "🥥"];
    private apuesta: number = 0;
    private emojiFavorito: string = ``;
    
	// Constructor que toma el nombre del juego y lo pasa al constructor de la clase base
	constructor(nombre: string) {
		super(nombre); // Llama al constructor de la clase base (Juego) con el nombre del juego
	}

    // Convierte un número a moneda argentina
    private convertirAPesosAR(creditos: number): string{
        return `$ ${creditos.toLocaleString("es-AR", {minimumFractionDigits: 2,maximumFractionDigits: 2,})} ARS`;
    }

	// Sobreescribe el método jugar de la clase para implementar la lógica de este juego
	public jugar(usuario: Usuario): void {
		// 
		if (!usuario) {
			throw new Error("Error: Usuario indefinido.");
		}

		// Verifica si los créditos disponibles en la sesión son suficientes para poder jugar
		if (usuario.getCreditos() < CREDITOS_MINIMOS) {
			// Si los créditos son insuficientes, lanza un error
			throw new Error(`Error: Créditos insuficientes. (${this.convertirAPesosAR(CREDITOS_MINIMOS)})}`);
		}

		// Si todo es válido, muestra un mensaje de bienvenida al usuario
		console.log(`Bienvenido ${usuario.getNombre()} al juego de ${this.nombreJuego}`);

		// Muestra la cantidad de créditos actuales de la sesión, formateados con 2 decimales
		console.log(`Créditos actuales: ${this.convertirAPesosAR(usuario.getCreditos())}`);
        
        //Ejecucion del juego
        while (true) {
            console.log();
        
            const comenzar = rls.keyIn(`Estás listo para comenzar el juego? (S/N): `, {limit: ['s','n'], caseSensitive:false, guide: false}).toLowerCase();
            if (comenzar === "s") {
                this.establecerApuesta(usuario);
                this.elegirEmoji();
                this.IniciarJuego(usuario);
                if (usuario.getCreditos() < CREDITOS_MINIMOS) {
                    console.error(`No tienes suficientes créditos para jugar. (${this.convertirAPesosAR(CREDITOS_MINIMOS)})`);
                    rls.keyInPause("Presione cualquier tecla para continuar...", {
                        guide: false,
                    });
                    break;                    
                }
            } else if (comenzar === "n") {
                console.log(`¡Gracias por jugar!`);
                break;
            }
        }
    }
        
    // Establece la apuesta en creditos para la jugada actual
    private establecerApuesta(usuario: Usuario): void {
        while (true) {
            let apuestaIngresada: number = rls.questionInt(`Ingresa tu apuesta (mínimo ${this.convertirAPesosAR(CREDITOS_MINIMOS)} créditos): `);

            if ((usuario.getCreditos()>=apuestaIngresada)&&(apuestaIngresada>=CREDITOS_MINIMOS)) {
                this.apuesta = apuestaIngresada;
                usuario.setCreditos(- apuestaIngresada);
                console.log(`Has apostado ${this.convertirAPesosAR(apuestaIngresada)} créditos.`);
                break;
            } else {
                console.error(`Por favor, ingresa un valor válido entre ${this.convertirAPesosAR(CREDITOS_MINIMOS)} y tus créditos disponibles (${this.convertirAPesosAR(usuario.getCreditos())}).`);
            }
        }        
    }
    
    // Elije el emoji favorito
    private elegirEmoji(): void {
        console.log(`Elige tu emoji favorito de la lista:`);
        this.rodillos.forEach((emoji, index) => {
        console.log(`${index + 1}. ${emoji}`);
        });
        
        while (true) {
            let indice = parseInt(rls.question(`Ingresa el numero del emoji que deseas: `, 
                {guide: false, 
                limit:`$<1..${this.rodillos.length}>`,
                limitMessage: 'Seleccione un número de emoji válido.'}))-1;

            this.emojiFavorito = this.rodillos[indice];
            console.log(`Has elegido: ${this.emojiFavorito}`);
            break;
        }
    }
    
    // Inicia la ejecución del juego
    private IniciarJuego(usuario: Usuario): void {
        console.log(`¡Los rodillos están girando!`);
        const resultado = this.girarRodillos();
        const coincidencias = this.calcularCoincidencias(resultado);
        console.log(`Resultado: ${resultado.join(` | `)}`);
        this.mostrarPremio(coincidencias, usuario);
    }
    
    // Genera numeros aleatorios para cada uno de los rodillos
    private girarRodillos(): string[]  {
        const resultados: string[] = [];
        for (let i = 0; i < 3; i++) {
        const indiceAleatorio = Math.floor(Math.random() * this.rodillos.length);
        resultados.push(this.rodillos[indiceAleatorio]);
        } 
        return resultados;
    }
    
    // Calcula las coincidencias de acuerdo al emoji elegido
    private calcularCoincidencias(resultado: string[]): number {
        const coincidencias = resultado.filter((emoji) => emoji === this.emojiFavorito).length;
        return coincidencias;
    }
    
    // Muestra el premio
    private mostrarPremio(coincidencias: number, usuario: Usuario): void {
        let premio: number = 0; // Variable local para el premio en esta jugada
        
        switch(coincidencias){
            case 3: premio = this.apuesta * 10;
                    console.log(`¡Felicidades! Coincidieron los 3 emojis.`);
                    break;
            case 2: premio = this.apuesta * 3;
                    console.log(`¡Muy bien! Coincidieron 2 emojis.`);
                    break;
            case 1: premio = this.apuesta; // Solo recupera su apuesta
                    console.log(`Coincidió 1 emoji.`);
                    break;
            default:console.log(`No hubo coincidencias esta vez.`);
                    break;
        }
        usuario.setCreditos( + premio); // Sumamos el premio (si hubo)
        console.log(`Tu premio es: ${this.convertirAPesosAR(premio)} créditos.`);
        console.log(`Saldo final: ${this.convertirAPesosAR(usuario.getCreditos())}`);
    }
}

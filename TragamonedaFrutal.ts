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

	// Sobreescribe el método jugar de la clase para implementar la lógica de este juego
	public jugar(usuario: Usuario): void {
		// 
		if (!usuario) {
			throw new Error("Error: Usuario indefinido.");
		}

		// Verifica si los créditos disponibles en la sesión son suficientes para poder jugar
		if (usuario.getCreditos() < CREDITOS_MINIMOS) {
			// Si los créditos son insuficientes, lanza un error
			throw new Error("Error: Créditos insuficientes.");
		}

		// Si todo es válido, muestra un mensaje de bienvenida al usuario
		console.log(`Bienvenido ${usuario.getNombre()} al juego de ${this.nombreJuego}`);

		// Muestra la cantidad de créditos actuales de la sesión, formateados con 2 decimales
		console.log(
			`Créditos actuales: ${usuario.getCreditos().toLocaleString("es-AR", {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			})}`
		);
        
        //Ejecucion del juego
        while (true) {
            console.log(`\nEstás listo para comenzar el juego?`);
        
            const comenzar = rls.question(`Escribe 's' para iniciar o 'n' para terminar: `).toLowerCase();
            if (comenzar === "s") {
                this.establecerApuesta(usuario);
                this.elegirEmoji();
                this.IniciarJuego(usuario);
                if (usuario.getCreditos() < CREDITOS_MINIMOS) {
                    console.log(`No tienes suficientes créditos para jugar.`);
                    rls.keyInPause("Presione cualquier tecla para continuar...", {
                        guide: false,
                    });
                    break;
                    
                }
            } else if (comenzar === "n") {
                console.log(`¡Gracias por jugar!`);
                break;
            } else {
                console.error(`Por favor, escribe una opción válida.`);
            }
            }
        }
        
        private establecerApuesta(usuario: Usuario): void {
            while (true) {
                const apuestaIngresada = rls.question(`Ingresa tu apuesta (mínimo 50 créditos): `);
                const apuesta = parseInt(apuestaIngresada);

                if (!isNaN(apuesta) && apuesta >= 50 && apuesta <= usuario.getCreditos()) {
                    this.apuesta = apuesta;
                    usuario.setCreditos(- apuesta);
                    console.log(`Has apostado ${apuesta} créditos.`);
                    break;
                } else {
                    console.error(`Por favor, ingresa un valor válido entre 50 y tus créditos disponibles (${usuario.getCreditos()}).`);
                }
            }
            
        }

        private elegirEmoji(): void {
            console.log(`Elige tu emoji favorito de la lista:`);
            this.rodillos.forEach((emoji, index) => {
            console.log(`${index + 1}. ${emoji}`);
            });
        
            while (true) {
            const seleccion = rls.question(`Ingresa el numero del emoji que deseas: `);
            const indice = parseInt(seleccion) - 1;
        
            if (!isNaN(indice) && indice >= 0 && indice < this.rodillos.length) {
                this.emojiFavorito = this.rodillos[indice];
                console.log(`Has elegido: ${this.emojiFavorito}`);
                break; 
            } else {
                console.error(`Por favor, selecciona un número válido.`);
            }
            }
        }
        
        private IniciarJuego(usuario: Usuario): void {
            console.log(`¡Los rodillos están girando!`);
            const resultado = this.girarRodillos();
            const coincidencias = this.calcularCoincidencias(resultado);
            console.log(`Resultado: ${resultado.join(` | `)}`);
            this.mostrarPremio(coincidencias, usuario);
        }
        
        private girarRodillos(): string[]  {
            const resultados: string[] = [];
            for (let i = 0; i < 3; i++) {
            const indiceAleatorio = Math.floor(Math.random() * this.rodillos.length);
            resultados.push(this.rodillos[indiceAleatorio]);
            } 
            return resultados;
        }
        
        private calcularCoincidencias(resultado: string[]): number {
            const coincidencias = resultado.filter((emoji) => emoji === this.emojiFavorito).length;
            return coincidencias;
        }
        
        
        private mostrarPremio(coincidencias: number, usuario: Usuario): void {
            let premio: number = 0; // Variable local para el premio en esta jugada
        
            if (coincidencias === 3) {
                premio = this.apuesta * 10;
                console.log(`¡Felicidades! Coincidieron los 3 emojis.`);
            } else if (coincidencias === 2) {
                premio = this.apuesta * 3;
                console.log(`¡Muy bien! Coincidieron 2 emojis.`);
            } else if (coincidencias === 1) {
                premio = this.apuesta; // Solo recupera su apuesta
                console.log(`Coincidió 1 emoji.`);
            } else {
                console.log(`No hubo coincidencias esta vez.`);
            }
            usuario.setCreditos( + premio); // Sumamos el premio (si hubo)
            console.log(`Tu premio es: ${premio} créditos.`);
            console.log(
                `Saldo final: ${usuario.getCreditos().toLocaleString("es-AR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}`);
    }
    }
    
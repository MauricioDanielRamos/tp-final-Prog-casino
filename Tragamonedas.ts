
import * as rls from "readline-sync";

export class Tragamonedas {
  private rodillos: string[] = ["🍒", "🍋", "🍊", "🍉", "🍇", "🍓", "🍍", "🥝", "🍌", "🥥"];
  private apuesta: number = 0;
  private emojiFavorito: string = ``;

  public iniciarJuego(): void {
    console.log(`¡Bienvenido al juego de tragamonedas! `);

    while (true) {
      
      console.log(`\nEstás listo para comenzar el juego?`);

      const comenzar = rls.question(`Escribe 's' para iniciar o 'n' para terminar: `).toLowerCase();
      if (comenzar === "s") {
        this.elegirEmoji();
        //Aqui va la apuesta
        this.jugar();
      } else if (comenzar === "n") {
        console.log(`¡Gracias por jugar!`);
        break;
      } else {
        console.error(`Por favor, escribe una opción válida.`);
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


  private jugar(): void {
    console.log(`¡Los rodillos están girando!`);
    const resultado = this.girarRodillos();
    const coincidencias = this.calcularCoincidencias(resultado);
    console.log(`Resultado: ${resultado.join(` | `)}`);
    this.mostrarPremio(coincidencias);
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

  private mostrarPremio(coincidencias: number): void {
    let premio = 0;

    if (coincidencias === 3) {
      premio = this.apuesta * 10;
      console.log(`¡Felicidades! Coincidieron los 3 emojis.`);
    } else if (coincidencias === 2) {
      premio = this.apuesta * 3;
      console.log(`¡Muy bien! Coincidieron 2 emojis.`);
    } else if (coincidencias === 1) {
      premio = this.apuesta;
      console.log(`Coincidió 1 emoji.`);
    } else {
      console.log(`No hubo coincidencias esta vez.`);
    }

    console.log(`Tu premio es: ${premio} créditos`);
  }
}

const tragamonedas = new Tragamonedas();
tragamonedas.iniciarJuego();
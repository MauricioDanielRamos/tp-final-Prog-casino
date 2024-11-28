import { Juego } from "./Juego";
import { Usuario } from "./Usuario";
import { Util } from "./Util"
import * as rls from "readline-sync";

// Definimos un valor mínimo de créditos para poder jugar
const CREDITOS_MINIMOS: number = 150;

const MASO_INICIAL = [
    '♥2','♥3','♥4','♥5','♥6','♥7','♥8','♥9','♥10','♥J','♥Q','♥K','♥A',
    '♦2','♦3','♦4','♦5','♦6','♦7','♦8','♦9','♦10','♦J','♦Q','♦K','♦A',
    '♠2','♠3','♠4','♠5','♠6','♠7','♠8','♠9','♠10','♠J','♠Q','♠K','♠A',
    '♣2','♣3','♣4','♣5','♣6','♣7','♣8','♣9','♣10','♣J','♣Q','♣K','♣A'
];

export class BlackJack extends Juego {
    private maso: string[] = MASO_INICIAL;
    private manoMaquina: string[] = [];
    private manoUsuario: string[] = [];
    private apuesta: number = 0;
    
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
			throw new Error(`Error: Créditos insuficientes (${Util.convertirAPesosAR(usuario.getCreditos())}). (Mínimo: ${Util.convertirAPesosAR(CREDITOS_MINIMOS)})`);
		}
        
        let volver: boolean = false;
        while (!volver){
            this.mostrarInstrucciones([{clave: '$<NOMBRE_USUARIO>', valor: usuario.getNombre()},
                                       {clave: '$<CREDITOS', valor: Util.convertirAPesosAR(usuario.getCreditos())}
                                      ]);
            
            // Inicialmente solo se apostar o salir
            switch (rls.keyInSelect(['Apostar', 'Salir del Juego'], 'Opción: ', {guide: false, cancel: false})){
                case 0: //Solicita la apuesta inicial
                        this.solicitarApuesta(usuario);
                        //Reparte las cartas
                        this.generarManoInicial(usuario);
                        this.juegaUsuario(usuario); 
                        break;
                case 1: volver=true; break;
            }
        }
    }

    // Bucle de juego del usuario
    private juegaUsuario(usuario: Usuario): void{
        let continuar = true;
        let sePasoDe21 = false;
        while (continuar){
            console.clear();
            console.log('╔═══════════════════════════════════════════════════════════════════════════════════════════════╗');
            console.log('║                                   Guía para jugar a BlackJack                                 ║');
            console.log('╚═══════════════════════════════════════════════════════════════════════════════════════════════╝');
            console.log(`Jugador: ${usuario.getNombre()} Créditos: ${Util.convertirAPesosAR(usuario.getCreditos())}`);
            console.log();

            //Muestra las manos en la etapa Inicial
            //this.mostrarMano('Maso: ', this.maso, false); // TEST
            this.mostrarMano('Máquina:', this.manoMaquina, true);
            this.mostrarMano(`${usuario.getNombre()} (${this.calcularMano(this.manoUsuario)})`, this.manoUsuario, false);                
            switch(rls.keyInSelect(['Pedir', 'Plantarse'], 'Elije: ', {guide: false, cancel: false})){
                case 0: this.repartirCarta(this.manoUsuario); break
                case 1: continuar = false;
                        break;
            }
                                    
            // Validacioness
            if (this.calcularMano(this.manoUsuario)>21){
                sePasoDe21 = true;
                continuar = false;
            }

            //Muestra la mano de la maquina completa si ya terminó de ju
            if (!continuar){
                this.mostrarMano(`Máquina (${this.calcularMano(this.manoMaquina)})`, this.manoMaquina, false);
            }
        }
        
        //Turno de la máquina
        while (!sePasoDe21 && this.calcularMano(this.manoMaquina)<17){            
            this.repartirCarta(this.manoMaquina);
        }        
        
        //Calculo los resultados de la partida
        this.calcularResultados(usuario);
        
        rls.keyInPause("Presione cualquier tecla para continuar...", {guide: false,});
        
    } 

    // Calcula los resultados de la partida
    private calcularResultados(usuario: Usuario): void{
        //Se pasa el usuario
        if (this.calcularMano(this.manoUsuario)>21){
            console.log(`Te pasaste, gana la máquina`);        
        //Se pasa la máquina
        } else if (this.calcularMano(this.manoMaquina)>21){
            console.log(`Se paso la maquina. Gana ${usuario.getNombre()}`);
        //Gana Maquina por BlackJack
        } else if ((this.calcularMano(this.manoMaquina)==21 && this.manoMaquina.length==2) && (this.calcularMano(this.manoUsuario)==21 && this.manoUsuario.length!==2)){
            console.log(`Gana Maquina con BlackJack`);
        //Gana Usuario por BlackJack
        } else if ((this.calcularMano(this.manoUsuario)==21 && this.manoUsuario.length==2) && (this.calcularMano(this.manoMaquina)==21 && this.manoMaquina.length!==2)){
            console.log(`Gana ${usuario.getNombre()} con BlackJack`);
        //Empatan por BlackJack
        } else if ((this.calcularMano(this.manoMaquina)==21 && this.manoMaquina.length==2) && (this.calcularMano(this.manoUsuario)==21 && this.manoUsuario.length==2)){
            console.log(`Empate de Black Jack`);
        //Empate fuera de BlackJack
        } else if (this.calcularMano(this.manoMaquina)==this.calcularMano(this.manoUsuario)){ 
              console.log(`Empate a ${this.calcularMano(this.manoMaquina)}.`);        
        // Las manos son diferentes
        } else {
            const difManoMaquina = 21 - this.calcularMano(this.manoMaquina);
            const difManoUsuario = 21 - this.calcularMano(this.manoUsuario);
            if (difManoUsuario<difManoMaquina){
                console.log(`Gana ${usuario.getNombre()}`);
            } else if (difManoMaquina<difManoUsuario){
                console.log(`Gana la máquina`);
            }
        }
    }

    // Calcula el valor de una mano
    private calcularMano(mano: string[]){
        let valor: number = 0; // Valor acumulado
        let cantAses: number = 0; //Cantidad de Ases
        mano.forEach((carta)=>{
            //Elimino el palo de la carta (primer char)
            carta = carta.slice(1);
            switch (carta){
                case 'J': 
                case 'Q':
                case 'K': valor+=10; break; //J,Q,K
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                case '10': valor+=parseInt(carta); break; //2..10 sumo el entero correspondiente
                case 'A':  cantAses++; //Indico que hay una As
                           valor+=11;
                           break; 
            }
        });

        // Manejo los ases si los hay para llegar lo más cerca posible a 21 o no pasarme
        // Ajustar el valor de los ases si la mano se pasa de 21
        while (valor > 21 && cantAses > 0) {
            valor -= 10; // Cambiar un as de 11 a 1
            cantAses--;
        }        
        return valor;
    }

    //Solicita al usuario que realice una apuesta
    private solicitarApuesta(usuario: Usuario){
        let apuesta: number = rls.questionInt(`Ingrese su apuesta (Minimo: ${Util.convertirAPesosAR(CREDITOS_MINIMOS)}): `, {unmatchMessage: 'Ingrese un valor de apuesta válido.'})
        if (apuesta<CREDITOS_MINIMOS || apuesta>usuario.getCreditos()){
            throw Error('Apuesta inválida o créditos insuficientes.');
        }
        usuario.setCreditos(-apuesta);
        this.apuesta = apuesta;
    }

    //Reparte una carta al arreglo indicado eliminandola
    private repartirCarta(mano: string[]){
        const indice = Math.floor(Math.random() * this.maso.length);
        mano.push(this.maso[indice]);
        this.maso.splice(indice, 1);
    }
    
    //Muestra una mano
    //  nombre: Nombre del propietario de la mano
    //  mano: listado de cartas
    //  ocultarUltima: Si debe mostrar o no la última carta de la mano
    private mostrarMano(nombre: string, mano: string[], ocultarUltima: boolean): void{
        let manoMostrar: string[] = [...mano];
        if (ocultarUltima){
            manoMostrar[mano.length-1]='[ ? ]'
        }
        console.log(`Mano de ${nombre}:`);
        console.log(manoMostrar);
    }

    //Genera la mano inicial (2 cartas para el jugador y la máquina)
    private generarManoInicial(usuario: Usuario): void{
        console.log(`Reparto inicial`);
        this.maso = [...MASO_INICIAL]; //Inicializo el maso        
        this.manoMaquina = [];
        this.manoUsuario = [];
        this.repartirCarta(this.manoUsuario);
        this.repartirCarta(this.manoUsuario);
        this.repartirCarta(this.manoMaquina);
        this.repartirCarta(this.manoMaquina);        
    }

}

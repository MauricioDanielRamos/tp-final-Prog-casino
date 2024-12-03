import { Juego } from "./Juego";
import { Usuario } from "./Usuario";
import { Util } from "./Util"
import * as rls from "readline-sync";

// Definimos un valor mínimo de creditos para poder jugar
const CREDITOS_MINIMOS: number = 150;
const VALOR_MINIMO_MAQUINA: number = 17;
const VALOR_BLACKJACK : number = 21;
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
       
        let volver: boolean = false;
        while (!volver){
            // Verifica si los créditos disponibles en la sesión son suficientes para poder jugar
            if (usuario.getCreditos() < CREDITOS_MINIMOS) {
                // Si los créditos son insuficientes, lanza un error
                throw new Error(`Error: Creditos insuficientes (${Util.convertirAPesosAR(usuario.getCreditos())}). (Mínimo: ${Util.convertirAPesosAR(CREDITOS_MINIMOS)})`);            
            }

            this.mostrarInstrucciones([{clave: '$<NOMBRE_USUARIO>', valor: usuario.getNombre()},
                                       {clave: '$<CREDITOS>', valor: Util.convertirAPesosAR(usuario.getCreditos())},
                                       {clave: '$<NOMBRE_JUEGO>', valor: this.getNombre()}
                                      ]);
            
            // Inicialmente solo se apostar o salir
            switch (rls.keyInSelect(['Apostar', 'Salir del Juego'], 'Opcion: ', {guide: false, cancel: false})){
                case 0: //Solicita la apuesta inicial
                        this.solicitarApuesta(usuario);
                        if (this.apuesta!==0){
                            //Reparte las cartas
                            this.generarManoInicial();
                            this.juegaUsuario(usuario); 
                        }
                        break;
                case 1: volver=true; break;
            }
        }
    }

    // Bucle de juego del usuario
    private juegaUsuario(usuario: Usuario): void{
        let continuar = true;
        let rendirse = false;
        let sePasoDe21 = false;
        while (continuar){
            console.clear();
            console.log('╔═══════════════════════════════════════════════════════════════════════════════════════════════╗');
            console.log('║                                   Guía para jugar a BlackJack                                 ║');
            console.log('╚═══════════════════════════════════════════════════════════════════════════════════════════════╝');
            console.log(`Jugador: ${usuario.getNombre()} Creditos: ${Util.convertirAPesosAR(usuario.getCreditos())} Apuesta: ${Util.convertirAPesosAR(this.apuesta)}`);
            console.log();

            //Muestra las manos en la etapa Inicial
            //this.mostrarMano('Maso: ', this.maso, false); // TEST
            this.mostrarMano('Maquina:', this.manoMaquina, true);
            this.mostrarMano(`${usuario.getNombre()} (${this.calcularMano(this.manoUsuario)})`, this.manoUsuario, false);                
            switch(rls.keyInSelect(['Pedir', 'Plantarse', 'Rendirse', 'Doblar'], 'Elije: ', {guide: false, cancel: false})){
                case 0: //Pedir carta
                        this.repartirCarta(this.manoUsuario); 
                        break
                case 1: //Plantarse
                        continuar = false;
                        break;
                case 2: //Rendirse
                        continuar=false;
                        rendirse = true;
                        break;
                case 3: //Doblar
                        if (usuario.getCreditos()<this.apuesta){
                            //Verifico que el usuario tenga creditos para doblar
                            console.error(`Error: Creditos insuficientes para doblar apuesta (${Util.convertirAPesosAR(usuario.getCreditos())}). (Apuesta: ${Util.convertirAPesosAR(this.apuesta)})`);                            
                            rls.keyInPause("Presione cualquier tecla para continuar...", {guide: false,});
                        }else{                            
                            // Se reparte una carta más a todo o nada xD
                            this.repartirCarta(this.manoUsuario);
                            //Duplico la apuesta
                            usuario.setCreditos(-this.apuesta);
                            this.apuesta*=2;
                            console.log(`${usuario.getNombre()} doblo su apuesta a ${Util.convertirAPesosAR(this.apuesta)}`);
                            continuar=false;
                        }
                        break;
            }
            // Validacioness
            if (this.calcularMano(this.manoUsuario)>21){
                sePasoDe21 = true;
                continuar = false;
            }

            //Muestra la mano de la maquina completa si ya terminó de ju
            if (!continuar){
                this.mostrarMano(`Maquina (${this.calcularMano(this.manoMaquina)})`, this.manoMaquina, false);
                this.mostrarMano(`${usuario.getNombre()} (${this.calcularMano(this.manoUsuario)})`, this.manoUsuario, false);
            }
        }

        // Si no se rinde juega la maquina
        if(!rendirse){
            //Turno de la maquina
            while (!sePasoDe21 && this.calcularMano(this.manoMaquina)<VALOR_MINIMO_MAQUINA){            
                this.repartirCarta(this.manoMaquina);
                this.mostrarMano(`Maquina (${this.calcularMano(this.manoMaquina)})`, this.manoMaquina, false);
            }        

            //Calculo los resultados de la partida
            this.calcularResultados(usuario);
        } else {
            //Se rindió
            let recupero: number = this.apuesta * 0.5;
            console.log(`${usuario.getNombre()} se ha rendido, recuperando ${Util.convertirAPesosAR(recupero)}`);
            usuario.setCreditos(recupero);
        }    

        rls.keyInPause("Presione cualquier tecla para continuar...", {guide: false,});
        
    } 

    // Retorna true si hay empate
    private esEmpate(): boolean{
        return this.calcularMano(this.manoMaquina)==this.calcularMano(this.manoUsuario);
    }

    // Retorna true si la mano pasada es BlackJack
    private esBlackJack(mano: string[]){
        return this.calcularMano(mano)==VALOR_BLACKJACK && mano.length==2
    }

    // Calcula los resultados de la partida
    private calcularResultados(usuario: Usuario): void{
        let ganancia : number = 0;
        //Se pasa el usuario
        if (this.calcularMano(this.manoUsuario)>21){
            console.log(`Te pasaste, gana la maquina`);        
       
        //Lógica de Empates
        }else if (this.esEmpate()){
            //Empate > Gana Maquina por BlackJack
            if (this.esBlackJack(this.manoMaquina)&&(!this.esBlackJack(this.manoUsuario))){
                console.log(`Gana Maquina con BlackJack`);
            //Empate > Gana Usuario por BlackJack    
            } else if (this.esBlackJack(this.manoUsuario)&&(!this.esBlackJack(this.manoMaquina))){
                console.log(`Gana ${usuario.getNombre()} con BlackJack`);            
                ganancia=(this.apuesta*2)+(this.apuesta*0.5); //Dobla la apuesta +50%    
            //Empatan por BlackJack
            } else if (this.esBlackJack(this.manoUsuario)&&(this.esBlackJack(this.manoMaquina))){
                console.log(`Empate de Black Jack. Recupera la apuesta.`);
                usuario.setCreditos(this.apuesta) //Recupera la apuesta;
            //Empate fuera de BlackJack
            } else { 
                console.log(`Empate a ${this.calcularMano(this.manoMaquina)}. Recupera la apuesta.`);
                usuario.setCreditos(this.apuesta);
            }
        
        // Las manos son diferentes
        } else {
            // Primero veo si gana el usuario por BlackJack
            if (this.esBlackJack(this.manoUsuario)){
                console.log(`Gana ${usuario.getNombre()} con BlackJack`);            
                ganancia=(this.apuesta*2)+(this.apuesta*0.5); //Dobla la apuesta +50%    

            //Se pasa la máquina (Ya ganó el usuario)
            } else if (this.calcularMano(this.manoMaquina)>VALOR_BLACKJACK){
                console.log(`Se paso la maquina. Gana ${usuario.getNombre()}`);
                ganancia=this.apuesta*2; //Dobla la apuesta        
            
            // Diferencia a puntos
            } else { 
                const difManoMaquina = VALOR_BLACKJACK - this.calcularMano(this.manoMaquina);
                const difManoUsuario = VALOR_BLACKJACK - this.calcularMano(this.manoUsuario);
                if (difManoUsuario<difManoMaquina){
                    console.log(`Gana ${usuario.getNombre()}`);
                    ganancia=this.apuesta*2; //Dobla la apuesta
                } else if (difManoMaquina<difManoUsuario){
                    console.log(`Gana la maquina`);
                }
            }
        }

        // Informo la ganancia si la hay
        if(ganancia!==0){
            console.log(`${usuario.getNombre()} ha ganado ${Util.convertirAPesosAR(ganancia)}`);
            usuario.setCreditos(ganancia);
        }
    }

    // Calcula el valor de una mano
    private calcularMano(mano: string[]): number{
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
        while (valor > VALOR_BLACKJACK && cantAses > 0) {
            valor -= 10; // Cambiar un as de 11 a 1
            cantAses--;
        }        
        return valor;
    }

    //Solicita al usuario que realice una apuesta
    private solicitarApuesta(usuario: Usuario): void{
        let apuesta: number = rls.questionInt(`Ingrese su apuesta (Minimo: ${Util.convertirAPesosAR(CREDITOS_MINIMOS)}): `, {unmatchMessage: 'Ingrese un valor de apuesta válido.'})
        if (apuesta<CREDITOS_MINIMOS || apuesta>usuario.getCreditos()){
            console.error('Apuesta invalida o creditos insuficientes.');
            rls.keyInPause("Presione cualquier tecla para continuar...", {guide: false,});
        }else{
            usuario.setCreditos(-apuesta);
            this.apuesta = apuesta;
        }
    }

    //Reparte una carta al arreglo indicado eliminandola
    private repartirCarta(mano: string[]): void{
        const indice = Math.floor(Math.random() * this.maso.length);
        mano.push(this.maso[indice]);
        this.maso.splice(indice, 1);
    }
    
    //Muestra una mano
    //  nombre: Nombre del propietario de la mano
    //  mano: listado de cartas
    //  ocultarUltima: Si debe mostrar o no la última carta de la mano
    /*private mostrarMano(nombre: string, mano: string[], ocultarUltima: boolean): void{
        let manoMostrar: string[] = [...mano];
        if (ocultarUltima){
            manoMostrar[mano.length-1]='[ ? ]'
        }
        console.log(`Mano de ${nombre}:`);
        console.log(manoMostrar);
        this.dibujarcartas(mano);
    }*/
    private mostrarMano(nombre: string, mano: string[], ocultarUltima: boolean): void{
        let encabezados: string = '';
        let numeros: string = '';
        let palos: string = '';
        let espacios: string = '';
        let pies: string = '';
        mano.forEach((carta, indice)=>{
            encabezados+='┌───┐';            
            let numero: string = carta.slice(1);
            if (ocultarUltima && indice == mano.length-1){
                numeros+=`│   │`;    
            }else if (numero == '10'){
                numeros+=`│ ${numero}│`;    
            }else{
                numeros+=`│  ${numero}│`;    
            }            
            if (ocultarUltima && indice == mano.length-1){
                palos+=`│ ? │`;    
            } else {
                palos+=`│ ${carta[0]} │`;
            }
            espacios+=`│   │`;
            pies+='└───┘';
        });
        console.log(`Mano de ${nombre}:`);
        console.log(encabezados);
        console.log(numeros);
        console.log(palos);
        console.log(espacios);
        console.log(pies);
    }

    //Genera la mano inicial (2 cartas para el jugador y la máquina) 
    private generarManoInicial(): void{
        console.log(`Reparto inicial`);
        this.maso = [...MASO_INICIAL]; //Inicializo el maso        
        this.manoMaquina = [];
        this.manoUsuario = [];
        this.repartirCarta(this.manoUsuario);        
        this.repartirCarta(this.manoMaquina);
        this.repartirCarta(this.manoUsuario);
        this.repartirCarta(this.manoMaquina);        
    }
}


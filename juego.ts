import { Jugador } from "./Jugador";

export class Juego extends Jugador {
    private premiomayor: number;
    private premiomedio: number;
    private premiomenor: number;
    private apuestaminima: number;
    private apuestamaxima: number;


    constructor(premiomayor: number, premiomedio: number, premiomenor: number, creditos: number, ticket: number, apuestaminima: number, apuestamaxima: number) {
        super(ticket, creditos);
        this.premiomayor = premiomayor;
        this.premiomedio = premiomedio;
        this.premiomenor = premiomenor;
        
        this.apuestaminima = apuestaminima;
        this.apuestamaxima = apuestamaxima;
    }

    // Getters
    public getpremiomayor(): number {
        return this.premiomayor;
    }
    public getpremiomedio(): number {
        return this.premiomedio;
    }
    public getpremiomenor(): number {
        return this.premiomenor;
    }
    public getcredito(): number {
        return this.creditos;
    }
    public getapuestaminima(): number {
        return this.apuestaminima;
    }
    public getapuestamaxima(): number {
        return this.apuestamaxima;
    }
    public getcreditos(): number {
        return this.creditos;
    }


    // Setters
    public setpremiomayor(): number {
        return this.premiomayor;
    }
    public setpremiomedio(): number {
        return this.premiomedio;
    }
    public setpremiomenor(): number {
        return this.premiomenor;
    }
    public setcredito(): number {
        return this.creditos;
    }
    public setapuestaminima(): number {
        return this.apuestaminima;
    }
    public setapuestamaxima(): number {
        return this.apuestamaxima;
    }
    public setcreditos(): number {
        return this.creditos;
    }
}
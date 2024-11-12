export class Jugador {
    protected ticket: number;
    protected creditos: number;
    
    constructor(ticket: number, creditos: number) {
        this.ticket = ticket;
        this.creditos = creditos;
    }

    // Getters
    public getTicket(): number {
        return this.ticket;
    }

    public getCreditos(): number {
        return this.creditos;
    }
    // Setters
    public setTicket(): number {
        return this.ticket;
    }

    public setCreditos(): number {
        return this.creditos;
    }

}
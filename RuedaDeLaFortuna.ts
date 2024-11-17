import * as rls from "readline-sync";

export class RuedaDeLaFortuna {
private premios: string[] = [
    "¡Perdiste!",
    "¡Perdiste!",
    "¡Perdiste!",
    "¡Perdiste!",
    "¡Perdiste!",
    "¡Perdiste!",
    "100",
    "200",
    "500",
    "1000",
];

constructor() {
    this.mostrarPremios();
    this.jugar();
}

private mostrarPremios(): void {
    console.log(" Bienvenido a la Rueda de la Fortuna ");
    console.log("Premios posibles:");
    this.premios.forEach((premio, index) => {
    console.log(`${index + 1}. ${premio}`);
    });
}

private jugar(): void {
    let deseaContinuar = true;
    while (deseaContinuar) {
        //Aqui va la apuesta
    const deseaJugar = rls
        .question("Quieres girar la rueda? (s/n): ")
        .toLowerCase();
    if (deseaJugar === "s") {
            console.log("\n Girando la rueda... ");
            const resultado = this.obtenerResultado();
            console.log(` Resultado: ${resultado}`);
            if (resultado.includes("Perdiste")) {
            console.log(" Mejor suerte la próxima vez.");
            } else {
            console.log(`¡Felicitaciones! Ganaste ${resultado} creditos.`);
            };
            const jugarNuevamente = rls.question("Quieres jugar otra vez? (s/n): ").toLowerCase();
            deseaContinuar = jugarNuevamente === "s";
            } else if (deseaJugar === "n") {
                console.log(`¡Gracias por jugar!`);
                break;
            } else {
                console.error(`Por favor, escribe una opción válida.`);
            }
    }
    console.log("Gracias por jugar. ¡Hasta la próxima!");
}

private obtenerResultado(): string {
    const indice = Math.floor(Math.random() * this.premios.length);
    return this.premios[indice];
    }
}

new RuedaDeLaFortuna();

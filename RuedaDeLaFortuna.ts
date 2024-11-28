import * as rls from "readline-sync";

export class RuedaDeLaFortuna {
private premios: string[] = [
    "¡Perdiste!",
    "¡Automovil 0km!",
    "¡Perdiste!",
    "¡Moto 250cc ENDURO!",
    "¡Perdiste!",
    "¡Viaje a Brasil!",
    "100",
    "200",
    "500",
    "1000",
];

constructor() {
    this.mostrarPremios();
    this.jugar();
}

private mostrarPremios(): void {        //funcion que muestra por consola los premios almacenados en el arreglo
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
    const deseaJugar = rls //Toma por teclado la apuesta del usuario
        .question("Quieres girar la rueda? (s/n): ")
        .toLowerCase();
    if (deseaJugar === "s") {
            console.log("\n Girando la rueda... ");//ante un si como respuesta gira la rueda
            const resultado = this.obtenerResultado(); //asigna a resultado el valor obtenido en obtenerResultado
            console.log(` Resultado: ${resultado}`);
            if (resultado.includes("Perdiste")) { // si resultado devuelve Perdiste,sale por si
            console.log(" Mejor suerte la próxima vez.");
            } else {
            console.log(`¡Felicitaciones! Ganaste ${resultado} creditos.`);
            };
            const jugarNuevamente = rls.question("Quieres jugar otra vez? (s/n): ").toLowerCase();// pregunta por teclado si juega de nuevo
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

private obtenerResultado(): string { //obitnene resultado con un numero aleatorio
    const indice = Math.floor(Math.random() * this.premios.length);
    return this.premios[indice];
    }
}

new RuedaDeLaFortuna();

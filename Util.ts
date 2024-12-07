import { readFileSync } from "fs";
import * as rls from "readline-sync";

export type ParValorClave = { clave: string, valor: any };
export class Util {
	//Lee un archivo indicado por nombreArchivo y lo retorna como un string
	//Si se pasan remplazos los realiza antes de hacer el return
	public static leerArchivo(nombreArchivo: string, reemplazos?: ParValorClave[]): string {
		let resultado: string = '';
		try {
			resultado = readFileSync(nombreArchivo, 'utf8');
			//Si se leyo algo
			if (resultado.length > 0) {
				//Si se pasaron reemplazos de texto
				if (reemplazos !== undefined) {
					reemplazos.forEach((reemplazo) => resultado = resultado.replace(reemplazo.clave, reemplazo.valor))
				}
			}
		} catch (error) {
			console.error(`${(error as Error).name}: ${(error as Error).message}`);
			rls.keyInPause("Presione cualquier tecla para continuar...", { guide: false }); // Pausa antes del volver al menú			
		}
		return resultado;
	}

	// Convierte un número a moneda argentina
	public static convertirAPesosAR(creditos: number): string {
		return `$ ${creditos.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2, })} ARS`;
	}

	// Solicita un ID por teclado 
	public static solicitarID(mensaje: string): number {
		while (true) {
			// Solicita el ID al usuario
			const input = rls.question(mensaje);
			if (input == "") {
				console.error("Error: El ID no puede estar vacío");
				continue;
			// Valida que el ID sea un número entero positivo
			} else if (!/^\d+$/.test(input)) {			
				console.error("Error: Solamente se permiten números enteros mayores a 0.");
				continue; // Repite el ciclo hasta que se proporcione un ID válido
			}
			// Convierte el ID ingresado a número entero
			return parseInt(input);
		}
	}

	//Solicita un monto por teclado y lo retorna
	public static solicitarMonto(mensaje: string): number {
		let monto: number;
		while (true) {
			// Solicita el monto que desea cargar
			let input = rls.question(mensaje).trim();

			if (input == "") {
				console.error("Error: El monto no puede estar vacío");
				continue;
			} else if (!/^\d+(?:[\.,]\d{1,2})?$/.test(input)) {
				console.error("Error: Monto inválido. (Pueden ingresarse números positivos enteros o decimales con 2 dígitos de precisión.")
				continue;
			} 
			
			//Si el usuario ingreso con "," la reemplazo por "." para que funcione el parseFloat
			input=input.replace(',','.'); 
			// Convierte el monto ingresado a número flotante y lo retorna
			return (monto = parseFloat(input));
		}
	}
}
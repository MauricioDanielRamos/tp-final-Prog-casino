import { readFileSync } from "fs";
import * as rls from "readline-sync";

export type ParValorClave = {clave: string, valor: any};
export class Util {    
    //Lee un archivo indicado por nombreArchivo y lo retorna como un string
    //Si se pasan remplazos los realiza antes de hacer el return
    public static leerArchivo(nombreArchivo: string, reemplazos?: ParValorClave[]): string{
        let resultado : string = '';
        try{
            resultado = readFileSync(nombreArchivo,'utf8');
            //Si se leyo algo
            if (resultado.length>0){
                //Si se pasaron reemplazos de texto
                if (reemplazos!==undefined){
                    reemplazos.forEach((reemplazo)=>resultado = resultado.replace(`/${reemplazo.clave}/g`, reemplazo.valor))
                }            
            }
        } catch (error) {
            console.error(`${(error as Error).name}: ${(error as Error).message}`);
            rls.keyInPause("Presione cualquier tecla para continuar...", {guide: false}); // Pausa antes del volver al menú			
        }
        return resultado;
    }
    
    // Convierte un número a moneda argentina
    public static convertirAPesosAR(creditos: number): string{
        return `$ ${creditos.toLocaleString("es-AR", {minimumFractionDigits: 2,maximumFractionDigits: 2,})} ARS`;
    }
}
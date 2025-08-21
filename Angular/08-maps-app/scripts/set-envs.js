// Importamos dos funciones del módulo 'fs' (File System) nativo de Node.js:
// - writeFileSync: escribe datos en un archivo de forma sincrónica, bloqueando el hilo hasta que termina.
// - mkdirSync: crea directorios de forma sincrónica, con opciones como crear recursivamente carpetas padres.
const { writeFileSync, mkdirSync } = require("fs");

// Importamos dotenv, una librería que permite cargar variables de entorno desde un archivo .env
// Esto permite acceder a process.env con las variables definidas localmente sin necesidad de configurarlas en el sistema.
// La función config() lee el archivo .env y asigna las variables al entorno.
require('dotenv').config();

// Definimos las rutas de los archivos donde se va a generar la configuración de Angular.
// Angular usa archivos TS de entorno (environment.ts) para configurar variables según modo desarrollo o producción.
const targetPath = './src/environments/environment.ts' // Archivo para producción
const targetPathDev = './src/environments/environment.development.ts' // Archivo para desarrollo

// Obtenemos la clave de Mapbox desde las variables de entorno cargadas.
// process.env es un objeto global de Node.js que contiene todas las variables de entorno.
const mapboxKey = process.env['MAPBOX_KEY'];

// Validamos que la variable esté definida, si no lanzamos un error para evitar crear archivos incompletos.
if (!mapboxKey) {
  throw new Error('MAPBOX_KEY is not set');
}

// Contenido que se va a escribir en los archivos de entorno.
// Definimos un template literal que contiene un objeto environment exportado,
// con la clave mapboxKey asignada al valor leído desde la variable de entorno.
// Este archivo luego se importa en Angular para usar la API Key.
const envFileContent = `
export const environment = {
  mapboxKey: "${mapboxKey}"
};
`

// Creamos la carpeta ./src/environments si no existe.
// El flag { recursive: true } indica que se creen todas las carpetas padre necesarias.
mkdirSync('./src/environments', {recursive: true});

// Escribimos el contenido en los dos archivos:
// - Uno para producción (usado con `ng build --configuration production`)
// - Uno para desarrollo (por defecto en `ng serve`)
writeFileSync(targetPath, envFileContent);
writeFileSync(targetPathDev, envFileContent);

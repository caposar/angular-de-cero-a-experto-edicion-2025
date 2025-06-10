//**********************************************/
//* Desestructuración de objetos en TypeScript */
//**********************************************/

interface AudioPlayer {
    audioVolume: number;
    songDuration: number;
    song: string;
    details: Details;
}

interface Details {
    author: string;
    year: number;
}

const audioPlayer: AudioPlayer = {
    audioVolume: 90,
    songDuration: 36,
    song: "Mess",
    details: {
        author: "Ed Sheeran",
        year: 2015
    }
};

const song = 'New Song';

// const { songDuration:duration, song:anotherSong, details:{ author } } = audioPlayer; // OTRA FORMA DE DESESTRUCTURAR

const { songDuration:duration, song:anotherSong, details } = audioPlayer;
const { author } = details;

// console.log("Song: ", anotherSong);
// console.log("Duration: ", duration);
// console.log("Author: ", author);

//***********************************************/
//* Desestructuración de arreglos en TypeScript */
//***********************************************/

// Sin desestructuracion
// const dbz: string[] = ['Goku', 'Vegeta', 'Trunks'];
// const trunks = dbz[3] || 'No hay personaje';

// Con desestructuracion
const [ , ,trunks = 'Not found']: string[] = ['Goku', 'Vegeta'];

console.error('Personaje 3: ', trunks);
const name: string = 'Strider';
let hpPoints: number | 'FULL' = 95;
const isAlive: boolean = true;

hpPoints = 'FULL'; // This is allowed because of the union type

console.log({ name, hpPoints, isAlive });
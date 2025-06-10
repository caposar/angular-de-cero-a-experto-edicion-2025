export class Person {
//   public name: string;
//   private address: string;

//   constructor(name: string, address: string) {
//     this.name = name;
//     this.address = address;
//   }

    // OTRA FORMA MAS CORTA DE HACERLO
    constructor(
        public firstName: string, 
        public lastName: string, 
        private address: string = 'No address provided'
    ) {}
}

// export class Hero extends Person {
//     constructor(
//         public alterEgo: string,
//         public age: number,
//         public realName: string,
//     ) {
//         super(realName, 'New York'); // Llamada al constructor de la clase base Person
//     }
// }

export class Hero {

    // public person: Person;

    constructor(
        public alterEgo: string,
        public age: number,
        public realName: string,
        public person: Person,
    ) {
        // this.person = new Person(realName);
    }
}

const tony = new Person('Tony', 'Stark', 'New York');
const ironman = new Hero('Ironman', 45, 'Tony', tony);

console.log(ironman);
  
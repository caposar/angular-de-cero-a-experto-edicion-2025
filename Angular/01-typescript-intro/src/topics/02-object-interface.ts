const skills: string[] = ['Bash', 'Counter', 'Healing'];

interface Character {
    name: string;
    hp: number;
    skills: string[];
    hometown?: string;
};

const strider: Character = {
    name: 'Hero',
    hp: 100,
    skills: ['Bash', 'Counter']
};

strider.hometown = 'Rivendell'; // Optional property can be added later

console.table(strider);

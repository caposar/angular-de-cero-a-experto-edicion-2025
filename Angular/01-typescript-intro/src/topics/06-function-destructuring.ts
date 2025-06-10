export interface Product {
    description: string;
    price: number;
}

const phone: Product = {
    description: 'Nokia A1',
    price: 150.0
};

const tablet: Product = {
    description: 'iPad Air',
    price: 250.0
};

interface TaxCalculationOptions {
    tax: number;
    products: Product[];
}

// Sin desestructuracion

// function taxCalculation(options: TaxCalculationOptions): number[] {
//     let total = 0;

//     options.products.forEach(product => {
//         total += product.price;
//     });

//     return [total, total * options.tax];
// }

// const shoppingCart: Product[] = [phone, tablet];
// const tax = 0.15;

// const result = taxCalculation({
//     products: shoppingCart,
//     tax: tax
// });

// console.log('Total: ', result[0]);
// console.log('Tax: ', result[1]);


// Con desestructuracion

// El problema de desestructurar en la definición de los parámetros es que si TaxCalculationOptions crece mucho,
// la firma de la función se vuelve difícil de leer y mantener.
// export function taxCalculation({ tax, products }: TaxCalculationOptions): [number, number] { 
export function taxCalculation(options: TaxCalculationOptions): [number, number] {
    let total = 0;

    const { tax, products } = options;

    // products.forEach(product => {
    //     total += product.price;
    // });

    products.forEach(({price}) => {
        total += price;
    });

    return [total, total * tax];
}

const shoppingCart: Product[] = [phone, tablet];
const tax = 0.15;

const [total, taxTotal] = taxCalculation({
    products: shoppingCart,
    tax: tax
});

console.log('Total: ', total);
console.log('Tax: ', taxTotal);
let anterior = 0;
let actual = 1;

console.log(anterior);
console.log(actual);

for (let i = 2; i < 50; i++) {
  let siguiente = anterior + actual;
  console.log(siguiente);

  anterior = actual;
  actual = siguiente;
}
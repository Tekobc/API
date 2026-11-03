function sonAnagramas(palabra1, palabra2) {
  if (palabra1 === palabra2) {
    return false;
  }

  if (palabra1.length !== palabra2.length) {
    return false;
  }

  let conteo1 = {};
  let conteo2 = {};

  for (let i = 0; i < palabra1.length; i++) {
    let letra = palabra1[i];
    if (conteo1[letra] === undefined) {
      conteo1[letra] = 1;
    } else {
      conteo1[letra] = conteo1[letra] + 1;
    }
  }

  for (let i = 0; i < palabra2.length; i++) {
    let letra = palabra2[i];
    if (conteo2[letra] === undefined) {
      conteo2[letra] = 1;
    } else {
      conteo2[letra] = conteo2[letra] + 1;
    }
  }

  for (let letra in conteo1) {
    if (conteo1[letra] !== conteo2[letra]) {
      return false;
    }
  }

  for (let letra in conteo2) {
    if (conteo2[letra] !== conteo1[letra]) {
      return false;
    }
  }

  return true;
}

console.log(sonAnagramas("amor", "roma"));
console.log(sonAnagramas("hola", "hola"));
console.log(sonAnagramas("perro", "roble"));
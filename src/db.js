import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'isft118',
  database: 'restaurantHub',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;

// Establecer rutas en routes + registro bycrypt, condiciones en model, establecer reglas para la creacion de los datos, que el email sea valido en formato (regex), reglas para la contraseña, que tenga mayusculas, minusculas, numeros y caracteres especiales, que tenga un minimo de 8 caracteres, que el nombre y apellido no tengan numeros ni caracteres especiales, que el nombre y apellido tengan un minimo de 2 caracteres y un maximo de 50 caracteres, que el id sea autoincrementable y unico, que el email sea unico, que el email sea obligatorio, que la contraseña sea obligatoria, que el nombre y apellido sean obligatorios.
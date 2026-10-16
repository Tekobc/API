const nombreRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]{2,50}$/;
const apellidoRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]{2,50}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

if (!nombre || !apellido || !email || !password) {
    return { valid: false, message: 'Todos los campos son obligatorios.' };
}

if (nombreRegex.test(nombre) && apellidoRegex.test(apellido) && emailRegex.test(email) && passwordRegex.test(password)) {
    return { valid: true, message: 'Validación exitosa.' };
}
export function validateUserData(nombre, apellido, email, password) {
    return validateUserData(nombre, apellido, email, password);
}
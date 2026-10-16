14. Ejercicios propuestos
Nivel básico
2.
3.
4.
Ejecutá npm run demo y explicá con tus palabras qué ocurre en el PASO 5.
Copiá un token real del login y pegalo en jwt.io. ¿Qué campos ves? ¿por qué no aparece la
contraseña?
Modificá a '30s', reiniciá la API, logueate y esperá treinta segundos. Hacé GET
/api/usuarios/perfil. ¿Qué código HTTP recibís? ¿Qué mensaje?
Registrá un usuario y consultá la tabla usuarios en MySQL Workbench. ¿Qué valor tiene la columna
rol? ¿Y estado_id? ¿Quién los asignó?
Nivel intermedio
5.
6.
7.
8.
Creá el endpoint GET /api/usuarios/admin/lista que devuelva todos los usuarios. Debe ser accesible
solo si req.usuario.rol 'admin'. Pista: creá un middleware soloAdmin y encadenalo después de
verificarAuth.
Implementá POST /api/usuarios/logout y explicá qué debería hacer. ¿Puede el servidor invalidar el
token que ya entregó? ¿Qué alternativas existen?
Agregá el cambio de contraseña en PUT /api/usuarios/password como ruta protegida. Debe pedir la
contraseña actual, compararla con bcrypt.compare, hashear la nueva y actualizarla. ¿Qué debería
pasar con el token que el usuario ya tenía en la mano?
Agregá una columna rol_admin a la respuesta del login y verificá que el frontend pueda usarla para
mostrar u ocultar el botón de administración. ¿Es suficiente eso como control de seguridad? ¿Por
qué no?
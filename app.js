import express from 'express';
import usuarioRoutes from './routes/usuario.route.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/api', usuarioRoutes);

const personas = [
  {
    id: 1,
    nombre: "Esteban",
    apellido: "Balladares"
  },
  {
    id: 2,
    nombre: "Thiago",
    apellido: "Pérezleal"
  }
];

app.get("/personas", (req, res) => {
  res.status(200).json(personas);
});



/* 
app.post("/crear", (req, res) => {

    const { id, nombre, apellido} = req.body;
    const nuevaPersona = {id, nombre, apellido}; 
    personas.push(nuevaPersona); 
    //console.log(id, nombre, apellido);
    console.log(req.body);
    res.status(201).json(nuevaPersona);

});
    
*/ 

app.post("/crear", (req, res) => {
  console.log("Content-Type:", req.headers["content-type"]);
  console.log("Body:", req.body);

  const { id, nombre, apellido } = req.body;

  const nuevaPersona = {
    id,
    nombre,
    apellido
  };

  personas.push(nuevaPersona);

  res.status(201).json(nuevaPersona);
});

app.post("/crear2", (req, res) => {

    const user  = req.body;
    //const nuevaPersona = {id, nombre, apellido}; 
    //personas.push(nuevaPers ona); 
    //console.log(id, nombre, apellido);
    console.log(req.body);
    //res.status(201).json(nuevaPersona);

});

app.get("/personas/nombres", (req, res) => {
  const nombres = personas.map(persona => ({
    nombre: persona.nombre
  }));

  res.status(200).json(nombres);
});


app.put("/put/:id", (req, res) => {
  const id = Number(req.params.id);
  const { nombre, apellido } = req.body;

  let personaEncontrada = null;

  for (let i = 0; i < personas.length; i++) {
    if (personas[i].id === id) {
      personaEncontrada = personas[i];
      personaEncontrada.nombre = nombre;
      personaEncontrada.apellido = apellido;
      res.status(200).json({
      mensaje: "Persona actualizada correctamente",
      persona: personaEncontrada
      });
    }
  }

  if (!personaEncontrada) {
    return res.status(404).json({
      mensaje: "Persona no encontrada"
    });
  }

  

  
});
  

// app.put("/put/:id", (req, res) => {
//   const id = Number(req.params.id);
//   const { nombre, apellido } = req.body;
//       for (let i = 0; i < personas.length; i++) {
//   console.log(personas[i].nombre);
//     }
//   // if (!persona) {
//   //   return res.status(404).json({
//   //     mensaje: "Persona no encontrada"
//   //   });
//   // }

//   persona.nombre = nombre;
//   persona.apellido = apellido;

//   res.status(200).json({
//     mensaje: "Persona actualizada correctamente",
//     persona
//   });
// });


// app.put("/personas/:id", (req, res) => {
//   const id = Number(req.params.id);
//   const  apellido  = req.body

//   const persona = personas.find(persona => persona.id === id);

//   if (!persona) {
//     return res.status(404).json({
//       mensaje: "Persona no encontrada"
//     });
//   }

//   if (!apellido) {
//     return res.status(400).json({
//       mensaje: "El apellido es obligatorio"
//     });
//   }

//   persona.apellido = apellido;

//   res.status(200).json({
//     mensaje: "Apellido actualizado correctamente",
//     persona
//   });
// });


app.delete("/delete/:id", (req, res) => {
  const id = Number(req.params.id);

  const indice = personas.findIndex(persona => persona.id === id);

  if (indice === -1) {
    return res.status(404).json({
      mensaje: "Persona no encontrada"
    });
  }

  const personaEliminada = personas.splice(indice, 1);

  res.status(200).json({
    mensaje: "Persona eliminada correctamente",
    persona: personaEliminada[0]
  });
});


app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});



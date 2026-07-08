import http from 'http';

const puerto = 3000;

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');

        res.end(
            JSON.stringify({
                "Esteban Balladares": "Bienvenido a la API REST de gestión de restaurantes"
            })
        );
    } else if(req.url === '/') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');

            res.end('en Texto: Bienvenido a la API REST de gestión de restaurantes');
        }
            else if (req.url === '/') {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');

            res.end('<h1>en HTML: Bienvenido a la API REST de gestión de restaurantes</h1>');
        }
    else {
        res.statusCode = 404;
        res.end('Not Found');
    }
});

server.listen(puerto, () => {
    console.log(`Servidor corriendo en http://localhost:${puerto}`);
});
import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import viewsRouter from './routes/views.router.js';
import routerProducts from './routes/products.router.js';
import routerCarts from './routes/carts.router.js';
import { Server } from 'socket.io';

const app = express();
const httpServer = app.listen(8080, () =>
  console.log('Listening on PORT 8080')
);
const io = new Server(httpServer);

app.engine('handlebars', handlebars.engine());

//Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
//Routers
app.use(express.static(__dirname + '/public'));
app.use('/', viewsRouter);
app.use('/api/products', routerProducts);
app.use('/api/carts', routerCarts);

//reglas
app.get('/ping', (req, res) => {
  res.send('Pong');
});
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');
  socket.emit('hello', 'world');
});
app.set('socketio', io);

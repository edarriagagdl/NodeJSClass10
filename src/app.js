import express from 'express';
import handlebars from 'express-handlebars';
import bodyParser from 'body-parser';
import __dirname from './utils.js';
import viewsRouter from './routes/views.router.js';
import routerProducts from './routes/products.routerDB.js';
import routerCarts from './routes/carts.routerDB.js';
import routerMessages from './routes/messages.routerDB.js';
import { Server } from 'socket.io';
import mongoose, { mongo } from 'mongoose';

const app = express();
const httpServer = app.listen(8080, () =>
  console.log('Listening on PORT 8080')
);
const io = new Server(httpServer);
const mongoURI =
  'mongodb+srv://edarriaga:Z1TM1mLNpRWFlVGI@cluster0.r0wdwnb.mongodb.net/?retryWrites=true&w=majority';

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(() => {
    console.log("Couldn't connect to MongoDB");
  });

app.engine('handlebars', handlebars.engine());

//Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
//app.use(express.urlencoded({ extended: true }));
//Routers
app.use(express.static(__dirname + '/public'));
app.use('/', viewsRouter);
app.use('/api/products', routerProducts);
app.use('/api/carts', routerCarts);
app.use('/messages', routerMessages);

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

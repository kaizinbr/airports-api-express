import express from 'express';
import morgan from 'morgan';
import router from './routes.js';
import Food from './database/Food.js';



const app = express();

app.use(express.json());

app.use(morgan('tiny'));

app.use(express.static('public'));

app.use(router);

Food.loadSeed();

app.listen(3000, ()=> console.log('Rodando 😈 !!!!'));
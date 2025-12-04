import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router } from './routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3333;

// Middlewares
app.use(cors()); // Habilita CORS para todas as origens
app.use(express.json()); // Habilita o parsing de JSON no corpo das requisições

// Rotas
app.use(router);

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});

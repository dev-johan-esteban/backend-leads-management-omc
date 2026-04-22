import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './database/db.js';
import './models/LeadModel.js';
dotenv.config();
import LeadRoutes from './routes/LeadRoutes.js';
import aiRoutes from './routes/AIRoutes.js';

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

// Probar conexión y sincronizar base de datos
try {
  await db.authenticate();
  console.log('Conexión exitosa a PostgreSQL');
  
  // db.sync({ alter: true }) crea las tablas si no existen según el modelo
  await db.sync({alter: true}); 
  console.log('Tablas sincronizadas');
} catch (error) {
  console.error('Error de conexión:', error);
}

app.use('/leads', LeadRoutes);
app.use('/ai', aiRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
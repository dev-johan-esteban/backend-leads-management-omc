import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './database/db.js';
import './models/LeadModel.js';
import LeadRoutes from './routes/LeadRoutes.js';
import aiRoutes from './routes/AIRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/leads', LeadRoutes);
app.use('/ai', aiRoutes);

app.get('/', (req, res) => res.send('API funcionando localmente'));

const PORT = process.env.PORT || 8080;

// Primero encendemos el servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});

// Luego intentamos la conexión a la DB de forma independiente
db.authenticate()
    .then(() => {
        console.log('DB Conectada');
        return db.sync({ alter: true });
    })
    .then(() => console.log('tablas listas'))
    .catch(err => console.error('❌ Error de DB:', err));
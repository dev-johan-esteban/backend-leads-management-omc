import Lead from './models/LeadModel.js';
import db from './database/db.js';

const leadsSeed = [
    { nombre: "Laura Cano", email: "laura@example.com", fuente: "instagram", presupuesto: 1500 },
    { nombre: "Roberto Gomez", email: "roberto@example.com", fuente: "facebook", presupuesto: 2500 },
    { nombre: "Beatriz Pinzon", email: "betty@example.com", fuente: "referido", presupuesto: 4000 },
    { nombre: "Nicolas Mora", email: "nico@example.com", fuente: "landing_page", presupuesto: 900 },
    { nombre: "Daniel Valencia", email: "daniel@example.com", fuente: "otro", presupuesto: 3000 },
    { nombre: "Marcela Valencia", email: "marcela@example.com", fuente: "instagram", presupuesto: 2200 },
    { nombre: "Patricia Fernandez", email: "peliteñida@example.com", fuente: "facebook", presupuesto: 100 },
    { nombre: "Freddy Contreras", email: "freddy@example.com", fuente: "referido", presupuesto: 500 },
    { nombre: "Hugo Lombardi", email: "hugo@example.com", fuente: "landing_page", presupuesto: 3500 },
    { nombre: "Mario Calderon", email: "mario@example.com", fuente: "instagram", presupuesto: 1800 }
];

const runSeed = async () => {
    try {
        await db.authenticate();
        // bulkCreate inserta múltiples registros de un solo golpe
        await Lead.bulkCreate(leadsSeed);
        console.log('Base de datos poblada con 10 leads de ejemplo exitosamente');
        process.exit(0); // Cerrar el proceso con éxito
    } catch (error) {
        console.error('Error al ejecutar el seed:', error);
        process.exit(1); // Cerrar con error
    }
};

runSeed();
import { GoogleGenerativeAI } from "@google/generative-ai";
import Lead from '../models/LeadModel.js';
import { Op } from 'sequelize';



export const getLeadsSummary = async (req, res) => {
    try {
        const { fuente, fechaInicio, fechaFin } = req.body;

        // obtener los leads de la DB segun filtros
        const where = {};
        if (fuente) where.fuente = fuente;
        if (fechaInicio && fechaFin) {
            where.createdAt = { [Op.between]: [new Date(fechaInicio), new Date(fechaFin)] };
        }

        const leads = await Lead.findAll({ where });

        if (leads.length === 0) {
            return res.status(404).json({ message: "No hay leads para analizar." });
        }

        // preparar el texto para la IA
        const leadsTexto = leads.map(l => 
            `- Lead: ${l.nombre}, Fuente: ${l.fuente}, Presupuesto: ${l.presupuesto}, Interés: ${l.producto_interes}`
        ).join('\n');

        // configurar Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `
            actua como un experto analista de negocios. Analiza estos leads de mi CRM:
            ${leadsTexto}
            Genera un resumen ejecutivo breve con:
            1. analisis general.
            2. fuente principal.
            3. 3 recomendaciones estrategicas.
            Responde en español.
        `;

        // generar contenido
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // retornar el resumen
        return res.status(200).json({ resumen_ia: text });

    } catch (error) {
        console.error("Error con Gemini:", error);
        return res.status(500).json({ message: "Error al conectar con la IA" });
    }
};
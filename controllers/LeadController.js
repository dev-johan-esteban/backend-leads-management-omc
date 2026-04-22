import Lead from '../models/LeadModel.js';
import { Op, fn, col } from 'sequelize';//operadores de Sequelize


 // Logica para registrar un nuevo lead (POST /leads)
 // incluye validaciones obligatorias de nombre, email y fuente
export const createLead = async (req, res) => {
    try {
        const {
            nombre, email, telefono, fuente, producto_interes, presupuesto } = req.body;

        // crear el registro en la base de datos
        // Sequelize validara automaticamente el formato de email, el largo del nombre 
        // y los valores permitidos de la fuente segun definimos en el modelo.
        const nuevoLead = await Lead.create({
            nombre,
            email,
            telefono,
            fuente,
            producto_interes,
            presupuesto
        });

        // respuesta exitosa HTTP 201 Created
        return res.status(201).json({
            message: "Lead registrado exitosamente",
            data: nuevoLead
        });

    } catch (error) {

        // Error cuando el email ya existe (HTTP 409 Conflict)
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                message: "Error: El email ya se encuentra registrado en el sistema"
            });
        }

        // Errores de validación (campos obligatorios, formato email, largo nombre) (HTTP 400 Bad Request)
        if (error.name === 'SequelizeValidationError') {
            // Mapeamos los errores para enviar mensajes claros al usuario
            const erroresValidacion = error.errors.map(err => err.message);
            return res.status(400).json({
                message: "Error de validación en los datos enviados",
                errors: erroresValidacion
            });
        }

        // Error genérico del servidor (HTTP 500 Internal Server Error)
        console.error("Error al crear lead:", error);
        return res.status(500).json({
            message: "Ocurrió un error inesperado en el servidor",
            error: error.message
        });
    }
};


export const getAllLeads = async (req, res) => {
    try {
        const { page = 1, limit = 10, fuente, fechaInicio, fechaFin } = req.query;

        // Calculamos cuantos registros saltar
        const offset = (page - 1) * limit;

        // CONFIGURAR FILTROS (WHERE)
        const where = {};

        // Filtro por fuente (si viene en la URL)
        if (fuente) {
            where.fuente = fuente;
        }

        // Filtro por rango de fechas (created_at)
        if (fechaInicio && fechaFin) {
            where.created_at = {
                [Op.between]: [new Date(fechaInicio), new Date(fechaFin)]
            };
        }

        // CONSULTA A LA BASE DE DATOS
        // findAndCountAll nos devuelve el total y los registros, ideal para paginación
        const { count, rows } = await Lead.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']] // ordenar por recientes primero
        });

        // RESPUESTA CON METADATOS DE PAGINACIÓN
        return res.status(200).json({
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            leads: rows
        });

    } catch (error) {
        console.error("Error al obtener leads:", error);
        return res.status(500).json({ message: "Error al obtener la lista de leads" });
    }
};



// obtener UN lead por ID
export const getLeadById = async (req, res) => {
    try {
        const { id } = req.params;
        const lead = await Lead.findByPk(id);

        if (!lead) {
            return res.status(404).json({ message: "Lead no encontrado" });
        }

        return res.status(200).json(lead);
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener el lead" });
    }
};

// actualizar lead (PATCH)
export const updateLead = async (req, res) => {
    try {
        const { id } = req.params;
        const lead = await Lead.findByPk(id);

        if (!lead) {
            return res.status(404).json({ message: "Lead no encontrado" });
        }

        // Actualizamos solo los campos que vengan en el body
        await lead.update(req.body);

        return res.status(200).json({
            message: "Lead actualizado correctamente",
            data: lead
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: "El email ya está en uso por otro lead" });
        }
        return res.status(500).json({ message: "Error al actualizar el lead" });
    }
};

// eliminar lead Soft Delete
export const deleteLead = async (req, res) => {
    try {
        const { id } = req.params;
        const lead = await Lead.findByPk(id);

        if (!lead) {
            return res.status(404).json({ message: "Lead no encontrado" });
        }

        // al tener 'paranoid: true' en el modelo, destroy() no borra la fila, 
        // solo llena la columna 'deletedAt'.
        await lead.destroy();

        return res.status(200).json({ message: "Lead eliminado (Soft Delete) correctamente" });
    } catch (error) {
        return res.status(500).json({ message: "Error al eliminar el lead" });
    }
};

export const getLeadStats = async (req, res) => {
    try {
        // total de leads (excluyendo los borrados por el soft delete)
        const totalLeads = await Lead.count();

        // leads por fuente
        const leadsPorFuente = await Lead.findAll({
            attributes: [
                'fuente',
                [fn('COUNT', col('fuente')), 'cantidad']
            ],
            group: ['fuente']
        });

        // promedio de presupuesto
        const promedioPresupuesto = await Lead.findAll({
            attributes: [
                [fn('AVG', col('presupuesto')), 'promedio']
            ]
        });

        // leads de los ultimos 7 dias
        const haceSieteDias = new Date();
        haceSieteDias.setDate(haceSieteDias.getDate() - 7);

        const leadsUltimosSieteDias = await Lead.count({
            where: {
                createdAt: {
                    [Op.gte]: haceSieteDias
                }
            }
        });

        // Responder con todo el objeto de estadísticas
        return res.status(200).json({
            total_leads: totalLeads,
            leads_por_fuente: leadsPorFuente,
            promedio_presupuesto: parseFloat(promedioPresupuesto[0].dataValues.promedio || 0).toFixed(2),
            leads_ultimos_7_dias: leadsUltimosSieteDias
        });

    } catch (error) {
        console.error("Error en estadísticas:", error);
        return res.status(500).json({ message: "Error al generar estadísticas" });
    }
};
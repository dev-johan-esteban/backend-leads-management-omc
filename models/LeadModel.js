import { DataTypes } from 'sequelize';
import db from '../database/db.js';

const Lead = db.define('Lead', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 255]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fuente: {
    type: DataTypes.ENUM('instagram', 'facebook', 'landing_page', 'referido', 'otro'),
    allowNull: false
  },
  producto_interes: {
    type: DataTypes.STRING,
    allowNull: true
  },
  presupuesto: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true
  }
}, {
  // Soft Delete no borra el registro, solo le pone fecha de eliminacion
  paranoid: true, 
  tableName: 'leads'
});

export default Lead;
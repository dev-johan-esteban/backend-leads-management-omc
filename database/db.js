import { Sequelize } from 'sequelize';
import 'dotenv/config';

const db = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // no muestra los logs
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // propiedad necesaria para neon
    }
  },
  define: {
    
    timestamps: true, // esta propiedad asegura que sequelize use created_at y updated_at automaticamente
    underscored: true, // le dice que se usa nombres de columna con guion bajo que es un estandar en sql
  }
});

export default db;
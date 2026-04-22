-- se crea el tipo enumerado con las opciones permitidas
CREATE TYPE "enum_leads_fuente" AS ENUM (
    'instagram', 
    'facebook', 
    'landing_page', 
    'referido', 
    'otro'
);

-- se crea la tabla utilizando ese tipo para la columna fuente
CREATE TABLE IF NOT EXISTS "leads" (
    "id" SERIAL PRIMARY KEY,
    "nombre" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "telefono" VARCHAR(255),
    "fuente" "enum_leads_fuente" NOT NULL, -- Aquí se aplica el ENUM
    "producto_interes" VARCHAR(255),
    "presupuesto" DECIMAL(12, 2),
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "deletedAt" TIMESTAMP WITH TIME ZONE
);
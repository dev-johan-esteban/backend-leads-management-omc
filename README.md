# Prueba Técnica - Backend CRM Leads API

Esta es una API REST desarrollada con Node.js para la gestión de prospectos (Leads), integrada con la IA de Gemini para generar resúmenes ejecutivos y desplegada en Google Cloud Run

---

## Tecnologías Utilizadas

* Runtime: Node.js (v22.x)
* Framework: Express.js
* Base de Datos: PostgreSQL (Alojada en Neon.tech)
* ORM: Sequelize
* IA: Google Gemini SDK (@google/generative-ai)
* Contenerización: Docker
* Cloud: Google Cloud Run (PaaS)
* Testing: Jest & Supertest

---

## URL del Proyecto (En Vivo)

La API se encuentra desplegada y operativa en la siguiente dirección:
🔗 [https://crm-leads-api-54644131242.us-central1.run.app](https://crm-leads-api-54644131242.us-central1.run.app)

---

## Instalación y Ejecución Local

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/dev-johan-esteban/backend-leads-management-omc.git
   cd prueba-backend-omc


### 2. Instalar dependencias
npm install

### 3. Configurar variables de entorno
Crea un archivo .env en la raíz del proyecto y añade lo siguiente:
PORT=8080
DATABASE_URL=postgresql:<db>
GEMINI_API_KEY=<ApiKey>

### 4. Ejecutar el servidor
npm start
El servidor estará disponible en http://localhost:8080.

---

## 🧪 Pruebas Automatizadas (Tests)

Se ha implementado una suite de pruebas de integración para asegurar la calidad de los endpoints. Para correr los tests, ejecuta:

# En PowerShell (Windows)
$env:NODE_ENV="test"; npm test

# En Linux/Mac o CMD
npm test

Pruebas incluidas:
* Verificación de disponibilidad de la ruta raíz.
* Listado de leads (validación de estructura paginada).
* Validación de errores en el POST de leads (campos obligatorios).

---

## Documentación de Endpoints

### Gestión de Leads
* GET /leads: Retorna la lista de leads con soporte para paginación (page, limit) y filtrado por fuente

* GET /leads/stats: Endpoint analítico que devuelve métricas clave (total de leads, distribución por fuente y promedio de presupuestos)

* GET /leads/:id: Obtiene el detalle completo de un lead específico mediante su ID

* POST /leads: Registra un nuevo lead en el sistema
Payload: {"nombre": "Juan", "email": "juan@test.com", "fuente": "facebook", "presupuesto": 1500}

* PATCH /leads/:id: Actualiza parcialmente los datos de un lead existente

* DELETE /leads/:id: Realiza un borrado lógico (Soft Delete) del lead, manteniendo la integridad referencial

###  Inteligencia Artificial

* POST /ai/summary: Genera un resumen ejecutivo inteligente analizando todos los leads en la base de datos (distribución por fuente, presupuesto total y sugerencias estratégicas).

---

## Docker

El proyecto incluye un Dockerfile optimizado para producción. Para construir y correr la imagen localmente:

docker build -t crm-leads-api .
docker run -p 8080:8080 crm-leads-api

---

## Características Destacadas
* Resiliencia: Configuración de arranque que prioriza la disponibilidad del puerto sobre la conexión a la DB para evitar fallos de despliegue en la nube.
* Seguridad: Uso de variables de entorno para manejar credenciales sensibles.
* Escalabilidad: Preparado para crecer mediante el uso de contenedores e infraestructura serverless.

---

## Autor
* Desarrollador: Johan Esteban Cañola Olarte
* Fecha: Abril 2026
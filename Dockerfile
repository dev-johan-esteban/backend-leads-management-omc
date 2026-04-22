# imagen de Node ligera
FROM node:22-slim

# crear carpeta de trabajo
WORKDIR /app

# copiar archivos de dependencias
COPY package*.json ./

# instalar dependencias
RUN npm install --production

COPY . .

EXPOSE 3000

# comando para arrancar
CMD ["node", "index.js"]
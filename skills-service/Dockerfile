FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Asegurar que los archivos de claves existan
COPY src/config/keys/* src/config/keys/

# Usaremos la variable de entorno PORT, por defecto 3002 si no se provee
ENV PORT=3002
EXPOSE 3002

CMD ["npm", "start"]

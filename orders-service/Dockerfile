FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Asegurar que los archivos de claves existan
COPY src/config/keys/* src/config/keys/

# Usaremos la variable de entorno PORT, por defecto 3003 si no se provee
ENV PORT=3003
EXPOSE 3003

CMD ["npm", "start"]

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Usaremos la variable de entorno PORT, por defecto 3003 si no se provee
ENV PORT=3003
EXPOSE 3003

CMD ["npm", "start"]

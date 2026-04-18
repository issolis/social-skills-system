FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Usaremos la variable de entorno PORT, por defecto 3001 si no se provee
ENV PORT=3001
EXPOSE 3001

CMD ["npm", "start"]

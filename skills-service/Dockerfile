FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Usaremos la variable de entorno PORT, por defecto 3002 si no se provee
ENV PORT=3002
EXPOSE 3002

CMD ["npm", "start"]

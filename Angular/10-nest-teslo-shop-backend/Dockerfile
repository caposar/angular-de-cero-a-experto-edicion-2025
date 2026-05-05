FROM node:20-alpine
WORKDIR /app

# Copiamos los archivos de dependencias primero
COPY package*.json ./
RUN npm install

# Copiamos el resto del código y compilamos
COPY . .
RUN npm run build

# Exponemos el puerto de la API
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "run", "start:prod"]

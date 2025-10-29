# Usamos Node.js
FROM node:20-alpine

# Directorio de trabajo
WORKDIR /app

# Copiamos package.json y package-lock.json
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del proyecto
COPY . .

# Construimos la app
RUN npm run build

# Instalamos "serve" globalmente para servir la app
RUN npm install -g serve

# Exponer puerto (puedes cambiarlo)
EXPOSE 3020

# Comando para servir la app
CMD ["serve", "-s", "build", "-l", "3020"]

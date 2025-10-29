# Etapa 1: Build
FROM node:20-alpine AS build

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json (o pnpm-lock.yaml)
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el proyecto
COPY . .

# Construir la app para producción
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:alpine

# Copiar el build de React al directorio de Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copiar configuración personalizada de Nginx si la tienes
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]

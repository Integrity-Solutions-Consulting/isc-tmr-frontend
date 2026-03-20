FROM node:20-alpine

# 1. Definimos los ARG (reciben valores de --build-arg)
ARG BUILD_CONFIG=production
ARG NODE_ENV_ARG=production

# 2. Convertimos el ARG en ENV para que esté disponible en el CMD
ENV BUILD_CONFIG=$BUILD_CONFIG
ENV NODE_ENV=$NODE_ENV_ARG

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

# Cambia esto en tu última línea:
<<<<<<< HEAD
CMD npm run start -- --host 0.0.0.0 --port 3000 --configuration $BUILD_CONFIG --disable-host-check
=======
CMD npm run start -- --host 0.0.0.0 --port 3000 --configuration $BUILD_CONFIG  --disable-host-check
>>>>>>> 6aedf50daa19e9137660d90f1f2aca7ea496cd59

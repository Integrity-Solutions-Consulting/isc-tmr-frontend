FROM node:20-alpine

WORKDIR /app

# Esto nos dirá qué archivos hay exactamente antes de fallar
# Revisa los logs de Dokploy después de añadir esto
RUN ls -la .. && ls -la .

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0", "--port", "3000"]

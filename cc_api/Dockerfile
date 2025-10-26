FROM node:16-alpine

WORKDIR /app

# Package Files für Dependencies
COPY package*.json ./

# Abhängigkeiten installieren
RUN npm ci --only=production

# Rest des Codes
COPY . .

# Debug-Ausgabe
RUN ls -la

EXPOSE 4000

CMD ["node", "server.js"]
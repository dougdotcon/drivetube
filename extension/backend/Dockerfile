FROM node:18-alpine

WORKDIR /app

# Instala o curl para o healthcheck
RUN apk add --no-cache curl

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3333

CMD ["npm", "run", "dev"] 
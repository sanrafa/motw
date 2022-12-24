FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

EXPOSE 3000

COPY . .
RUN npm run build

CMD ["node", "-r", "dotenv/config", "build"]
FROM node:20.19.3-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev
COPY . .

COPY .env .env

RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]

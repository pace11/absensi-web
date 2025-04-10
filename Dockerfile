FROM node:22.14.0

WORKDIR /app

COPY .env .env

COPY package.json ./
COPY package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]

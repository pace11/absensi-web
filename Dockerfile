FROM node:20.19.3

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev
COPY . .

COPY .env .env

RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]

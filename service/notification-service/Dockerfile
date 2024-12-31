FROM node:18-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
COPY .env.production .env
CMD ["npm", "run", "start"]
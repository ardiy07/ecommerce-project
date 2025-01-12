FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY prisma ./prisma
COPY . .
RUN npx prisma generate
FROM node:18-slim
WORKDIR /app
COPY --from=build /app/package*.json ./
RUN npm install
RUN apt-get update -y && apt-get install -y openssl
COPY --from=build /app /app
EXPOSE 3005
CMD ["npm", "run", "start:prod"]
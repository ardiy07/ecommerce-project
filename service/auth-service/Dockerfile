FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY prisma ./prisma
COPY . .
RUN npx prisma generate
RUN npm run build
FROM node:18-slim
WORKDIR /app
COPY --from=build /app/package*.json ./
RUN npm install --only=production
RUN apt-get update -y && apt-get install -y openssl
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
ARG NODE_ENV=production
COPY .env.${NODE_ENV} .env
EXPOSE 3005
CMD ["npm", "run", "start:prod"]
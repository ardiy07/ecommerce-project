# Tahap 1: Build dengan Maven
FROM maven:latest AS builder 

WORKDIR /usr/src/app
COPY . .

# Menjalankan build
RUN mvn clean package -DskipTests

# Tahap 2: Jalankan dengan JDK Slim
FROM openjdk:17-jdk-slim

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/target/gateway-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 80
CMD ["java", "-jar", "app.jar"]
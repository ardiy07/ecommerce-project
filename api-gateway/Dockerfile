# Tahap 1: Build aplikasi menggunakan Maven
FROM maven:3.8.8-eclipse-temurin-17 AS builder

WORKDIR /app
COPY . .
RUN ./mvnw clean package -DskipTests
RUN ls -l /app/target

# Tahap 2: Menjalankan aplikasi dengan JDK
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
RUN chmod +x app.jar

EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
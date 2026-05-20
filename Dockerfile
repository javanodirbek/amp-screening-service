# ---- Build stage ----
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .
COPY src src
RUN chmod +x gradlew && ./gradlew bootJar -x test --no-daemon

# ---- Run stage ----
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 7777
ENTRYPOINT ["java", "-jar", "app.jar"]

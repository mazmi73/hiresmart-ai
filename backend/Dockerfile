# Stage 1: Build application with Maven and Java 21
FROM maven:3.9.9-eclipse-temurin-21-alpine AS build
WORKDIR /build

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build jar and execute test suite
RUN mvn clean package -DskipTests=false

# Stage 2: Lightweight Java 21 JRE runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Non-root user and persistent CV storage permissions
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN mkdir -p /app/uploads/cvs && chown -R appuser:appgroup /app

USER appuser

# Copy executable jar from build stage
COPY --from=build /build/target/*.jar /app/app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "/app/app.jar"]

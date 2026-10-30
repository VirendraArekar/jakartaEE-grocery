# ==============================================================================
# Multi-Stage Dockerfile for Spring Boot Grocery Backend
# ==============================================================================

# Stage 1: Build the JAR
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /app

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build production jar skipping test phase
RUN mvn clean package -DskipTests

# Stage 2: Minimal Production JRE Image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create a non-privileged system user for running the service
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy executable jar from builder
COPY --from=builder /app/target/grocery-backend-1.0.0.jar /app/grocery-backend.jar

# Adjust permissions
RUN chown -R appuser:appgroup /app
USER appuser

# Expose HTTP port
EXPOSE 8080

# Configure JVM memory and garbage collection options for container environment
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+ExitOnOutOfMemoryError"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/grocery-backend.jar"]


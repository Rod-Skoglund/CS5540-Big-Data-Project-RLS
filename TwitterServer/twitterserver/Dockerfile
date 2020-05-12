FROM openjdk:8-jdk-alpine

ARG JAR_FILE=target/twitterserver-0.0.1-SNAPSHOT.jar
ARG JAR_LIB_FILE=target/lib/

WORKDIR /usr/local/runme

COPY ${JAR_FILE} app.jar
ADD ${JAR_LIB_FILE} lib/
EXPOSE 8001

CMD ["java","-jar","app.jar"]
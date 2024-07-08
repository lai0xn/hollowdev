export $(grep -v '^#' .env | xargs)
mvn spring-boot:run

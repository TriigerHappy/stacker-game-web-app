## Pull the mysql:5.7 image
FROM mysql:5.7

## The maintainer name and email
MAINTAINER Your Name <name@email.com>

# database = test and password for root = password
ENV MYSQL_DATABASE=stacker \
    MYSQL_ROOT_PASSWORD=Lbcsadmin \
    MYSQL_USER=Lbcsadmin \
    MYSQL_PASSWORD=Lbcsadmin
# when container will be started, we'll have `test` database created with this schema
COPY ./stacker.sql /docker-entrypoint-initdb.d/


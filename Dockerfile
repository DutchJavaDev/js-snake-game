FROM php:7.2-apache
RUN apt-get update \
 && apt-get install -y git zlib1g-dev \
 && docker-php-ext-install pdo pdo_mysql zip
COPY api/ /var/www/html/api
COPY css/ /var/www/html/css
COPY js/ /var/www/html/js
COPY index.html/ /var/www/html/

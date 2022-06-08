FROM nginx:alpine

# Labels
LABEL maintainer="Ja7adr <ja7adr@gmail.com>"
LABEL description="W3schools full offline in docker"
LABEL org.opencontainers.image.source https://github.com/Ja7ad/W3Schools

# Copy data to nginx www
COPY . /usr/share/nginx/html

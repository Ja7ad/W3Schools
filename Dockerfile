FROM nginx:alpine

# Labels
LABEL maintainer="Ja7adr <ja7adr@gmail.com>"
LABEL description="W3schools full offline in docker"
LABEL version="20210122"

# Copy data to nginx www
COPY . /usr/share/nginx/html

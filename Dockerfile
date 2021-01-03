FROM nginx:alpine

# Labels
LABEL maintaner="Ja7adr <ja7adr@gmail.com>"
LABEL description="W3schools full offline in docker"
LABEL version="20210103"

# Copy data to nginx www
COPY . /usr/share/nginx/html

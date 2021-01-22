# W3Schools Offline ⚡️  Weekly Update v2021.01.22

![Repo Size](https://img.shields.io/github/repo-size/ja7adr/W3Schools) ![Docker Image Size](https://img.shields.io/docker/image-size/ja7adr/w3schools?style=flat-square)

![W3schools](https://www.w3schools.com/images/w3schoolscom_gray.gif)

If you like w3schools tutorials , you can access any time in your local to w3schools.

## ⁉️ How to run docker image ?

1. First pull image to your docker images : `docker pull ja7adr/w3schools`
2. Create container from image : 

- `docker run -d -p 80:80 --name w3schools w3schools:latest` ==> this run on ip 0.0.0.0
- `docker run -d -p 127.0.0.1:80:80 --name w3schools w3schools:latest` ==> this run on ip 127.0.0.1

3. Open Browser for access to w3schools from http://127.0.0.1 or http://localhost

## ⁉️ How to used zipped edition (50 MB Size) ?

1. Download Latest Release : ![Release](https://github.com/Ja7adR/W3Schools/releases)
2. Just run file `index.html`

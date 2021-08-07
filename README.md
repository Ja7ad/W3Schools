# W3Schools Offline ⚡️  Update v2021.08.07

![Repo Size](https://img.shields.io/github/repo-size/ja7adr/W3Schools) ![Docker Image Size](https://img.shields.io/docker/image-size/ja7adr/w3schools?style=flat-square)

![W3schools](https://www.w3schools.com/images/w3schoolscom_gray.gif)

W3schools tutorials are available at any time within your local computer.

## ⁉️ How to run docker image ?

1. First pull image to your docker images : 
  - `docker pull ja7adr/w3schools`
  - `docker pull ghcr.io/ja7ad/w3schools:latest`
2. Create container from image : 

- `docker run -d -p 80:80 --name w3schools w3schools:latest`
- `docker run -d -p 127.0.0.1:80:80 --name w3schools w3schools:latest`

3. Open Browser for access to w3schools from http://127.0.0.1 or http://localhost


## ⁉️ How to download zipped edition?

1. Download Latest Release : [Release](https://github.com/Ja7adR/W3Schools/releases)
2. Just run file `index.html`

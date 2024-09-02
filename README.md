# seb-screen-proctoring-gui

GUI component for Safe Exam Browser screen proctoring project.

This is a sub-project of SEB Server. For full usage and installation, please visit the [SEB Server page](https://github.com/SafeExamBrowser/seb-server)

## Overview

This project consists of two parts. A client component and a server component. The server contains no businesses logic but serves as a lightweight api-gateway between the client and the [SP-Server](https://github.com/SafeExamBrowser/seb-screen-proctoring-server). The easiest way to build and deploy the project is via docker. 


### Client

The client uses the following technologies:

#### [VueJs Version 3.4.*](https://vuejs.org/)
 - Composition API and Script Setup Syntax
 - Typescript
 - [Vuetify](https://vuetifyjs.com/en/) as the componenet framework

### Server

The server uses the following technologies:

#### [ExpressJs Version 4.19.*](https://expressjs.com/)
 - Typescript
 - Axios as API-Request library
 

## Local development

Instructions on how to get a local development environment up and running.

#### Required technologies

 - your favorite code editor such as [VS-Code](https://code.visualstudio.com/)
 - Node and NPM as CLI-Tools
	- [Windows](https://phoenixnap.com/kb/install-node-js-npm-on-windows)
	- [Mac](https://treehouse.github.io/installation-guides/mac/node-mac.html)
	- [Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-20-04)
 - SP-Server up and running (follow the [SP-Server](https://github.com/SafeExamBrowser/seb-screen-proctoring-server) instructions)
 - Optional: [Docker](https://www.docker.com/) for building and deploying the application


Refer to the [seb-server-setup project](https://github.com/SafeExamBrowser/seb-server-setup/tree/development) to get a description on the environment variables. 
(Hier bitte noch den richtigen Link zum docker-compose File hinzufügen)


#### Steps to follow

 1. Clone this repo to your local machine
 2. navigate to the "client" folder
    - create a `.env` file
    - add the following content:
    ```
    VITE_SERVER_URL="http://localhost" 
    VITE_SERVER_PORT="3000"
    ```
 3. run `npm install`
 4. run `npm run dev`
 5. if everything worked correctly, you should see an output in your terminal similar this one:
     ```
    VITE v4.4.9  ready in 281 ms
    ➜  Local:   http://localhost:8081/
    ➜  Network: use --host to expose
    ➜  press h to show help
    ```
6. navigate to the "server" folder
   - create a `.env` file
   - add the following content:
    ```
    NODE_ENV="dev"
    SERVER_PORT=3000
    
    PROCTOR_SERVER_URL="http://localhost"
    PROCTOR_SERVER_PORT="8090"
    PROCTOR_DEFAULT_URL="/admin-api/v1"
    
    DEV_SERVER_URL="http://localhost"
    DEV_SERVER_PORT="8080"
   
    PROCTOR_SERVER_USERNAME="{username for oauth}"
    PROCTOR_SERVER_PASSWORD="{pw for oauth}"

    SEB_SERVER_INTEGRATED_MODE="true"
    ```
  7. run `npm install`
  8. run `npm run dev`
  9. if everything worked correctly, you should see an output in your terminal similar this one:
      ```
      10:45:22 AM - Starting compilation in watch mode...
     [0] 
     [0] 
     [0] 10:45:23 AM - Found 0 errors. Watching for file changes.
     [1] info: 26.10.2023 10:45:23: 	env mode: dev
     [1] info: 26.10.2023 10:45:23: 	⚡️[server]: Server is running at 0.0.0.0 3000
      ```    
  
 

#### Troubleshooting


Loopback Express Mongodb
========================
A sample app where the frontend is buidl in jquery exposed from backend via Node Express Application
This node application then talks to another rest api provider application Loopback.

The application allows  a user to register , login and search for some Rediff products and then buy those 
products from Rediff site

To get the local up & running , follow below steps

* Mongodb 
    - install mongodb 
    - create a folder under data folder named loopbackdb or whatever you want
    - start the mongodb server using below command
    - mongod --dbpath <path to the loopbackdb folder>
* Loopback Server
    - cd to RediffShopping folder
    - run npm install
    - run the server now using below command
    - PORT=5555 node .
* Start the express client application
    - cd to RediffClient folder
    - run npm install
    - run the server using below command
    - node app.js

Now access your server using http://localhost:3006/

Loopback APIs can be seen non http://localhost:5555/explorer 

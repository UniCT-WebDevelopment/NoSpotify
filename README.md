
[![Screenshot-from-2022-08-05-03-23-47.png](https://i.postimg.cc/NjFPDs1K/Screenshot-from-2022-08-05-03-23-47.png)](https://postimg.cc/bZXTNjVP)

# NoSpotify



<p align="center">

  <img width="500" height="200" src="https://i.postimg.cc/fRLSbLdT/nospotifylogo.png">
</p>

### Live [Demo](http://nospotify.me:4000) 🔗


## 🎵 Listen your music totally free and without any limitations !
<p align="center">
  <img  src="https://i.postimg.cc/BZKddcwJ/Screenshot-from-2022-08-05-03-23-32.png">
</p>


<div align="center">
  <img width="400" src="https://i.postimg.cc/bJQPLbZT/Screenshot-from-2022-08-05-13-26-58.png">
    <img width="400" src="https://i.postimg.cc/XqJ2X66C/Screenshot-from-2022-08-05-13-27-47.png">

</div>



<p align="center">
    <img width="500"  src="https://i.postimg.cc/C5TbBggr/angular-nodejs.webp">
</p>


# Features ⭐

- Listen to all your music, search for a specific track, band or artist 🔉
- Add a song to your playlists 🔍
- Create Playlists 🆕
- Import Playlists from Spotify 📰
- SharePlay 👦 🎶 👦
- Import Playlists from external file (.nospotify) 📂
- Change your profile settings ✏👤


# Installation 🔧
NoSpotify requires 
- [Node.js](https://nodejs.org/) v16+.
- [Angular](https://angular.io/) v10+.
- [Docker](https://docs.docker.com/)

First time setup

- Configure backend config file

```sh
{   
    //MONGODB CONNECTION STRING (CHECK DOCKER-COMPOSE FOR CREDENTIALS)
    "connectionString": "mongodb://root:rootPassword@localhost:27017/?authSource=admin",
    "secret": "$3cr3tSeRver!", //JWT ENCRYPTION SECRET KEY
    "spotifyEmail":"", //EMAIL ACCOUNT SPOTIFY DEVELOPER
    "spotifyPassword":"", //PASSWORD ACCOUNT SPOTIFY DEVELOPER
    "spotifyAppId":""  //APP-ID SPOTIFY DEV APP
}
```
- Setup enviroment

```sh
$ make run-db
$ make init-backend
$ make init-frontend
```

- Other commands

Clean the development environment (refresh node modules and start)
```sh
$ make clear-backend
$ make clear-frontend
```

- Build GUI (dist folder)
```sh
$ make build-frontend
```

- Run commands
```sh
$ make run-frontend
$ make run-backend

```

# Include Spotify Import  [BETA 🔨]
In order to use the import function from spotify you need to create a spotify app through the [developer panel](https://developer.spotify.com/)
and insert email, password and client id in the configuration file (backend config file).
It is also necessary to insert the correct CLIENT_ID in angular enviroment config file.



<p align="center">
  <img  src="https://i.postimg.cc/WbThxmcx/Screenshot-from-2022-08-05-13-29-37.png">
</p>


# Author 💻 👦
NoSpotify has been developed by Mirko Distefano, Computer Science student at Department of Mathematics and Computer Science, University of Catania, Italy. 

Email: mirko.distefano@live.it



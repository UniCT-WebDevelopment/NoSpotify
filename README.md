
[![Screenshot-from-2022-08-05-03-23-47.png](https://i.postimg.cc/NjFPDs1K/Screenshot-from-2022-08-05-03-23-47.png)](https://postimg.cc/bZXTNjVP)

# NoSpotify


# Features

- Listen to all your music, search for a specific track, band or artist.
- Add a song to your playlists.
- Create Playlists.
- Import Playlists from Spotify 
- SharePlay
- Import Playlists from external file (.nospotify)
- Change your profile settings.


# Installation
NoSpotify requires 
- [Node.js](https://nodejs.org/) v16+.
- [Angular](https://angular.io/) v10+.
- [Docker](https://docs.docker.com/)

First time setup

- Configure backend config file

```sh
{   //MONGODB CONNECTION STRING (CHECK DOCKER-COMPOSE FOR CREDENTIALS)
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

# Author
NoSpotify has been developed by Mirko Distefano, Computer Science student at Department of Mathematics and Computer Science, University of Catania, Italy. 

Email: mirko.distefano@live.it

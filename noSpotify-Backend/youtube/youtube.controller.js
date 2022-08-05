const express = require('express');
const router = express.Router();
const ytMusic = require('node-youtube-music');
const getAverageColor = require('fast-average-color-node');
const { JsonWebTokenError } = require('jsonwebtoken');
const userService = require('../users/user.service');
const config = require('config.json');
const secret = config.secret;
const jwt = require('jsonwebtoken');
const { checkPlaylistFromUpload } = require('../users/user.service');
const puppeteer = require('puppeteer');

// router.get('/', getAll);
// router.get('/current', getCurrent);
router.get('/searchMusic/:name', searchMusic);
router.get('/searchAlbum/:name', searchAlbum);
router.get('/searchArtist/:name/:id', searchArtist);
router.get('/searchArtist/:name', searchArtist);
router.get('/getMusicFromAlbum/:id', getMusicFromAlbum);
router.get('/getArtist/:id', getArtist);
router.get('/getAllPlaylistForUser', getAllPlaylistForUser);
router.post('/createPlaylist', createPlaylist);
router.post('/updatePlaylist', updatePlaylist);
router.get('/downloadPlaylist/:id', downloadPlaylist);
router.post('/checkUploadedPlaylist', checkUploadedPlaylist);
router.get('/getPlaylist/:id', getPlaylist);
router.get('/addUserToSpotify/:email/:username', addUserToSpotifyReq);
router.get('/searchPlaylist/:name', searchPlaylist);

router.post('/deletePlaylist', deletePlaylist);

module.exports = router;


async function searchMusic(req, res, next) {
    if (!req.params.name) return res.status(401).end()

    let token = req.headers['x-access-token'] || req.headers['authorization'];

    token = token.replace(/^Bearer\s+/, "");

    let payload = null;
    try {
        payload = jwt.verify(token, secret);

    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            return res.status(401).end()
        }
        // otherwise, return a bad request error
        return res.status(400).end()
    }



    try {
        if (req.params.name) {
            const musics = await ytMusic.searchMusics(req.params.name);

            res.json(musics);
        } else {
            res.json({ error: "NO DATA" });

        }
    } catch (e) {
        res.json({ error: "NO DATA" });
    }

}


async function searchPlaylist(req, res, next) {

    if (!req.params.name) return res.status(401).end()

    let token = req.headers['x-access-token'] || req.headers['authorization'];

    token = token.replace(/^Bearer\s+/, "");

    let payload = null;
    try {
        payload = jwt.verify(token, secret);

    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            return res.status(401).end()
        }
        // otherwise, return a bad request error
        return res.status(400).end()
    }


    try {
        if (req.params.name) {

            userService.searchPlaylist(req.params.name)
                .then((response) => {
                    if (response) {


                        res.json(response)
                    }

                    else res.status(404).end()
                })
                .catch(err => next(err));

        } else {
            res.json({ error: "NO DATA" });

        }
    } catch (e) {
        res.json({ error: "NO DATA" });
    }

}





async function addUserToSpotifyReq(req, res, next) {

    if (!req.params.email || !req.params.username) return res.status(401).end()

    let token = req.headers['x-access-token'] || req.headers['authorization'];

    token = token.replace(/^Bearer\s+/, "");

    let payload = null;
    try {
        payload = jwt.verify(token, secret);

    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            return res.status(401).end()
        }
        // otherwise, return a bad request error
        return res.status(400).end()
    }


    try {

        let check = await addUserToSpotifyApp(req.params.email, req.params.username);

        if (check) res.json({ ok: true })
        else res.status(400).end()
    } catch (e) {
        res.status(400).end()
    }


}



async function addUserToSpotifyApp(email, username) {

    const browser = await puppeteer.launch({
        headless: false,
        userDataDir: './myChromeSession'
    });
    try {
       
        const page = await browser.newPage();
        await page.setViewport({ width: 1366, height: 768 });

        // const cookie = {
        //     name: '_sp_self_prov_latestTosAcceptedVersion',
        //     value: '8',
        //     domain: '.spotify.com',
        //     url: 'https://developer.spotify.com/',
        //     path: '/',
        // }

        // await page.setCookie(cookie)

        await page.goto('https://accounts.spotify.com/en/login');


        await page.waitForSelector("body", { timeout: 2000 });


        if (await page.$("#login-username") !== null) {

            let input = await page.$("#login-username")
            await input.type(config.spotifyEmail);

            let password = await page.$("#login-password")
            await password.type(config.spotifyPassword);

            await page.click("#login-button", { waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(3000)

        }




        // await page.waitForNavigation();


        await page.goto('https://developer.spotify.com/dashboard/applications/'+config.spotifyAppId+'/users', { waitUntil: 'domcontentloaded' });

        await page.waitForTimeout(3000)


        if (await page.$("#onetrust-accept-btn-handler") !== null) {
            await page.click("#onetrust-accept-btn-handler");
            await page.waitForTimeout(1000);

        }


        if(page.url().includes("tos-accept")){

            await page.click("input[ng-model='acceptTOS'");

            await page.evaluate( function(){
                document.querySelector("input[type='submit']").click();
              } );

              await page.waitForTimeout(1000);

        }

        if (await page.$("#onetrust-accept-btn-handler") !== null) {
            await page.click("#onetrust-accept-btn-handler");
            await page.waitForTimeout(1000);

        }



        if(page.url().includes("tos-accept")){

            await page.click("input[ng-model='acceptTOS'");

            await page.evaluate( function(){
                document.querySelector("input[type='submit']").click();
              } );

              await page.waitForTimeout(1000);

        }

        if (await page.$("button[data-ng-click='login()'") !== null) {

            // await page.click("button[data-ng-click='login()'");


            await page.evaluate( function(){
                document.querySelector("button[data-ng-click='login()'").click();
              } );



            await page.waitForTimeout(3000)


            await page.goto('https://developer.spotify.com/dashboard/applications/'+config.spotifyAppId+'/users', { waitUntil: 'domcontentloaded' });

            await page.waitForTimeout(3000);

        }



        if(page.url().includes("tos-accept")){

            await page.click("input[ng-model='acceptTOS'");

            await page.evaluate( function(){
                document.querySelector("input[type='submit']").click();
              } );

              await page.waitForTimeout(1000);

        }

        await page.waitForSelector("body", { timeout: 2000 });




        if (await page.$("#onetrust-accept-btn-handler") !== null) {
            await page.click("#onetrust-accept-btn-handler");
            await page.waitForTimeout(1000);

        }


        await page.waitForSelector("a[data-target='#add-user-modal']", { timeout: 2000 });




        if (await page.$("a[data-target='#add-user-modal'][class*='ng-hide']")) {

            if (await page.$$("i[ng-click='removeUser($index)'") !== null) {


                const elHandleArray = await page.$$("i[ng-click='removeUser($index)'")

                console.log(elHandleArray)

                elHandleArray.map(async el => {

                    await el.evaluate(b => b.click());

                })

            }
        }

        await page.waitForSelector("a[data-target='#add-user-modal']", { timeout: 2000 });


        if (await page.$("#onetrust-accept-btn-handler") !== null) {
            await page.click("#onetrust-accept-btn-handler");
            await page.waitForTimeout(1000);


        }



        if (await page.$("a[data-target='#add-user-modal']") !== null) {

            await page.click("a[data-target='#add-user-modal']")

            await page.waitForTimeout(2000)

            let input = await page.waitForSelector('input[ng-model="userName"]', { timeout: 2000 });
            await input.type(username);


            let inputEmail = await page.waitForSelector("input[ng-model='userEmail'", { timeout: 2000 });
            await inputEmail.type(email);
            await page.waitForTimeout(2000)





            await page.click("button[ng-click='addUser()'", { waitUntil: 'domcontentloaded' })
            await page.waitForTimeout(2000)

        } else {
            await browser.close();
            return false;
        }

        // await page.waitForTimeout(5000)
        //await page.waitForTimeout(1000000)  
        await browser.close();
        return true;


    } catch (e) {
        console.log(e)
        await browser.close();
        return false;

    }

}

async function checkUploadedPlaylist(req, res, next) {

    let token = req.headers['x-access-token'] || req.headers['authorization'];

    token = token.replace(/^Bearer\s+/, "");

    let payload = null;
    try {
        payload = jwt.verify(token, secret);

    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            return res.status(401).end()
        }
        // otherwise, return a bad request error
        return res.status(400).end()
    }


    if (!req.body || !req.body.file) res.status(404).end();

    let playlistCrypt = req.body.file;


    await userService.checkPlaylistFromUpload(playlistCrypt)
        .then((response) => {
            console.log(response)

            res.json(response)
        })
        .catch(err => next(err));
}


function getAllPlaylistForUser(req, res, next) {

    let token = req.headers['x-access-token'] || req.headers['authorization'];

    token = token.replace(/^Bearer\s+/, "");

    let payload = null;
    try {
        payload = jwt.verify(token, secret);

    } catch (e) {
        console.log(e)
        if (e instanceof jwt.JsonWebTokenError) {
            // if the error thrown is because the JWT is unauthorized, return a 401 error
            return res.status(401).end()
        }
        // otherwise, return a bad request error
        return res.status(400).end()
    }

    console.log(payload.sub)
    userService.getAllPlaylistForUser(payload.sub)
        .then((response) => {
            res.json(response)
        })
        .catch(err => next(err));
}


function getPlaylist(req, res, next) {

    let token = req.headers['x-access-token'] || req.headers['authorization'];

    token = token.replace(/^Bearer\s+/, "");

    let payload = null;
    try {
        payload = jwt.verify(token, secret);

    } catch (e) {
        console.log(e)
        if (e instanceof jwt.JsonWebTokenError) {
            // if the error thrown is because the JWT is unauthorized, return a 401 error
            return res.status(401).end()
        }
        // otherwise, return a bad request error
        return res.status(400).end()
    }


    if (!req.params.id) res.status(400).end()

    userService.getPlaylistById(req.params.id, payload.sub)
        .then((response) => {
            if (response) {
                // res.setHeader('Content-type', "application/octet-stream");
                // res.setHeader('Content-disposition', 'attachment; filename=playlist.nospotify');
                // res.json(response)

                res.json(response)
            }

            else res.status(404).end()
        })
        .catch(err => next(err));
}

function downloadPlaylist(req, res, next) {

    let token = req.headers['x-access-token'] || req.headers['authorization'];

    token = token.replace(/^Bearer\s+/, "");

    let payload = null;
    try {
        payload = jwt.verify(token, secret);

    } catch (e) {
        console.log(e)
        if (e instanceof jwt.JsonWebTokenError) {
            // if the error thrown is because the JWT is unauthorized, return a 401 error
            return res.status(401).end()
        }
        // otherwise, return a bad request error
        return res.status(400).end()
    }


    if (!req.params.id) res.status(400).end()

    console.log(payload.sub)
    userService.downloadPlaylistById(req.params.id, payload.sub)
        .then((response) => {
            if (response) {
                // res.setHeader('Content-type', "application/octet-stream");
                // res.setHeader('Content-disposition', 'attachment; filename=playlist.nospotify');
                // res.json(response)

                res.attachment('filename.txt')
                res.type('txt')
                res.send(response)
            }

            else res.status(404).end()
        })
        .catch(err => next(err));
}



function createPlaylist(req, res, next) {

    let token = req.headers['x-access-token'] || req.headers['authorization'];
    token = token.replace(/^Bearer\s+/, "");
    let payload = null;
    try {
        payload = jwt.verify(token, secret);
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            return res.status(401).end()
        }
        return res.status(400).end()
    }


    let playlist = req.body;
    // if(!playlist || !playlist.playlist || playlist.playlist.length==0) return res.status(400).end()
    playlist["owner"] = payload.sub
    userService.getById(payload.sub).then((res1) => {

        playlist["ownerName"] = res1.firstName + " " + res1.lastName
        userService.createPlaylist(playlist)
            .then((response) => {
                res.json(response)
            })
            .catch(err => next(err));

    })

}


function updatePlaylist(req, res, next) {

    let token = req.headers['x-access-token'] || req.headers['authorization'];
    token = token.replace(/^Bearer\s+/, "");
    let payload = null;
    try {
        payload = jwt.verify(token, secret);
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            return res.status(401).end()
        }
        return res.status(400).end()
    }


    let playlist = req.body;
    if (payload.sub != playlist.owner) return res.status(400).end()

    userService.updatePlaylist(payload, playlist).then((res1) => {

        res.json(res1)


    })

}


function deletePlaylist(req, res, next) {

    let token = req.headers['x-access-token'] || req.headers['authorization'];
    token = token.replace(/^Bearer\s+/, "");
    let payload = null;
    try {
        payload = jwt.verify(token, secret);
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            return res.status(401).end()
        }
        return res.status(400).end()
    }


    let playlist = req.body;
    if (payload.sub != playlist.owner) return res.status(400).end()

    userService.deletePlaylist(payload, playlist.id).then((res1) => {

        res.json(res1)


    })

}

async function getMusicFromAlbum(req, res, next) {

    try {
        if (req.params.id) {
            let color = undefined;
            const musics = await ytMusic.listMusicsFromAlbum(req.params.id);
            if (musics && musics.length && musics[0].thumbnailUrl) {
                color = await (await getAverageColor.getAverageColor(musics[0].thumbnailUrl)).value;
                musics[0]['colorCover'] = color;
            }
            res.json(musics);
        } else {
            res.json({ error: "NO DATA" });

        }
    } catch (e) {
        res.json({ error: "NO DATA" });
    }

}

async function getArtist(req, res, next) {

    try {
        if (req.params.id) {
            let musics = await ytMusic.getArtist(req.params.id);

            if (musics && musics.thumbnails && musics.thumbnails[0] && musics.thumbnails[0].url) {




                color = await (await getAverageColor.getAverageColor(musics.thumbnails[0].url)).value;
                musics['colorCover'] = color;

            }


            res.json(musics);
        } else {
            res.json({ error: "NO DATA" });

        }
    } catch (e) {
        console.log(e)
        res.json({ error: "NO DATA" });
    }

}





async function searchArtist(req, res, next) {

    try {
        if (req.params.name) {
            const albums = await ytMusic.searchArtists(req.params.name);

            res.json(albums);
        } else {
            res.json({ error: "NO DATA" });

        }
    } catch (e) {
        res.json({ error: "NO DATA" });
    }

}

async function searchAlbum(req, res, next) {

    try {
        if (req.params.name) {
            const albums = await ytMusic.searchAlbums(req.params.name);

            res.json(albums);
        } else {
            res.json({ error: "NO DATA" });

        }
    } catch (e) {
        res.json({ error: "NO DATA" });
    }

}

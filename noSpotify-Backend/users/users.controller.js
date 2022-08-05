const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const yt = require("yt-converter");
const jwt = require('jsonwebtoken');

const config = require('config.json');

const secret = config.secret;

// routes
router.post('/authenticate', authenticate);
router.post('/register', register);

// router.get('/', getAll);
router.get('/current', getCurrent);
// router.get('/:id', getById);
router.put('/edit', update);
// router.delete('/:id', _delete);
router.use('/public', express.static(__dirname + '/public'));

module.exports = router;

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Utente o password errati' }))
        .catch(err => next(err));
}


function register(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
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



    userService.getById(payload.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

// function getById(req, res, next) {
//     userService.getById(req.params.id)
//         .then(user => user ? res.json(user) : res.sendStatus(404))
//         .catch(err => next(err));
// }

function update(req, res, next) {

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
        
    }


    userService.update(payload.sub, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}
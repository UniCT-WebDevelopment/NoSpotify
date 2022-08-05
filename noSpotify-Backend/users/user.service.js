const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const crypto = require('crypto-js');

const User = db.User;
const Playlist = db.Playlist;

const secret = config.secret;

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    getAllPlaylistForUser,
    createPlaylist,
    deletePlaylist,
    updatePlaylist,
    downloadPlaylistById,
    getPlaylistById,
    checkPlaylistFromUpload,
    searchPlaylist,
    delete: _delete
};

async function authenticate({ username, password }) {
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.hash)) {
        const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '7d' });
        return {
            ...user.toJSON(),
            token
        };
    }
}

async function getAll() {
    return await User.find();
}

async function getById(id) {
    return await User.findById(id);
}

async function create(userParam) {
    // validate
    if (await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" già in uso';
    }

    const user = new User(userParam);

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // save user
    await user.save();
}


async function createPlaylist(playlist) {
    const playlistObj = new Playlist(playlist);
    await playlistObj.save();
}


async function updatePlaylist(payload,playlist) {

    // const playlistObj = new Playlist(playlist);


    let playlistCheck = await Playlist.findById(playlist.id);

    if (payload.sub != playlistCheck.owner) return null;

    Playlist.findByIdAndUpdate(playlist.id,playlist, function(err, result){

        if(err){
            //todo trigger error
        }
        else{
        }

    })

    // await playlistObj.save();
}



async function deletePlaylist(payload,idPlaylist) {


    let playlistCheck = await Playlist.findById(idPlaylist);

    if (payload.sub != playlistCheck.owner) return null;


    await Playlist.findByIdAndRemove(idPlaylist);
}


async function downloadPlaylistById(idPlaylist,ownerId) {

    

    let playlist = await Playlist.findById(idPlaylist);

    if((playlist.owner != ownerId && !playlist.public) || !playlist) return null;


    let fileContent = crypto.AES.encrypt(JSON.stringify(playlist), secret).toString();


    return fileContent;


}


async function getPlaylistById(idPlaylist,ownerId) {


    let playlist = await Playlist.findById(idPlaylist);

    if((playlist.owner != ownerId && !playlist.public) || !playlist) return null;



    return playlist;


}


async function searchPlaylist(name) {

        console.log(name)


    let playlists =Playlist.find({ "playlistName": { "$regex": name+"", "$options": "i" } ,"public":true});
    

    // if((playlist.owner != ownerId && !playlist.public) || !playlist) return null;

    

    return playlists;


}


async function checkPlaylistFromUpload(playlistFile) {

    try{
    let result = crypto.AES.decrypt(playlistFile, secret).toString(crypto.enc.Utf8);

    result = JSON.parse(result);


    return result;

    }catch(e){
        console.log(e)
        return null;
    }

}

async function getAllPlaylistForUser(id) {

    let response = await Playlist.find({owner:id});
    return response;

}



async function update(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}
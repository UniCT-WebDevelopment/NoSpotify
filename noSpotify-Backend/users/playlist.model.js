const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    owner: { type: String, unique: false, required: true },
    playlist : { type: [], required: true },
    public: { type: Boolean, required: true },
    playlistName:{ type: String, required: true },
    ownerName:{ type: String, required: true },
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

module.exports = mongoose.model('Playlist', schema);
const { Schema, model, trusted } = require("mongoose");

const UserSchema = Schema({
    name: {
        type: String,
        required: true
    },
    surname: String,
    bio: {
        type: String
    },
    nick: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        defaul: "role_user"
    },
    image: {
        type: String,
        default: "defaultAvatar.png"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = model("User", UserSchema, "users");
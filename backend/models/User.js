const { Schema, model, trusted } = require("mongoose");

const UserSchema = Schema({
    name: {
        type: String,
        required: trust
    },
    surname: String,
    nick: {
        type: String,
        required: true
    },
    email: {
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
        type: Data,
        default: Date.now
    }
});

module.exports = model("User", UserSchema, "users");
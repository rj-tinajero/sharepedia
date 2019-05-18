const User = require("./models").User;
const Wiki = require("./models").Wiki;
const bcrypt = require("bcryptjs");

module.exports = {
    createUser(newUser, callback) {
        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(newUser.password, salt);
        return User.create({
            email: newUser.email,
            password: hashedPassword
        })
        .then((user) => {
            callback(null, user);
        })
        .catch((err) => {
            callback(err);
        })
    },
    makeWikisPub(id, callback) {
        Wiki.findAll({
            where: {
                userId: id
            }
        })
        .then((wikis) => {
            for(let i = 0; i < wikis.length; i++) {
                wikis[i].update({
                    private: false
                })
            }
        })
        .catch((err) => {
            callback(err);
        })

    },
    getAllUsers(callback) {
        return User.findAll()
        .then((users) => {
            callback(null, users);
        })
        .catch((err) => {
            callback(err);
        })
    }
}
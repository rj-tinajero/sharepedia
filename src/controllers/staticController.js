module.exports = {
    index(req, res, next) {
        res.render("static/home", {title: "Welcome to Sharepedia"});
    }
}
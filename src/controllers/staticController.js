module.exports = {
    index(req, res, next) {
        console.log(res);
        res.render("static/index", {title: "Welcome to Sharepedia"});
    }
}
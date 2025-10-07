module.exports.createPost = (req, res) => {
    if (!req.body.title) {
        req.flash('error', 'Title is required');
        res.redirect('back');
        return
    }
    next();
}
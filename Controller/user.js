const User = require('../model/user');

module.exports.registerForm = (req, res) => {
    res.render('users/register')
}
module.exports.loginForm = (req, res) => {
    res.render('users/login')
}

module.exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Successfully Registered, Welcome to Campground');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
};
module.exports.loginUser = (req, res) => {
    req.flash('success', `Successfully Logged in, Welcome back ${req.user.username}`);
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
}
module.exports.logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err)
        }
        req.flash('success', 'Logged out, we hope to see you again!');
        req.flash('error')
        res.redirect('/');
    });
}
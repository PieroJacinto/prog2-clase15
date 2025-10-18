const guestMiddleware = (req, res, next ) => {
    // si ya esta logueado , redirigimos aol home
    if(req.session.userId){
        return res.redirect('/');
    };
    // si no esta logueado, continuar
    next();
};

module.exports = guestMiddleware;
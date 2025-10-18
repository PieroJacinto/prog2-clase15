const authMiddleware = ( req, res, next) => {
    // verificar si existe sersionm y tiene userId
    if(!req.session.userId){
        return res.redirect('/auth/login');
    }
    // si esta logueado, continuar
    next();
}

module.exports = authMiddleware;
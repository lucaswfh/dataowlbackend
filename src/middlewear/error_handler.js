// error handler middlewear 
// this just prints to the user a String insted of printing the whole 
// stack trace. also note that this stops middlewear execution given it
// does not call next 
function rhandler(err, req, res, next) {
    // esto verlo en la documentacion de node sobre
    // el manejo de errores 
    if (res.headersSent) {
        return next(err);
    }

    res.header('Content-Type', 'text/plain');

    if (err.status === 401)
        res.status(401).send('Unauthorized!');
    else 
        res.status(500).send('Something broke!');
};

module.exports = rhandler;
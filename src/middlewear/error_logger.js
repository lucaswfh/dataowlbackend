const fs = require('fs');

// error logger middlewear 
// prints to console and writes to file 
// finally, passes execution on with next() 
const rlogger = (err, req, res, next) => {
    console.log(err);

    const stream = fs.createWriteStream('logs.txt', { flags: 'a' });
    stream.write('Date: ' + new Date().toDateString() + '\n');
    stream.write('Ip: ' + req.ip + '\n');
    stream.write('Method: ' + req.method + '\n');
    stream.write('URL: ' + req.baseUrl + '\n');
    stream.write('Err:' + err + '\n');
    stream.write('--------------------------------------------------------------------------------' + '\n');

    next(err);
};

module.exports = rlogger;
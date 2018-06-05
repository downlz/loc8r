var mongoose = require('mongoose');
//var dbURI = 'mongodb://localhost/loc8r';
var dbURI = 'mongodb://admin:admin@ds023475.mlab.com:23475/loc8r-dev';
if (process.env.NODE_ENV === 'production') {
  dbURI = 'mongodb://admin:admin@ds023475.mlab.com:23475/loc8r-dev';
}

require('./locations');
require('./users');
mongoose.connect(dbURI);
mongoose.connection.on('connected',function (){
  console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error',function (){
  console.log('Mongoose recevied error to ' + dbURI);
});
mongoose.connection.on('disconnected',function (){
  console.log('Mongoose connection terminated ' + dbURI);
});

var gracefulShutdown = function (msg,callback){
  mongoose.connection.closed(function (){
    console.log('Mongoose connection disconnected through' + msg);
    callback();
  })
}

// For nodemon restarts
process.once('SIGUSR2', function() {
  gracefulShutdown('nodemon restart', function() {
    process.kill(process.pid, 'SIGUSR2');
  });
});
// For app termination
process.on('SIGINT', function() {
  gracefulShutdown('app termination', function() {
    process.exit(0);
  });
});
// For Heroku app termination
process.on('SIGTERM', function() {
  gracefulShutdown('Heroku app termination', function() {
    process.exit(0);
  });
});

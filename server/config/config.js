var env = process.env.NODE_ENV || 'development' ;
console.log('env ****** ', env);

if(env === 'development' || env === 'test'){
  let config = require('./config.json');

  let envConfig = config[env];
// The following returns an array of Object's keys.
  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  })
}

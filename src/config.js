if (process.env.NODE_ENV === 'development') {
  module.exports.apiPrefix = 'http://localhost:3000';
} else if (process.env.NODE_ENV === 'production') {
  module.exports.apiPrefix = 'https://semafort-server.herokuapp.com';
}

// const mongoose = require('mongoose');

// mongoose.set('debug', true);
// mongoose.connect('mongodb://localhost:27017/fitmax')
//   .then(() => {
//     console.log('MongoDB connected');
//     mongoose.connection.close();
//   })
//   .catch(err => {
//     console.error('Error connecting to MongoDB:', err);
//   });
const mongoose = require('mongoose');

mongoose.set('debug', true);
mongoose.connect('mongodb://127.0.0.1:27017/fitmax')
  .then(() => {
    console.log('MongoDB connected');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

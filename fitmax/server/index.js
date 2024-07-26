const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose.set('debug', true);
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fitmax')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('Error connecting to MongoDB:', err));

const Schema = mongoose.Schema;

const activitySchema = new Schema({
  date: { type: Date, required: true },
  type: { type: String, required: true },
  plannedNotes: { type: String },
  actualNotes: { type: String },
});

const Activity = mongoose.model('Activity', activitySchema);

app.post('/api/activities', async (req, res) => {
  const { date, type, plannedNotes, actualNotes } = req.body;
  const activity = new Activity({ date: new Date(date), type, plannedNotes, actualNotes });
  await activity.save();
  res.send(activity);
});

app.get('/api/activities', async (req, res) => {
  const activities = await Activity.find();
  res.send(activities);
});

app.put('/api/activities/:id', async (req, res) => {
  const { id } = req.params;
  const { date, type, plannedNotes, actualNotes } = req.body;
  const activity = await Activity.findByIdAndUpdate(id, { date: new Date(date), type, plannedNotes, actualNotes }, { new: true });
  res.send(activity);
});

app.delete('/api/activities/:id', async (req, res) => {
  const { id } = req.params;
  await Activity.findByIdAndDelete(id);
  res.send({ message: 'Activity deleted' });
});

app.listen(process.env.PORT || 5000, () => {
  console.log('Server is running on port 5000');
});


// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors = require('cors');

// const app = express();

// app.use(bodyParser.json());
// app.use(cors());

// mongoose.set('debug', true);
// mongoose.connect('mongodb://127.0.0.1:27017/fitmax')
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.log('Error connecting to MongoDB:', err));

// const Schema = mongoose.Schema;

// const activitySchema = new Schema({
//   date: { type: Date, required: true },
//   type: { type: String, required: true },
//   notes: { type: String },
// });

// const Activity = mongoose.model('Activity', activitySchema);

// app.post('/api/activities', async (req, res) => {
//   const { date, type, notes } = req.body;
//   const activity = new Activity({ date, type, notes });
//   await activity.save();
//   res.send(activity);
// });

// app.get('/api/activities', async (req, res) => {
//   const activities = await Activity.find();
//   res.send(activities);
// });

// app.listen(5000, () => {
//   console.log('Server is running on port 5000');
// });

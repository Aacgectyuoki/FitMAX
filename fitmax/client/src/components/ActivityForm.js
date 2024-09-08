import React, { useState } from 'react';
import { TextField, Button, MenuItem, Snackbar, Alert, CircularProgress } from '@mui/material';
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { getWeekRange } from '../utils/dateUtils';  // Import utility function

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '300px',
    margin: '20px auto',
  },
});

const ActivityForm = ({ fetchActivities, selectedDate, setSelectedDate }) => {
  const classes = useStyles();
  const [form, setForm] = useState({
    date: '',
    type: '',
    plannedNotes: '',
    actualNotes: '',
  });
  const [weekRange, setWeekRange] = useState({ startOfWeek: new Date(), endOfWeek: new Date() });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (newValue) => {
    setForm((prevForm) => ({ ...prevForm, date: newValue.toISOString().split('T')[0] }));
  };

  const handleWeekChange = (newValue) => {
    setSelectedDate(newValue);
    const range = getWeekRange(newValue);  // Calculate week range
    setWeekRange(range);
    fetchActivities(range.startOfWeek, range.endOfWeek);  // Fetch activities for the selected week
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('http://127.0.0.1:5000/api/activities', { ...form, date: form.date });
      setForm({ date: '', type: '', plannedNotes: '', actualNotes: '' });
      setSuccess(true);
      fetchActivities(weekRange.startOfWeek, weekRange.endOfWeek);
    } catch (error) {
      setError('Error submitting activity');
      console.error('Error submitting activity:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        {/* Week Range Picker */}
        <DatePicker
          label="Select Week"
          value={selectedDate}
          onChange={handleWeekChange}
          renderInput={(params) => <TextField {...params} />}
        />

        {/* Date Picker for Activity Date */}
        <DatePicker
          label="Date"
          value={form.date ? new Date(form.date) : null}
          onChange={handleDateChange}
          renderInput={(params) => <TextField {...params} required />}
        />
      </LocalizationProvider>

      {/* Type Field */}
      <TextField
        name="type"
        label="Type"
        select
        value={form.type}
        onChange={handleChange}
        required
      >
        <MenuItem value="run">Run</MenuItem>
        <MenuItem value="lift">Lift</MenuItem>
        <MenuItem value="XT">XT</MenuItem>
        <MenuItem value="yoga">Yoga</MenuItem>
        <MenuItem value="activation">Activation Exercises</MenuItem>
        <MenuItem value="recovery">Recovery Exercises</MenuItem>
        <MenuItem value="other">Other</MenuItem>
      </TextField>

      {/* Planned Notes */}
      <TextField
        name="plannedNotes"
        label="Planned"
        multiline
        rows={4}
        value={form.plannedNotes}
        onChange={handleChange}
      />
      
      {/* Actual Notes */}
      <TextField
        name="actualNotes"
        label="Actual"
        multiline
        rows={4}
        value={form.actualNotes}
        onChange={handleChange}
      />
      
      {/* Submit Button */}
      <Button type="submit" variant="contained" color="primary" disabled={loading}>
        {loading ? <CircularProgress size={24} /> : 'Submit'}
      </Button>
      
      {/* Error and Success Alerts */}
      {error && <Alert severity="error">{error}</Alert>}
      <Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}>
        <Alert onClose={() => setSuccess(false)} severity="success">
          Activity submitted successfully!
        </Alert>
      </Snackbar>
    </form>
  );
};

export default ActivityForm;

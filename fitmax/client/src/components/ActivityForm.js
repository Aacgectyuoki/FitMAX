import React, { useState } from 'react';
import { TextField, Button, MenuItem } from '@mui/material';
import { makeStyles } from '@mui/styles';
import axios from 'axios';

const useStyles = makeStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '300px',
    margin: '20px auto',
  },
});

const ActivityForm = ({ fetchActivities }) => {
  const classes = useStyles();
  const [form, setForm] = useState({
    date: '',
    type: '',
    plannedNotes: '',
    actualNotes: '',
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedDate = new Date(form.date).toISOString().split('T')[0];
      await axios.post('http://127.0.0.1:5000/api/activities', { ...form, date: formattedDate });
      setForm({ date: '', type: '', plannedNotes: '', actualNotes: '' });
      fetchActivities();
    } catch (error) {
      console.error('Error submitting activity:', error);
    }
  };

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <TextField
        name="date"
        label="Date"
        type="date"
        value={form.date}
        onChange={handleChange}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        name="type"
        label="Type"
        select
        value={form.type}
        onChange={handleChange}
      >
        <MenuItem value="run">Run</MenuItem>
        <MenuItem value="lift">Lift</MenuItem>
        <MenuItem value="XT">XT</MenuItem>
      </TextField>
      <TextField
        name="plannedNotes"
        label="Planned"
        multiline
        rows={4}
        value={form.plannedNotes}
        onChange={handleChange}
      />
      <TextField
        name="actualNotes"
        label="Actual"
        multiline
        rows={4}
        value={form.actualNotes}
        onChange={handleChange}
      />
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </form>
  );
};

export default ActivityForm;

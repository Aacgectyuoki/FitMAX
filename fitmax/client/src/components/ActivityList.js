import React from 'react';
import { List, ListItem, ListItemText, IconButton, TextField, Button, MenuItem } from '@mui/material';
import { makeStyles } from '@mui/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';

const useStyles = makeStyles({
  list: {
    width: '300px',
    margin: '20px auto',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
  },
});

const ActivityList = ({ activities, setActivities }) => {
  const classes = useStyles();
  const [editId, setEditId] = React.useState(null);
  const [editForm, setEditForm] = React.useState({ date: '', type: '', plannedNotes: '', actualNotes: '' });

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/activities/${id}`);
      setActivities(prevActivities => prevActivities.filter(activity => activity._id !== id));
    } catch (error) {
      console.error('Error deleting activity:', error);
    }
  };

  const handleEdit = (activity) => {
    setEditId(activity._id);
    setEditForm({
      date: new Date(activity.date).toISOString().split('T')[0],
      type: activity.type,
      plannedNotes: activity.plannedNotes,
      actualNotes: activity.actualNotes,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formattedDate = new Date(editForm.date).toISOString().split('T')[0];
      const response = await axios.put(`http://127.0.0.1:5000/api/activities/${editId}`, { ...editForm, date: formattedDate });
      setActivities(prevActivities => prevActivities.map(activity => (activity._id === editId ? response.data : activity)));
      setEditId(null);
    } catch (error) {
      console.error('Error updating activity:', error);
    }
  };

  const handleChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <List className={classes.list}>
      {activities.map((activity) => (
        <ListItem key={activity._id} className={classes.listItem}>
          {editId === activity._id ? (
            <form onSubmit={handleUpdate}>
              <TextField
                name="date"
                label="Date"
                type="date"
                value={editForm.date}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                name="type"
                label="Type"
                select
                value={editForm.type}
                onChange={handleChange}
              >
                <MenuItem value="run">Run</MenuItem>
                <MenuItem value="lift">Lift</MenuItem>
                <MenuItem value="XT">XT</MenuItem>
              </TextField>
              <TextField
                name="plannedNotes"
                label="Planned Notes"
                multiline
                rows={2}
                value={editForm.plannedNotes}
                onChange={handleChange}
              />
              <TextField
                name="actualNotes"
                label="Actual Notes"
                multiline
                rows={2}
                value={editForm.actualNotes}
                onChange={handleChange}
              />
              <Button type="submit" variant="contained" color="primary">
                Update
              </Button>
            </form>
          ) : (
            <>
              <ListItemText
                primary={`${new Date(activity.date).toISOString().split('T')[0]} - ${activity.type}`}
                secondary={`Planned: ${activity.plannedNotes} | Actual: ${activity.actualNotes}`}
              />
              <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(activity)}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(activity._id)}>
                <DeleteIcon />
              </IconButton>
            </>
          )}
        </ListItem>
      ))}
    </List>
  );
};

export default ActivityList;

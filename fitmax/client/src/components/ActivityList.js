import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, TextField, Button, MenuItem, Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
    margin: '20px auto',
    border: '1px solid #ccc',
    borderRadius: '8px',
  },
  tableContainer: {
    borderRadius: '15px',
    margin: '10px 10px',
    maxWidth: 950,
  },
  tableCell: {
    textAlign: 'center',
  },
  tableCellActions: {
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
  editForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: '20px',
    borderRadius: '10px',
  },
  button: {
    marginTop: '10px',
    backgroundColor: '#3f51b5',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#303f9f',
    },
  },
  iconButton: {
    color: '#3f51b5',
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

  const sortedActivities = activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <TableContainer component={Paper} className={classes.tableContainer}>
      <Table className={classes.table} aria-label="activities table">
        <TableHead>
          <TableRow>
            <TableCell style={{ fontWeight: 'bold', color: 'white', backgroundColor: '#3f51b5'}}>Date</TableCell>
            <TableCell style={{ fontWeight: 'bold', color: 'white', backgroundColor: '#3f51b5'}}>Type</TableCell>
            <TableCell style={{ fontWeight: 'bold', color: 'white', backgroundColor: '#3f51b5'}}>Planned</TableCell>
            <TableCell style={{ fontWeight: 'bold', color: 'white', backgroundColor: '#3f51b5'}}>Actual</TableCell>
            <TableCell style={{ fontWeight: 'bold', color: 'white', backgroundColor: '#3f51b5'}}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedActivities.map((activity) => (
            <TableRow key={activity._id}>
              {editId === activity._id ? (
                <TableCell colSpan={5}>
                  <form onSubmit={handleUpdate} className={classes.editForm}>
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
                      label="Planned"
                      multiline
                      rows={4}
                      value={editForm.plannedNotes}
                      onChange={handleChange}
                    />
                    <TextField
                      name="actualNotes"
                      label="Actual"
                      multiline
                      rows={4}
                      value={editForm.actualNotes}
                      onChange={handleChange}
                    />
                    <Button type="submit" variant="contained" className={classes.button}>
                      Update
                    </Button>
                  </form>
                </TableCell>
              ) : (
                <>
                  <TableCell className={classes.tableCell}>{new Date(activity.date).toISOString().split('T')[0]}</TableCell>
                  <TableCell className={classes.tableCell}>{activity.type}</TableCell>
                  <TableCell className={classes.tableCell} style={{ whiteSpace: 'pre-wrap' }}>{activity.plannedNotes}</TableCell>
                  <TableCell className={classes.tableCell} style={{ whiteSpace: 'pre-wrap' }}>{activity.actualNotes}</TableCell>
                  <TableCell className={classes.tableCellActions}>
                    <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(activity)} className={classes.iconButton}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(activity._id)} className={classes.iconButton}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ActivityList;

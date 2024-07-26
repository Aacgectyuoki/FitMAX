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
  const [editForm, setEditForm] = React.useState({ date: '', type: '', notes: '' });

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
    setEditForm({ date: new Date(activity.date).toISOString().split('T')[0], type: activity.type, notes: activity.notes });
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
                name="notes"
                label="Notes"
                multiline
                rows={2}
                value={editForm.notes}
                onChange={handleChange}
              />
              <Button type="submit" variant="contained" color="primary">
                Update
              </Button>
            </form>
          ) : (
            <>
              <ListItemText
                primary={new Date(activity.date).toISOString().split('T')[0]}
                secondary={`${activity.type} - ${activity.notes}`}
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


// import React from 'react';
// import { List, ListItem, ListItemText, IconButton, TextField, Button, MenuItem } from '@mui/material';
// import { makeStyles } from '@mui/styles';
// import DeleteIcon from '@mui/icons-material/Delete';
// import EditIcon from '@mui/icons-material/Edit';
// import axios from 'axios';
// import moment from 'moment';

// const useStyles = makeStyles({
//   list: {
//     width: '300px',
//     margin: '20px auto',
//   },
//   listItem: {
//     display: 'flex',
//     justifyContent: 'space-between',
//   },
// });

// const ActivityList = ({ activities, fetchActivities }) => {
//   const classes = useStyles();
//   const [editId, setEditId] = React.useState(null);
//   const [editForm, setEditForm] = React.useState({ date: '', type: '', notes: '' });

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://127.0.0.1:5000/api/activities/${id}`);
//       fetchActivities();
//     } catch (error) {
//       console.error('Error deleting activity:', error);
//     }
//   };

//   const handleEdit = (activity) => {
//     setEditId(activity._id);
//     setEditForm({ date: moment(activity.date).format('YYYY-MM-DD'), type: activity.type, notes: activity.notes });
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.put(`http://127.0.0.1:5000/api/activities/${editId}`, editForm);
//       setEditId(null);
//       fetchActivities();
//     } catch (error) {
//       console.error('Error updating activity:', error);
//     }
//   };

//   const handleChange = (e) => {
//     setEditForm({
//       ...editForm,
//       [e.target.name]: e.target.value,
//     });
//   };

//   return (
//     <List className={classes.list}>
//       {activities.map((activity) => (
//         <ListItem key={activity._id} className={classes.listItem}>
//           {editId === activity._id ? (
//             <form onSubmit={handleUpdate}>
//               <TextField
//                 name="date"
//                 label="Date"
//                 type="date"
//                 value={editForm.date}
//                 onChange={handleChange}
//                 InputLabelProps={{
//                   shrink: true,
//                 }}
//               />
//               <TextField
//                 name="type"
//                 label="Type"
//                 select
//                 value={editForm.type}
//                 onChange={handleChange}
//               >
//                 <MenuItem value="run">Run</MenuItem>
//                 <MenuItem value="lift">Lift</MenuItem>
//                 <MenuItem value="XT">XT</MenuItem>
//               </TextField>
//               <TextField
//                 name="notes"
//                 label="Notes"
//                 multiline
//                 rows={2}
//                 value={editForm.notes}
//                 onChange={handleChange}
//               />
//               <Button type="submit" variant="contained" color="primary">
//                 Update
//               </Button>
//             </form>
//           ) : (
//             <>
//               <ListItemText
//                 primary={moment(activity.date).format('YYYY-MM-DD')}
//                 secondary={`${activity.type} - ${activity.notes}`}
//               />
//               <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(activity)}>
//                 <EditIcon />
//               </IconButton>
//               <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(activity._id)}>
//                 <DeleteIcon />
//               </IconButton>
//             </>
//           )}
//         </ListItem>
//       ))}
//     </List>
//   );
// };

// export default ActivityList;

// import React from 'react';
// import { List, ListItem, ListItemText } from '@mui/material';
// import { makeStyles } from '@mui/styles';
// import moment from 'moment';

// const useStyles = makeStyles({
//   list: {
//     width: '300px',
//     margin: '20px auto',
//   },
// });

// const ActivityList = ({ activities }) => {
//   const classes = useStyles();

//   return (
//     <List className={classes.list}>
//       {activities.map((activity) => (
//         <ListItem key={activity._id}>
//           <ListItemText
//             primary={moment(activity.date).format('YYYY-MM-DD')}
//             secondary={`${activity.type} - ${activity.notes}`}
//           />
//         </ListItem>
//       ))}
//     </List>
//   );
// };

// export default ActivityList;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ActivityForm from './components/ActivityForm';
import ActivityList from './components/ActivityList';
import './App.css';

const App = () => {
  const [activities, setActivities] = useState([]);

  const fetchActivities = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/activities');
      const activitiesWithDates = response.data.map(activity => ({
        ...activity,
        date: new Date(activity.date),
      }));
      const sortedActivities = activitiesWithDates.sort((a, b) => b.date - a.date);
      setActivities(sortedActivities);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <div className="App">
      <ActivityForm fetchActivities={fetchActivities} />
      <ActivityList activities={activities} setActivities={setActivities} />
    </div>
  );
};

export default App;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import ActivityForm from './components/ActivityForm';
// import ActivityList from './components/ActivityList';
// import './App.css';

// const App = () => {
//   const [activities, setActivities] = useState([]);

//   const fetchActivities = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/activities');
//       setActivities(response.data);
//     } catch (error) {
//       console.error('Error fetching activities:', error);
//     }
//   };

//   useEffect(() => {
//     fetchActivities();
//   }, []);

//   return (
//     <div>
//       <ActivityForm fetchActivities={fetchActivities} />
//       <ActivityList activities={activities} />
//     </div>
//   );
// };

// export default App;

export const getWeekRange = (date) => {
    const selectedDate = new Date(date);
    const firstDay = selectedDate.getDate() - selectedDate.getDay() + 1; // Monday
    const lastDay = firstDay + 6; // Sunday
    const startDate = new Date(selectedDate.setDate(firstDay));
    const endDate = new Date(selectedDate.setDate(lastDay));
    
    return {
      startOfWeek: startDate,
      endOfWeek: endDate,
    };
  };
  
  
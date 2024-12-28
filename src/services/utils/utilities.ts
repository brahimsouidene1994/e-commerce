function formatDate(chDate: string): string {
  const date = new Date(chDate);

  // Extract local date components
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${day}/${month}/${year}-${hours}:${minutes}`;
}
function timeDifference(date: string): string {
  const currentDate = new Date(); // Current date and time
  const inputDate = new Date(date); // Parse the input string into a Date object

  if (isNaN(inputDate.getTime())) {
    throw new Error("Invalid date format");
  }

  const diffInMilliseconds = currentDate.getTime() - inputDate.getTime();
  const totalMinutes = Math.floor(diffInMilliseconds / (1000 * 60)); // Total minutes difference
  const hours = Math.floor(totalMinutes / 60); // Convert minutes to hours
  const minutes = totalMinutes % 60; // Remaining minutes after hours

  return `${hours}h${minutes}m`;
}

export default {
  formatDate,
  timeDifference
}
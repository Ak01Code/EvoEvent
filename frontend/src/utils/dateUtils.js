export const formatDate = (dateString) => {
  const date = new Date(dateString);

  // Get the day, month, and year
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  // Return formatted date
  return `${day}, ${month} ${year}`;
};

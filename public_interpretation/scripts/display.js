export const setAlert = (msg, type) => {
  // Create alert element
  const alert = document.createElement("div");
  // Add class
  alert.className = `alert alert-${type}`;
  // Add text
  alert.innerHTML = msg;
  document.body.appendChild(alert);
  setTimeout(() => {
    alert.remove();
  }, 3000);
};

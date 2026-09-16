const form = document.getElementById("contactForm");
const status = document.getElementById("status");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  status.textContent = "Sending...";

  const data = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    message: document.getElementById("message").value
  };

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    status.textContent = result.message;
    if (response.ok) form.reset();
  } catch {
    status.textContent = "Backend connection failed. Please try again after deployment.";
  }
});

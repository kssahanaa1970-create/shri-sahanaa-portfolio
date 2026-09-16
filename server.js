const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model("Message", messageSchema);

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }

    if (!process.env.MONGODB_URI) {
      return res.status(503).json({
        message: "Database is not configured yet. The portfolio is ready; connect MongoDB before using the contact database."
      });
    }

    await mongoose.connect(process.env.MONGODB_URI);
    await Message.create({ name, email, message });
    res.json({ message: "Thanks! Your message was saved successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ status: "Portfolio backend is running" });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Portfolio running at http://localhost:${PORT}`);
});

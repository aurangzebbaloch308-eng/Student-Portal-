const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const PDFDocument = require("pdfkit");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// MongoDB connect
mongoose.connect("YOUR_MONGODB_URL");

// Models
const User = mongoose.model("User", {
  name: String,
  email: String,
  password: String,
});

const Application = mongoose.model("Application", {
  userId: String,
  name: String,
  class: String,
  city: String,
  paymentScreenshot: String,
  status: { type: String, default: "pending" },
  result: String,
  marks: Number,
});

// File upload
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + ".png");
  },
});
const upload = multer({ storage });

// Routes

// Signup
app.post("/signup", async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

// Login
app.post("/login", async (req, res) => {
  const user = await User.findOne(req.body);
  res.json(user);
});

// Submit Form + Payment
app.post("/apply", upload.single("image"), async (req, res) => {
  const appData = await Application.create({
    ...req.body,
    paymentScreenshot: req.file.filename,
  });

  // Generate PDF
  const doc = new PDFDocument();
  const fileName = `uploads/${appData._id}.pdf`;
  doc.pipe(fs.createWriteStream(fileName));

  doc.fontSize(20).text("ADMIT CARD", { align: "center" });
  doc.text(`Name: ${appData.name}`);
  doc.text(`Class: ${appData.class}`);
  doc.text(`City: ${appData.city}`);
  doc.text(`Roll No: ${appData._id}`);
  doc.text("Test: Physical Test");
  doc.text("Bring this slip on test day");

  doc.end();

  res.json({ ...appData._doc, pdf: fileName });
});

// Admin: Get all applications
app.get("/applications", async (req, res) => {
  const data = await Application.find();
  res.json(data);
});

// Admin: Approve Payment
app.post("/approve/:id", async (req, res) => {
  await Application.findByIdAndUpdate(req.params.id, {
    status: "approved",
  });
  res.send("Approved");
});

// Admin: Add Result
app.post("/result/:id", async (req, res) => {
  const { marks, result } = req.body;
  await Application.findByIdAndUpdate(req.params.id, {
    marks,
    result,
  });
  res.send("Result Updated");
});

app.listen(5000, () => console.log("Server running"));

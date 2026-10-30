const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// In-memory array (data resets whenever the server restarts)
let items = [
  { id: 1, name: "Book", price: 250 },
  { id: 2, name: "Pen", price: 25 }
];
let nextId = 3;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// READ: get all items
app.get("/api/items", (req, res) => {
  res.json(items);
});

// READ: get a single item by ID
app.get("/api/items/:id", (req, res) => {
  const id = Number(req.params.id);
  const item = items.find((entry) => entry.id === id);

  if (!item) {
    return res.status(404).json({ message: "Item not found." });
  }

  res.json(item);
});

// CREATE: add a new item
app.post("/api/items", (req, res) => {
  const { name, price } = req.body;

  if (typeof name !== "string" || !name.trim() ||
      price === undefined || price === "" ||
      !Number.isFinite(Number(price)) || Number(price) < 0) {
    return res.status(400).json({ message: "Enter a valid name and price." });
  }

  // Ensure strict sequential IDs without gaps
  items.forEach((entry, idx) => {
    entry.id = idx + 1;
  });

  const newItem = {
    id: items.length + 1,
    name: name.trim(),
    price: Number(price)
  };

  items.push(newItem);
  nextId = items.length + 1;
  res.status(201).json(newItem);
});

// UPDATE: edit an item by ID
app.put("/api/items/:id", (req, res) => {
  const id = Number(req.params.id);
  const { name, price } = req.body;

  if (typeof name !== "string" || !name.trim() ||
      price === undefined || price === "" ||
      !Number.isFinite(Number(price)) || Number(price) < 0) {
    return res.status(400).json({ message: "Enter a valid name and price." });
  }

  const item = items.find((entry) => entry.id === id);
  if (!item) {
    return res.status(404).json({ message: "Item not found." });
  }

  item.name = name.trim();
  item.price = Number(price);
  res.json(item);
});

// DELETE: remove an item by ID
app.delete("/api/items/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = items.findIndex((entry) => entry.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Item not found." });
  }

  const deletedItem = items.splice(index, 1)[0];
  // Re-index remaining items so IDs remain strictly sequential: 1, 2, 3...
  items.forEach((entry, idx) => {
    entry.id = idx + 1;
  });
  nextId = items.length + 1;
  res.json({ message: "Item deleted successfully.", item: deletedItem });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

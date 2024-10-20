import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Only use this for JSON parsing

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/MERC-CRUD', 
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Define schema and model
const itemSchema = new mongoose.Schema({
    name: String,
    description: String,
});

const Item = mongoose.model('Item', itemSchema);

// Routes

// GET route to fetch all items
app.get('/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST route to create a new item
app.post('/items', async (req, res) => {
    const item = new Item({
        name: req.body.name,
        description: req.body.description,
    });
    try {
        const newItem = await item.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT route to update an item by ID
app.put('/items/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);

        if (item) {
            item.name = req.body.name;
            item.description = req.body.description;
            const updatedItem = await item.save();
            res.json(updatedItem);
        } else {
            res.status(404).json({ message: "Item not found" });
        }
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE route to delete an item by ID
app.delete('/items/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        await item.deleteOne();
        res.json({ message: "Item deleted" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

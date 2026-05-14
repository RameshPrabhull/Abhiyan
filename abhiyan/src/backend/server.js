const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const {router,detailsSchema} = require('./details'); // Import additional routes

const app = express();
const port = 3000;

// Middleware
app.use(cors()); // Allow requests from your React app
app.use(bodyParser.json());

// MongoDB Connection
const mongoURI = 'mongodb://127.0.0.1:27017/abhiyan'; // Replace with your MongoDB URI
mongoose.connect(mongoURI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// User Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

const User = mongoose.model('User', userSchema);
const Userdetail=mongoose.model("Userdetail",detailsSchema);
// Routes
app.use('/', router); // Mount the `details.js` router

// Endpoint for user signup
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).send({ error: 'Error saving user' });
    }
});

// Endpoint for user signin
app.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email:email, password:password });
        if (user) {
            const details= await Userdetail.findOne({email});
            res.status(200).send({ message: 'Sign-in successful', details })
        } else {
            res.status(400).send({ error: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).send({ error: 'Error signing in' });
    }
});

// Start the Server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

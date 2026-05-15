
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// User Detail Schema
const detailsSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    nationality: String,
    age: Number,
    state: String,
    beneficiaries: String,
    income: Number,
    caste: String,
    email: String
},
{ strict: false}
);

const User = mongoose.model('UserDetail', detailsSchema);

// Endpoint to handle form submissions
router.post('/submit', async (req, res) => {
    try {
        const { firstname, lastname, nationality, age,state, beneficiaries, income, caste, email } = req.body;

        const newUser = new User({
            firstname,
            lastname,
            nationality,
            age,
            state,
            beneficiaries,
            income,
            caste,
            email
        });

        await newUser.save();
        res.status(201).json({ message: 'Form submitted successfully!' });
    } catch (error) {
        console.error('Error saving form data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = {router,detailsSchema};

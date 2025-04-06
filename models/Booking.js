const mongoose = require('mongoose');
const BookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    state:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "State"
    },
    
    destination: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Destination"
    },
    paymentMethod: {
        type: String,
    },
    totalAmount: {
        type: Number,
    },
    peopleCount: {
        type: Number,
    },
    date: {
        type: Date,
    },
    status: {
        type: String,
        default: "booked"
    },
});

// Create the model

module.exports = mongoose.model('Booking', BookingSchema);// Use singular form


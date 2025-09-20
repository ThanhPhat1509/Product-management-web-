const mongoose = require('mongoose');

module.exports.connect = async () => {
    try {
        mongoose.connect(process.env.MONGO_URI);

    } catch (error) {
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });
    }
}


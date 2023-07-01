const mongoose = require('mongoose');

const connectionURL = process.env.MONGODB_CONNECTION_URL;
mongoose.connect(connectionURL);
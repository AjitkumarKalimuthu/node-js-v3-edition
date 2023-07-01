const express = require('express');
const app = express();
const port = process.env.PORT;
// When er require any file or function, that will be executed
// So here Mongoose connection with DB will be executed.
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

// To Parse the JSON coming in Request
app.use(express.json());
// We need to register routers to use
app.use(userRouter);
app.use(taskRouter);


app.listen(port, () => console.log(`Express Server is Up and Running in Port ${port}`));
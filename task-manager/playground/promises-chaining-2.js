require('../src/db/mongoose');
const Task = require('../src/models/task');

// Task.findByIdAndDelete('648d5187684c0a82b96a78bf').then((task) => {
//     console.log(task);
//     return Task.countDocuments({ completed: true });
// }).then((count) => {
//     console.log(count);
// }).catch((err) => console.log('Error occured!', err));

// Primise Chaining to avoid nexted promises and single catch block,
// Instead of calling fn which retrun promise and handling inside the promise
// we need to return the promise inside first promise

const deleteTaskAndCount = async (id, completed) => {
    const task = await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments({ completed });
    return count;
}
deleteTaskAndCount('648d5656e40cb8790bbcaffd', true).then((count) => {
    console.log(count);
}).catch((err) => console.log('Error occured!', err));

// Async- Await
// We can use only await in async functions
// Await Unwraps promise and returns value from promise
// It requires one then and catch in parent function to get final result(All Promises fullfilled)
// or error (when one promise rejected)
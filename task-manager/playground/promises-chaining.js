require('../src/db/mongoose');
const User = require('../src/models/user');

// User.findByIdAndUpdate('648d4ff6e2c2e60a7f21f251', { age: 27 }).then((user) => {
//     console.log(user);
//     return User.countDocuments({ age: 27 });
// }).then((count) => {
//     console.log(count);
// }).catch((err) => console.log('Error occured!', err));

// Primise Chaining to avoid nexted promises and single catch block,
// Instead of calling fn which retrun promise and handling inside the promise
// we need to return the promise inside first promise

const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, { age });
    const count = await User.countDocuments({ age });
    return count;
}
updateAgeAndCount('648d4ff6e2c2e60a7f21f251', 25).then((count) => {
    console.log(count);
}).catch((err) => console.log('Error occured!', err));
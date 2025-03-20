const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true // This create two field createdAt and updatedAt timestaps in user obj.
});

// Virtually added tasks field in User and will neither update DB nor send this in response. 
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});

// toJSON function runs whenever user object gets stringied using JSON
// for eg: in sending response Mongoose will stringyfy object to convet to JSON
// removing private data while sending response to user
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;
}

// Instance methods are functions that operate on a specific document (instance) of a model
// They are defined on the schema using schema.methods.
// Inside these methods, this refers to the document instance.
// If we have to add function to instance then we need to use methods in schema
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    // jwt.sign({id}, 'secret text', {expiresIn: '7 days'}) // return token
    // which consists of 3 parts 'header(In64based decoded JSON string)'+'data(In64based decoded JSON string)'+'secrettext'
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({token}); // storing tokens for tracking purpose
    await user.save();
    return token;
}

// If we have to add function to Model or Class then we need to use statics in schema
// Reusable function to check login creadentials using bcrypt and return user
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});
    if (!user) {
        throw new Error('Unable to login: User Not Found');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Unable to login: Password is Incorrect');
    }
    return user;
}


// Hashing Plain Text Password using bcrypt
// Arrow fn should be used as callback, because this refrence needs be binded
// this will be binded to document that we are inserting
// Middleware
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        // hash method will hash the password (irreversible) with 8 rounds (standard)
        // and update user with hashed password
        user.password = await bcrypt.hash(user.password, 8);
    }
    next(); // pass execution to next route or middleware or next function
});

// Delete user tasks when user is removed
userSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    const user = this;
    console.log(user);
    console.log(await Task.deleteMany({owner: user._id}));
    await Task.deleteMany({owner: user._id});
    console.log(await Task.find({}));
    next();
});

// const CollectionModel = mongoose.model('Collection name', Collection Schema);
const User = mongoose.model('User', userSchema);
module.exports = User;



// Summary of Hooks
// Hook Type	Hook Name	Description
// Document	    validate	Runs before a document is validated.
//              save	    Runs before or after a document is saved.
//              remove	    Runs before or after a document is removed.
//              updateOne	Runs before or after a document is updated using updateOne.
//              init	    Runs when a document is initialized.
// Query	    find	    Runs before or after a find query is executed.
//              findOne	    Runs before or after a findOne query is executed.
//              deleteOne	Runs before or after a deleteOne query is executed.
//              updateOne	Runs before or after an updateOne query is executed.
//              aggregate	Runs before or after an aggregation query is executed.


// Common Use Cases for Hooks
// Validation:
// Use pre('validate') to enforce custom validation rules.

// Data Transformation:
// Use pre('save') to modify data before saving (e.g., hashing passwords).

// Logging:
// Use post('save') or post('remove') to log actions.

// Cleanup:
// Use pre('remove') to delete related documents or data.

// Query Modification:
// Use pre('find') or pre('findOne') to modify query conditions.


// Key Differences
// Context	        this Refers To	            Example Use Case
// Document Hooks	The document instance.	    Access/modify document properties.
// Query Hooks	    The query object.	        Modify the query (e.g., add filters).
// Static Methods	The model (Mongoose class).	Call model methods (e.g., findOne).

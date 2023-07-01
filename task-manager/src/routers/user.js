const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');

router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    } catch (e) {
        res.status(400).send(e);
    }
    // user.save()
    //     .then(() => res.status(201).send(user))
    //     .catch((e) => res.status(400).send(e));
});

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        users?.length ? res.send(users) : res.status(404).send('Users Not Found');
    } catch (e) {
        res.status(500).send(e);
    }
});

// my profile route
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((tokenObj) => tokenObj.token !== req.token);
        await req.user.save();
        res.send('Logged Out Successfully!');
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send('All sessions Logged Out Successfully!');
    } catch (e) {
        res.status(500).send(e);
    }
});

// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id;
//     try {
//         const user = await User.findById(_id);
//         user ? res.send(user) : res.status(404).send('User Not Found');
//     } catch (e) {
//         res.status(500).send(e);
//     }
// });

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'age', 'password'];
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
        return res.status(400).send({error: 'Not a valid update!'});
    }
    try {
        // findByIdAndUpdate bypass mongoose, so we manually setting config option to run validators
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

        //Alternate Method
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.deleteOne();
        res.send(req.user);
    } catch (e) {
        res.status(500).send(e);
    }
});

const upload = multer({
        // dest: 'avatars', // if dest not passed then file will be passed from multer to req.
        limits:{
            fileSize: 1000000 // in bytes 1MB
        },
        fileFilter(req, file, cb) {
            if (file.originalname.match(/\.(png|jpg|jpeg)$/)) {
                return cb(undefined, true); // success
            }
            cb(new Error('Please Upload Image!')); // error case
        }
    }); // creating new multer instance with destination folder for file.
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 200, height: 200 }).png().toBuffer();
    // req.user.avatar = req.file.buffer;
    req.user.avatar = buffer;
    await req.user.save();
    res.send('Avatar uploaded successfully!');
}, (error, req, res, next) => {
    res.status(400).send({error: error.message});
});

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send('Avatar Deleted successfully!');
});

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findOne({_id: req.params.id});
        if (!user || !user.avatar) {
            throw new Error('Avatar Not Found!');
        }
        res.set('Context-Type', 'image/png'); // setting response type as image with jpg
        res.send(user.avatar);
    } catch (e) {
        res.status(400).send(e);
    }
    
});

module.exports = router;

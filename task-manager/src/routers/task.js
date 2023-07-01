const express = require('express');
const router = new express.Router();
const Task = require('../models/task');
const auth = require('../middleware/auth');

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({ ...req.body, owner: req.user._id });
    try {
        await task.save();
        res.status(201).send(task);
    } catch (e) {
        res.status(400).send(e);
    }
    // task.save()
    //     .then(() => res.status(201).send(task))
    //     .catch((e) => res.status(400).send(e));
});


// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20 // limit - limits number of results and skip - skips that many results.
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    try {
        // const tasks = await Task.find({owner: req.user._id});
        // tasks?.length ? res.send(tasks) : res.status(404).send('Tasks Not Found');
        const match = {};
        const sort = {};
        if (req.query.completed) { // 'true' or 'false'
            match.completed = req.query.completed === 'true';
        }
        // sort obj will contain the key as sort field and value as asc or desc like 1 or -1;
        if (req.query.sortBy) {
            parts = req.query.sortBy.split(':');
            sort[parts[0]] = parts[1] === 'desc'? -1 : 1;
        }
        //Alternate Method
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        });
        req.user.tasks ? res.send(req.user.tasks) : res.status(404).send('Tasks Not Found');
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findOne({_id, owner: req.user._id});
        task ? res.send(task) : res.status(404).send('Task Not Found');
    } catch (e) {
        res.status(500).send(e);
    }
});

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
        return res.status(400).send({error: 'Not a valid update!'});
    }
    try {
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        //Alternate Method
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id});
        if (!task) {
            return res.status(404).send('Task Not Found');
        }
        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();
        res.send(task);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id});
        task ? res.send(task) : res.status(404).send('Task Not Found');
    } catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;
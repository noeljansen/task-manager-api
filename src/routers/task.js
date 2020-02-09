const express = require('express')

const Task = require('../models/task')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id     //this comes from the auth middleware. Links task to an owner
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
    // task.save().then(() => {
    //     res.status(201).send(task)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })
})

// Old - without owner property / link to user
// router.post('/tasks', async (req, res) => {
//     const task = new Task(req.body)
//     try {
//         await task.save()
//         res.status(201).send(task)
//     } catch (e) {
//         res.status(400).send(e)
//     }
//     // task.save().then(() => {
//     //     res.status(201).send(task)
//     // }).catch((e) => {
//     //     res.status(400).send(e)
//     // })
// })

//Read all tasks
// router.get('/tasks', auth, async (req, res) => {
//     try {
//         //tasks = await Task.find({})   //shows all tasks. doesnt use auth
//         const tasks = await Task.find({ owner: req.user._id })
//         res.send(tasks)
//         //Alternative method to get tasks belonging to logged in user:
//         // await req.user.populate('tasks').execPopulate()
//         // res.send(req.user.tasks)
//     } catch (e) {
//         res.status(500).send(e)
//     }

//     // Task.find({}).then((tasks) => {
//     //     res.send(tasks)
//     // }).catch((e) => {
//     //     res.status(500).send(e)
//     // })
// })


//Read tasks with filter,
//Get /tasks?completed=true
//Get /tasks?limit=10&skip=0
//Get /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        //match.completed = req.query.completed // this would not work because req.query.completed is a string, not a boolean
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send(e)
    }

    // Task.find({}).then((tasks) => {
    //     res.send(tasks)
    // }).catch((e) => {
    //     res.status(500).send(e)
    // })
})

//Read singular task
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        //const task = await Task.findById(_id)     //Used without auth
        const task = await Task.findOne({ _id, owner: req.user._id }) //This uses auth

        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
    // Task.findById(_id).then((task) => {
    //     if (!task) {
    //         return res.status(404).send()
    //     }
    //     res.send(task)
    // }).catch((e) => {
    //     res.status(500).send(e)
    // })
})

//Update Task
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid update!' })
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
        //const task = await Task.findById(req.params.id)   //not used with auth
        // updates.forEach((update) => task[update] = req.body[update])
        // await task.save()

        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if (!task) {
            return res.status(404).send()
        }
        // Moved here for auth
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        res.send(task)

    } catch (e) {
        res.status(400).send(e)
    }

})

//Delete Task
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        // const task = await Task.findByIdAndDelete(req.params.id)  //used without auth
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }
        return res.send(task)

    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router
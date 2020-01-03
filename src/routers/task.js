const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')


//create new task
router.post('/tasks', auth, async (req, res) => {

    const task = new Task({
        ...req.body,                          //... is spread operator which is used to copy the data of array body in this 
        //object so that owner can be attached with it. 
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

// select query for the task documents
router.get('/tasks', auth, async (req, res) => {

    const match = {}  //this constant is adding to provide filter on tasks based on completed true or false.
    const sort = {} //this variable is provided just like above variable but for sorting of records in asc or desc.

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':') //getting value of parts from query string but since it is not single value 
        //we are spliting it by ':'. ?sortBy=createdOn:desc


        //now here, we are setting first part of our splitted parts as property of sort -> parts[0] and second part of splitted string
        //as value of that first part -->[part[1]]
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        console.log(sort)
    }

    //this condition checks if their is a query parameter in URL such as /tasks?completed = true or false
    if (req.query.completed) {
        match.completed = req.query.completed === 'true' // if the value of query parameter is true, then match variable is true
        //else it will be false. Also if there is no value in match then neither true nor false
        // and the populate() will work normally means fetch all tasks
    }

    try {
        await req.user.populate({
            path: 'userTasks',
            match,
            options: {
                limit: parseInt(req.query.limit), //number of records per page
                skip: parseInt(req.query.skip), //from where you want to start eg. if skip=2 then result will display records from 4th
                //record onwards and skip first 3
                sort
            }

        }).execPopulate()
        res.status(200).send(req.user.userTasks)

        // const task = await Task.find({ owner: req.user._id }) //all tasks created by that user
        // res.status(200).send(task)
    } catch (e) {
        res.status(500).send(e)
    }

})

//find task by ID
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        // const task = await Task.findById(_id)

        const task = await Task.findOne({ _id, owner: req.user._id }) // now the task found will have the task id and the user id from owner so that only those tasks are listed created by that owner
        if (!task) {
            return res.status(400).send()
        }
        res.status(200).send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

//update task

router.patch('/tasks/:id', auth, async (req, res) => {

    const _id = req.params.id
    const updated = Object.keys(req.body)
    const updatesAllowed = ['completed', 'category', 'task']
    const validUpdate = updated.every((update) => updatesAllowed.includes(update))
    if (!validUpdate) {
        return res.status(400).send({ error: 'This is not a valid update' })
    }
    try {
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        //: refer comments  in user Update

        const task = await Task.findOne({ _id, owner: req.user._id })//update tasks by ids but only for the user who created them. If owner id does not match then no update

        if (!task) {
            res.status(404).send()
        }
        updated.forEach((update) => {
            task[update] = req.body[update]
        })

        await task.save()
        res.status(200).send(task)

    } catch (e) {
        res.status(400).send(e)
    }
})

//delete task
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndRemove({ _id: req.params.id, owner: req.user._id })
        if (!task) {
            return res.status(400).send()
        }
        res.status(200).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})


module.exports = router
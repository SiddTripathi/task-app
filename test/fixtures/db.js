//This is basically setup of demo or test data so that our test suites have a database and data 
//to test the test cases. Since it would be utillized by both task and user, this file created.


const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

//This is to generate a random ID for our demo data of Mohan. We need it to generate JWT tokens
const userOneId = new mongoose.Types.ObjectId()

const userOne = {
    _id: userOneId,
    name: 'Mohan',
    email: 'mohan@sample.com',
    password: 'Mohan@123',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_TOKEN)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()

const userTwo = {
    _id: userTwoId,
    name: 'Suyash',
    email: 'suyash@sample.com',
    password: 'Suyash@123',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_TOKEN)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    task: 'Learning Programs in Java',
    completed: false,
    owner: userOneId
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    task: 'Learning Cooking Recepies',
    category: 'Food/Cooking',
    completed: true,
    owner: userOneId
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    task: 'Learn Angular',
    completed: false,
    owner: userTwoId
}



const setupDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userOneId,
    userOne,
    userTwo,
    userTwoId,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
}
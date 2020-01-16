//This is basically setup of demo or test data so that our test suites have a database and data 
//to test the test cases. Since it would be utillized by both task and user, this file created.


const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')

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

const setupDatabase = async () => {
    await User.deleteMany()
    await new User(userOne).save()
}

module.exports = {
    userOneId,
    userOne,
    setupDatabase
}
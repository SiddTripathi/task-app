const request = require('supertest')
const Task = require('../src/models/task')
const app = require('../src/app')

const { userOneId, userOne, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase) //--> defined in db.js file as this method is common method used by both task and user test suites.

test("Should create task for user", async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            task: 'From my test'
        })
        .expect(201)

})
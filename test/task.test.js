const request = require('supertest')
const Task = require('../src/models/task')
const app = require('../src/app')

const { userOneId, userOne, userTwo, userTwoId, taskOne, taskThree, taskTwo, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase) //--> defined in db.js file as this method is common method used by both task and user test suites.

test("Should create task for user", async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            task: 'From my test'
        })
        .expect(201)
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toBe(false)
})

test('Should Fetch All Tasks of User', async (done) => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    done()


    expect(response.body).toHaveLength(2)
})

test('Should not delete other user Tasks', async (done) => {
    const response = await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(400)
    done()
    const task = Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})


test('Should delete user tasks', async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)


})

test('Should not delete if Unauthenticated', async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .send()
        .expect(401)
})

test('Should not create tasks with Invalid description', async (done) => {
    await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            task: "Hii"
        })
        .expect(400)
    done()
})

test('Should not update tasks with Invalid description', async (done) => {
    await request(app)
        .post(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            task: "Hii"
        })
        .expect(404)
    done()
})

test('Should not update other users task', async (done) => {
    await request(app)
        .post(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send({
            task: "Updating this task"
        })
        .expect(404)
    done()
})
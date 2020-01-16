const request = require('supertest')

const { userOneId, userOne, setupDatabase } = require('./fixtures/db')

//requiring app file as we needed our express application without port start function. That is why we created a seperate file
//without port containing all the other necessary imports and functions. We then deleted those imports from index.js .
const app = require('../src/app')
const User = require('../src/models/user')

beforeEach(setupDatabase)


//this test will fail when it will re run as the test database would already contain a record of Jaya. So we created before Each
test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Jaya',
        email: 'siddhart.tripathi@gmail.com',
        password: 'Jaya@1234'
    }).expect(201)

    //assert of test that the database was actually changed
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //assertion about response body
    expect(response.body.user.name).toBe('Jaya')

    //assertion for entire response body/Object--> use toMatchObject
    expect(response.body).toMatchObject({
        user: {
            name: 'Jaya',
            email: 'siddhart.tripathi@gmail.com'
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('Jaya@1234')
})



test('Should login', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
    const user = await User.findById(userOneId)
    expect(user).not.toBeNull()

    expect(response.body.token).toBe(user.tokens[1].token)
})

test('login Should fail', async () => {
    await request(app).post('/users/login').send({
        email: 'sandeep@sample.com',
        password: 'sandeep@123'
    }).expect(400)
})


test('Should get profile', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`) //This set method is used to set the authorization in our test request.Otherwise it will give error
        .send()
        .expect(200)
})

test('Should not get Unauthorized', async () => {
    await request(app).get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user', async () => {
    await request(app).delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()

})

test('Should not delete account for unauth user', async () => {
    await request(app).delete('/users/me')

        .send()
        .expect(401)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'test/fixtures/profile-pic.jpg')
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer)) //toBe will no work here because to compare objects, toBe is not effective
})

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Ritu'
        })
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.name).toEqual('Ritu')

})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Kanpur'
        })
        .expect(400)


})
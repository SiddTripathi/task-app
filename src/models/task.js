
const mongoose = require('mongoose')
const validate = require('validator')

const taskSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value.length < 4) {
                throw new Error('Task is not well described')
            }
        }
    },
    completed: {
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        trim: true,
        default: 'Software Learning',

    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,   //owner field is created to add id of user so that both collections can be linked
        //and tasks belong to a particular user based on its id. 
        required: true,
        ref: 'User' //this ref means reference to the User model. This line is added so that User and task models can be 
        // connected together. Since this is an actual field in document, we dont have to provide local and foreign fields like we did in virtual
    }
}, {
    timestamps: true
})

const Tasks = mongoose.model('Task', taskSchema)

module.exports = Tasks
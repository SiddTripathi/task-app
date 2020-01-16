module.exports = {
    setApiKey() {

    },
    send() {

    }
}


//this file is created inside __mocks__ folder in tests so that the services which are activated due to our test cases may not get triggered
//when we are testing. For example, emails. We want emails to be sent during actual user creation and not testing, so we added @sendgrid mail module
//inside mocks folder . 
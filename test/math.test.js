const { calculateTip, fahrenheitToCelsius, celsiusToFahrenheit, addition } = require('../src/math')


test("Should Calculate the tip", () => {
    const total = calculateTip(10, .3)
    expect(total).toBe(13)
})

test("Should calculate total with default tip", () => {
    const total = calculateTip(10)
    expect(total).toBe(12.5) //.toBe is function used alongwith expect for writing test cases. Read docs for more info
})

test("Convert fahrentheit to celsius", () => {
    const tempCelcius = fahrenheitToCelsius(50)
    expect(tempCelcius).toBe(10)
})

test("Converts celsius to fahrenheit", () => {
    const tempFahrenheit = celsiusToFahrenheit(10)
    expect(tempFahrenheit).toBe(50)
})


//this is a sample of test case for asyc function. However, notice that when 'done' is not passed as an argument
//this test case will pass even though assertion 2=1 is wrong. This is because JEST will not wait for 2 second timeout
//unless it is told to using (done)
test("Async Test Case", (done) => {
    setTimeout(() => {
        expect(1).toBe(1)
        done()
    }, 2000)
})

//this is one of the way for promises function 
test('Should add two numbers', (done) => {

    addition(4, 5).then((sum) => {
        expect(sum).toBe(9)
        done()
    })

})

//more easy and simpler way using async-await function for test cases

test("Add two numbers async", async () => {
    const sum = await addition(5, 5)
    expect(sum).toBe(10)
})
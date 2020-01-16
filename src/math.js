//just a sample temporary file for JEST test cases.

const calculateTip = (total, tipPercent = .25) => {
    const tip = total * tipPercent
    return total + tip
}

const fahrenheitToCelsius = (temp) => {
    return (temp - 32) / 1.8
}

const celsiusToFahrenheit = (temp) => {
    return (temp * 1.8) + 32
}

const addition = (a, b) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (a < 0 || b < 0) {
                return reject("Numbers which are negative cannot be added")
            }
            resolve(a + b)

        }, 2000)
    })
}


module.exports = {
    calculateTip,
    fahrenheitToCelsius,
    celsiusToFahrenheit,
    addition
}
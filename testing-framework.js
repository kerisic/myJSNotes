function describe(title, body) {
    console.log(title);
    body();
}

function it(title, body) {
    console.log(title);
    body();
}

function expect(actual) {
    return {
        toEqual: (expected) => {
            if (actual === expected) {
                console.log(".")
            } else {
                console.log(`FAIL: expected ${actual} to equal ${expected}`)
            }
        }
    }
}
const { java } = require('compile-run');
console.log(__dirname + '/bruh.java')
try {

    let resultPromise = java.runFile(__dirname + '\\bruh.java', {});
    resultPromise
        .then(result => {
            console.log(result);//result object
        })
        .catch(err => {
            console.log("yooooooooo-'-'-'-'-'-'-'-'-'-'-'-'-'-'")
            console.log(err);
        });
} catch (someError) {
    console.log("yooooooooo-'-'-'-'-'-'-'-'-'-'-'-'-'-'")
    console.log(someError)
}
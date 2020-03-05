const fs = require('fs');
const superagent = require('superagent');

// promisify everything
// this entire thing promisifies the file read, instead of a callback
// create new file, pass it the filename
const readFilePromise = filename => {
    // it returns (saves) a promise, resolve is successful, reject it logs to console
    return new Promise((resolve, reject) => {
        fs.readFile(filename, (err, data) => {
            if (err) reject('I could not find that file');
            resolve(data);
        });
    });
};

const writeFilePromise = (filename, data) => {
    return new Promise((resolve, reject) => {
        // writefile is a little different, readFile takes filename, writefile takes filename and data to be written
        fs.writeFile(filename, data, err => {
            if (err) reject('I could not write that file');
            resolve('Success');
        });
    });
};

// IIFE, we define our function in parentheses, empty args here, and parens at end to call it right away. IIFE is a good init fn
// also because our IIFE is async, we include that as well
(async () => {
    console.log('init');
    try {
        console.log('1: Will get dog pics!');
        console.log('3: All done getting the dog pics!');
    } catch (err) {
        console.log('ERROR');
    }
})();

// ASYNC/AWAIT
// mark this as async before arguments
// async means a function that runs in the background while executing the code contained within it
// need to know that within an async function, you can have one or more await statements
// a objective of async await is to make our code look more synchronous, while being async behind the scenes
// the function below cleans up the Promisify chain below A LOT!!!
// for error handling, wrap everything in try/catch
const getDogPic = async () => {
    try {
        const data = await readFilePromise(`${__dirname}/dog.txt`);
        console.log(`Breed: ${data}`);
        const res = await superagent.get(
            `https://dog.ceo/api/breed/${data}/images/random`
        );
        console.log(res.body.message);
        await writeFilePromise(`${__dirname}/dog-img.txt`, res.body.message);
        console.log('Image of random dog written to file!');
    } catch (err) {
        console.log(err);
        throw err; // basically throws entire promise into reject
    }
    return console.log('2: READY!!!');
};

/*
console.log('1: Will get dog pics!');
// here, instead of simply calling the fn and moving on to next line, because async is a promise already, we can use the then method on it
// promises always return a future value, which we can use, in this case its x
getDogPic()
    .then(abc => {
        // console.log(abc);
        console.log('3: All done getting the dog pics!');
    })
    // catch is what happens when the promise called returns an error, or we throw it above
    .catch(err => {
        console.log('ERROR');
    });
    */

/*
// best way, 3rd way
//chaining promises together, you have each of them return a new promise
// THATS THE TRICK, having each promise return a new promise
// basiclly, readFilepro returns a promise, use then on it to again return a promise in the get request
// when that returns a promise, we use then to write file

readFilePromise(`${__dirname}/dog.txt`)
    .then(data => {
        console.log(`Breed: ${data}`);
        return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
    })
    .then(res => {
        console.log(res.body.message);
        return writeFilePromise(`${__dirname}/dog-img.txt`, res.body.message)
    })
    .then(() => {
        //     console.log('Image of random dog written to file!');
    })
    .catch(err => {
        console.log(err);
    });
*/

// 1st way, regular http get request with callback for async writefile (worst)
// fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
//     console.log(`Breed: ${data}`);

//     // http Get request
//     superagent.get(`https://dog.ceo/api/breed/${data}/images/random`).end((err, res) => {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log(res.body.message);
//             // save returned image string to text file
//             fs.writeFile(`${__dirname}/dog-img.txt`, res.body.message, err => {
//                 console.log('Image of random dog written to file!');
//             });
//         }
//     });
// });

// 2nd, better way, a promise that still has callback to async writefile
// fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
//     console.log(`Breed: ${data}`);
//     // promise, get/then. 2 parts: pending promise, resolved promise (res). Resolved promise is binary, fulfilled or rejected
//     // promise is get-then/catch. then is promise fulfulled, catch is promise rejected
//     superagent
//         .get(`https://dog.ceo/api/breed/${data}/images/random`)
//         .then(res => {
//             console.log(res.body.message);
//             fs.writeFile(`${__dirname}/dog-img.txt`, res.body.message, err => {
//                 console.log('Image of random dog written to file!');
//             });
//         })
//         .catch(err => {
//             console.log(err);
//         });
// });

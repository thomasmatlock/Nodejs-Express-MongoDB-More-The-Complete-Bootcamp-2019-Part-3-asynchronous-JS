const fs = require('fs');
const superagent = require('superagent');

fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
    console.log(`Breed: ${data}`);
    // http Get request
    superagent.get(`https://dog.ceo/api/breed/${data}/images/random`).end((err, res) => {
        if (err) {
            console.log(err);
        } else {
            console.log(res.body.message);
            fs.writeFile(`${__dirname}/dog-img.txt`, res.body.message, err => {
                console.log('Image of random dog written to file!');
            });
        }
    });
    // save returned image string to text file
});

const fs = require('fs');
const superagent = require('superagent');

fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
    console.log(`Breed: ${data}`);
    superagent.get(`https://dog.ceo/api/${data}/image/random`).end((err, res) => {
        console.log(res.body);
    }); // http Get request
});

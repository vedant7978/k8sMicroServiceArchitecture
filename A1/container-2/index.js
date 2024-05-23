const express = require("express");
const path = require("path");
const csvParser = require("csv-parser");
const fs = require("fs");
const dotenv = require("dotenv");

const app = express();

app.use(express.json());
dotenv.config();

const PORT = Number(process.env.PORT) || 2000;
const FILE_DIRECTORY = process.env.FILE_DIRECTORY || "../";

app.post("/parser", (req, res) => {

    const { file, product } = req.body;
    const results = [];

    const isValidCSV = async (filePath) => {
        const expectedColumns = ['product', 'amount'];
        try {
            return new Promise((resolve, reject) => {
                let isValid = true;
                fs.createReadStream(filePath)
                    .pipe(csvParser())
                    .on('data', (data) => {
                        if (!isValid) return;
                        const keys = Object.keys(data);
                        if (keys.length !== expectedColumns.length || keys.some(key => !expectedColumns.includes(key))) {
                            isValid = false;
                        }
                        results.push(data)
                    })
                    .on('end', () => resolve(isValid))
                    .on('error', (err) => reject(err));
            });
        } catch (err) {
            return false;
        }
    };

    (async () => {
        const filePath = path.join(FILE_DIRECTORY, file);
        console.log("******************");
        try {
            const isValid = await isValidCSV(filePath);
            if (isValid) {
                console.log('The file is a valid CSV.');
                let sum = 0;
                for (let i = 0; i < results.length; i++){
                    if (results[i].product === product) {
                        sum += Number(results[i].amount);
                    }
                }
                res.status(200).send({ 
                    file,
                    sum
                });
            } else {
                console.log('The file is not a valid CSV.');
                res.send({ 
                    file,
                    error:"Input file not in CSV format."
                });
            }
        } catch (err) {
            console.error('Error checking CSV format:', err);
            res.status(500).send({ error: 'Error checking CSV format.' });
        }
    })();

});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...!`);
})
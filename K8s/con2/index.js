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

console.log({ FILE_DIRECTORY })
console.log({ PORT })
console.log("cicd testing_2.............")


app.post("/parser", (req, res) => {

    const { file, product } = req.body;
    const results = [];

    const isValidCSV = (filePath) => {
        return new Promise((resolve, reject) => {
            try {
                let isValid = true;
                fs.createReadStream(filePath)
                    .pipe(csvParser({
                        mapHeaders: ({ header }) => header.trim()
                    }))
                    .on('data', (data) => {
                        if (!isValid) return;
                        if (Object.keys(data).length === 0) {
                            isValid = false;
                        }
                        results.push(data)
                    })
                    .on('end', () => resolve(isValid))
                    .on('error', (err) => reject(err));
            } catch (err) {
                return false;
            }
        });
    };

    (async () => {
        const filePath = path.join(FILE_DIRECTORY, file);
        const fileExtension = path.extname(file).toLowerCase();

        try {
            const isValid = await isValidCSV(filePath);
            let sum = 0;
            for (let i = 0; i < results.length; i++) {
                if (results[i].product === product) {
                    sum += Number(results[i].amount);
                }
            }

            if (fileExtension === '.yml' && sum == 0) {
                console.log('The file is not a CSV.');
                return res.send({
                    file,
                    error: "Input file not in CSV format."
                });
            }
            console.log("2:", isValid)
            if (isValid) {
                console.log('The file is a valid CSV.');
                res.status(200).send({
                    file,
                    sum
                });
            } else {
                console.log('The file is not a valid CSV.');
                res.send({
                    file,
                    error: "Input file not in CSV format."
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
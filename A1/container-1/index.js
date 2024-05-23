const express = require('express');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const dotenv = require('dotenv');

const app = express();

app.use(express.json());
dotenv.config();

const PORT = Number(process.env.PORT) || 6000;
const CONTAINER_2_ENDPOINT = process.env.CONTAINER_2_ENDPOINT || "http://localhost:2000/parser";
const FILE_DIRECTORY = process.env.FILE_DIRECTORY || "../";

const parseFile = async (file, product) => {
try{
    const response = await axios.post(CONTAINER_2_ENDPOINT, {
            file,
            product
        });
        return response.data;
}
    catch (err) {
        console.log("Error:", err);
        throw err;
    }

}

app.post("/calculate", async (req, res) => {
    
    const { file, product } = req.body;
    
    if (!file) {
        return res.status(400).send({
            file: null,
            error: "Invalid JSON input."
        })
    } else if (!(fs.existsSync(path.join(FILE_DIRECTORY,file)))) {
        return res.status(404).send({
            file,
            error: "File not found."
        })
    } else {
        try {
            const data = await parseFile(file, product);
            res.send(data);
        } catch (err) {
            res.status(500).send({ error: 'Error parsing file.' });
        }
    }


});

app.listen(PORT, () => (
    console.log(`Listening at port number ${PORT}...!`)
));
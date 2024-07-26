const crypto = require("crypto");
// import crypto from "crypto";
const axios = require("axios");
// import axios from "axios";

exports.handler = async (event) => {
  
  try{
      const url = "http://129.173.67.234:8080/serverless/end"
  const {value} = event;
  
  const result = crypto.createHash("sha256").update(value,'utf8').digest('hex');
  
  const data = {
    "banner":"B00984592",
    result,
    "arn":"arn:aws:lambda:us-east-1:161533161476:function:SHA-256-lambda",
    "action":"sha256",
    value
  }
  
  console.log({data});
  
   await axios.post(url, data)
            .then(response => console.log(response.data))
            .catch(error => console.error(error));
    return {
     body: data
    };
  }catch(error){
     console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
  }
  
  
};
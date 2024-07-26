import bcrypt from 'bcryptjs';
import axios from 'axios';

// Define the handler as an async function
export const handler = async (event) => {
  try {
    const url = "http://129.173.67.234:8080/serverless/end";
    const { value } = event;

    console.log(event);

    const result = await bcrypt.hash(value, 12);

    const data = {
      banner: "B00984592",
      result,
      arn: "arn:aws:lambda:us-east-1:161533161476:function:Bcrypt-lambda",
      action: "bcrypt",
      value
    };

    console.log({ data });

    await axios.post(url, data)
      .then(response => console.log(response.data))
      .catch(error => console.error(error));
  
  return {
     body: data
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

const express = require("express");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const mysql = require("mysql2/promise");
const pool = require('./db');

dotenv.config();
const app = express();

app.use(express.json());


const PORT = Number(process.env.PORT) || 8080;
const DB_NAME ="cloudass2";
const DB_HOST = "database-1.c1xnj8i7pnpu.us-east-1.rds.amazonaws.com";
const DB_USER = "vedant";
const DB_PASS = "Life-123";

const checkDatabaseConnection = async () => {
    try {
        const connection = await mysql.createConnection({
            host: DB_HOST || 'localhost',
            user: DB_USER || 'root',
            password: DB_PASS || 'password',
            database: DB_NAME,
            port: 3306,
        });
        await connection.query('SELECT 1');
        console.log('Database connection successful.');
        await connection.end();
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
};

const createDatabase = async () => {
    try {
       
        // Connect to MySQL server
        const connection = await mysql.createConnection({
            host: DB_HOST || 'localhost',
            user: DB_USER || 'root',
            password: DB_PASS || 'password',
            port: 3306,
        });
        console.log("After connection string");
        
        // Create database if it doesn't exist
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
        console.log(`${DB_NAME} created or already exists.`);
        
        // Connect to the created database
        await connection.changeUser({ database: DB_NAME });
        
        // Check if the table exists
        const [rows] = await connection.query("SHOW TABLES LIKE 'product'");
        
        // Create the table if it does not exist
        if (rows.length === 0) {
            await connection.query(`
                CREATE TABLE product (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    price VARCHAR(255) NOT NULL,
                    availability BOOLEAN NOT NULL
                )
            `);
            console.log("Product table created.");
        } else {
            console.log("Product table already exists.");
        }
        
        await connection.end();
    } catch (error) {
        console.log("Error creating a database: ", error)
        process.exit(1);
    }
}


const clearTable = async () => {
    try {
        const connection = await mysql.createConnection({
            host: DB_HOST || 'localhost',
            user: DB_USER || 'root',
            password: DB_PASS || 'password',
            database: DB_NAME,
            port: 3306,
        });
        await connection.query('DELETE FROM product');
        console.log('Product table cleared.');
        await connection.end();
    } catch (error) {
        console.error('Error clearing the product table:', error);
        throw error;
    }
};

app.get("/", (req, res) => {
    res.status(200).send("Hello")
})

// app.get('/list-products', async (req, res) => {
//     try {
//         const products = await prisma.product.findMany();

//         const results = products.map((prod) => {
//             return {
//                 name: prod.name,
//                 price: prod.price,
//                 availability: prod.availability
//             }
//         })

//         console.log("Results: ",results)

//         res.status(200).json({
//             products: results
//         });
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// });

app.get('/list-products', async (req, res) => {
    try {

        const [products] = await pool.query('SELECT name, price, availability FROM product');

        const results = products.map((prod) => ({
            name: prod.name,
            price: prod.price,
            availability: prod.availability,
        }));

        console.log("Results: ", results);

        res.status(200).json({ products: results });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).send(error.message);
    }
});


app.post('/store-products', async (req, res) => {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ message: 'Invalid input data!' });
    }

    const isValidProducts = products.every(product =>
        typeof product.name === 'string' &&
        typeof product.price === 'string' &&
        typeof product.availability === 'boolean'
    );

    if (!isValidProducts) {
        return res.status(400).json({ error: 'Each product must contain name, price, and availability in proper format' });
    }

    try {
        await clearTable(); 
        const addProductQueries = products.map(product => {
            const { name, price, availability } = product;
            return pool.query('INSERT INTO product (name, price, availability) VALUES (?, ?, ?)', [name, price, availability ? 1 : 0]);
        });
        await Promise.all(addProductQueries);
        res.status(200).json({ message: 'Success.' });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).send(error.message);
    }
});

createDatabase().then(() => {
checkDatabaseConnection().then(() => {
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}...!`)
    })
})
})



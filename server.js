const express = require('express');
const fs = require('fs');
const cors = require('cors'); // Import CORS
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Enable CORS for all requests
app.use(express.json()); // Middleware for JSON parsing
app.use(express.static(path.join(__dirname, 'frontEnd'))); // Serve static files

const productsFile = path.join(__dirname, 'products.json');

// Route to Get Products
app.get('/products', (req, res) => {
    fs.readFile(productsFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading products file:', err);
            return res.status(500).json({ error: 'Error reading products file.' });
        }
        res.json(JSON.parse(data));
    });
});

// Route to Add a Product
app.post('/products', (req, res) => {
    const newProduct = req.body;

    fs.readFile(productsFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading products file:', err);
            return res.status(500).json({ error: 'Error reading products file.' });
        }

        const products = JSON.parse(data);
        products.push(newProduct);

        fs.writeFile(productsFile, JSON.stringify(products, null, 2), (err) => {
            if (err) {
                console.error('Error writing products file:', err);
                return res.status(500).json({ error: 'Error writing products file.' });
            }
            res.json({ message: 'Product added successfully!', product: newProduct });
        });
    });
});

// Route to Remove a Product
app.delete('/products', (req, res) => {
    const { name } = req.body;

    fs.readFile(productsFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading products file:', err);
            return res.status(500).json({ error: 'Error reading products file.' });
        }

        const products = JSON.parse(data);
        const updatedProducts = products.filter(product => product.name.toLowerCase() !== name.toLowerCase());

        if (updatedProducts.length === products.length) {
            return res.status(404).json({ error: 'Product not found.' });
        }

        fs.writeFile(productsFile, JSON.stringify(updatedProducts, null, 2), (err) => {
            if (err) {
                console.error('Error writing products file:', err);
                return res.status(500).json({ error: 'Error writing products file.' });
            }
            res.json({ message: 'Product removed successfully!' });
        });
    });
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

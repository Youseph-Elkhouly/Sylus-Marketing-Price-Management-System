const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json({ limit: '10mb' })); // Set payload size limit
app.use(cors()); // Enable CORS
app.use(express.static('frontEnd')); // Serve static files (frontend)

// Path to the JSON file
const productsFile = './products.json';

// Get Products
app.get('/products', (req, res) => {
    fs.readFile(productsFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading products file:', err);
            return res.status(500).send('Error reading products file.');
        }
        try {
            const products = JSON.parse(data);
            res.json(products);
        } catch (parseError) {
            console.error('Error parsing JSON file:', parseError);
            res.status(500).send('Error parsing products file.');
        }
    });
});

// Add Product
app.post('/products', (req, res) => {
    console.log('Incoming request body:', req.body); // Debugging
    const newProduct = req.body;

    // Validate product
    if (!newProduct || !newProduct.name || !newProduct.type || !newProduct.image) {
        console.error('Invalid product data received:', newProduct);
        return res.status(400).send('Invalid product data.');
    }

    fs.readFile(productsFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading products file:', err);
            return res.status(500).send('Error reading products file.');
        }

        let products;
        try {
            products = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing products file:', parseError);
            return res.status(500).send('Error parsing products file.');
        }

        products.push(newProduct);

        fs.writeFile(productsFile, JSON.stringify(products, null, 2), (err) => {
            if (err) {
                console.error('Error writing to products file:', err);
                return res.status(500).send('Error writing to products file.');
            }
            console.log('Product added successfully:', newProduct);
            res.json({ message: 'Product added successfully!', product: newProduct });
        });
    });
});

// Remove Product
app.delete('/products', (req, res) => {
    const { name } = req.body;

    if (!name) {
        console.error('Product name is required to delete.');
        return res.status(400).send('Product name is required.');
    }

    fs.readFile(productsFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading products file:', err);
            return res.status(500).send('Error reading products file.');
        }

        let products;
        try {
            products = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing products file:', parseError);
            return res.status(500).send('Error parsing products file.');
        }

        const updatedProducts = products.filter(
            (product) => product.name.toLowerCase() !== name.toLowerCase()
        );

        if (updatedProducts.length === products.length) {
            console.error('Product not found:', name);
            return res.status(404).send('Product not found.');
        }

        fs.writeFile(productsFile, JSON.stringify(updatedProducts, null, 2), (err) => {
            if (err) {
                console.error('Error writing to products file:', err);
                return res.status(500).send('Error writing to products file.');
            }
            console.log('Product removed successfully:', name);
            res.json({ message: 'Product removed successfully!' });
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

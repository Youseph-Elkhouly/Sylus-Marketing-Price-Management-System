const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// MockAPI Base URL
const MOCKAPI_URL = 'https://6766388a410f84999657187d.mockapi.io/apikey/products';

// Middleware
app.use(express.json());

// Get all products
app.get('/products', async (req, res) => {
    try {
        const response = await axios.get(MOCKAPI_URL);
        res.json(response.data);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).send('Error retrieving products');
    }
});

// Add a new product
app.post('/products', async (req, res) => {
    try {
        const newProduct = req.body;
        const response = await axios.post(MOCKAPI_URL, newProduct);
        res.json({ message: 'Product added successfully!', product: response.data });
    } catch (err) {
        console.error('Error adding product:', err);
        res.status(500).send('Error adding product');
    }
});

// Remove a product
app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await axios.delete(`${MOCKAPI_URL}/${id}`);
        res.json({ message: 'Product removed successfully!' });
    } catch (err) {
        console.error('Error removing product:', err);
        res.status(500).send('Error removing product');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

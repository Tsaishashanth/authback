const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/user');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// const cartRoutes = require('./routes/cart');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
 
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/products', productRoutes);
// app.use('/api/cart', cartRoutes );

//starting the server
app.get('/', (req, res) => {
  res.send('Server is running!');
});

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Auth API',
      version: '1.0.0',
      description: 'API for signup, login, and auth',
    },
  },
  apis: ['./routes.js'], // change this if your routes are in another file
};

const specs = swaggerJsdoc(options);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs));



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {console.log(`🚀 Server running at http://localhost:${PORT}`)}); 
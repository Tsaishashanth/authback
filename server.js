const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/user');
// const express = require('express');
// const swaggerapp = express();
const app = express();
const { swaggerUi, swaggerSpec } = require('./swagger');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Your other routes and middleware



// const cartRoutes = require('./routes/cart');

dotenv.config();
// const app = express();
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {console.log(`🚀 Server running at http://localhost:${PORT}`)}); 
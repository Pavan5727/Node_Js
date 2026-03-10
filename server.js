const express = require('express');
const dotenv = require('dotenv');
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const connectDB = require('./config/db');
const cors = require('cors');

dotenv.config();
connectDB();
const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true
}));
// Swagger UI
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/otp', require('./Routes/Otproutes'));
// Routes
app.use('/api/users', require('./Routes/Userroutes'));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger Docs: http://localhost:${PORT}/api-docs`);
});
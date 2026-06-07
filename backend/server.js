const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    console.log(`\n[WCHODZI ZAPYTANIE]: ${req.method} ${req.url}`);
    console.log(`[CZY EXPRESS WIDZI BODY?]:`, req.body);
    next(); // To puszcza żądanie dalej!
});
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

app.listen(process.env.PORT, () => {

})
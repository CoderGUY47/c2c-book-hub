import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/dbConnect';
dotenv.config();

const app = express();
app.use(async (req, res, next) => {
  try {
    await connectDb();
    next();
  } catch(e) {
    console.error("DB connection error in middleware", e);
    res.status(500).json({ error: "DB Error" });
  }
});

app.get('/test', (req, res) => {
  res.json({ message: "Hello" });
})

app.listen(9999, () => console.log("Started test server on 9999"));

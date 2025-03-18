import express from 'express';
import { connectToDatabase } from './config/db';
import userRoutes from './routes/user.routes';

const app = express();
const port = 4000;

app.use(express.json());
app.use(userRoutes);

app.get("/",(req,res)=>{
    res.send("API is Working")
})
async function startServer() {
  await connectToDatabase();
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import userRouter from './routers/user.router';
import photoRouter from './routers/photo.router';
import decoratorRouter from './routers/decorator.router';
import companyRouter from './routers/company.router';
import ownerRouter from './routers/owner.router';

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mastabasta');
const conn = mongoose.connection;
conn.once('open', () => {
    console.log('DB ok');
});

const router = express.Router();
router.use('/users', userRouter);
router.use('/photos', photoRouter);
router.use('/decorators', decoratorRouter);
router.use('/companies', companyRouter);
router.use('/owners', ownerRouter);

app.use('/', router);
app.listen(4000, () => console.log(`Express server running on port 4000`));

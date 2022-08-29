import express from 'express';
import { signin, signup, getUsers } from '../controllers/User-controller.js';

const userroute = express.Router();

userroute.get('/', getUsers);

userroute.post('/signin', signin);
userroute.post('/signup', signup);

export default userroute;
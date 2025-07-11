import { comparar } from '../common/bcrypt.js';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import config from '../config/env.js';

async function login(req, res, next) { 
    console.log('Login attempt: ');
    console.log(req.body);
    try {
        const {username,password} = req.body;
        const user = await User.findOne({ where: { username } });

        if (!user) {
            return res.status(403).json({ message: 'User not found' });
        }

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const isMatch = await comparar(password, user.password)
        if (!isMatch) {
            return res.status(403).json({ message: 'User not found' });
        }

        const token = jwt.sign({ userId: user.id },config.JWT_SECRET,{
            expiresIn: eval(config.JWT_EXPIRES_SECONDS)});
        res.json({token})
    } catch (error) {
        next(error);
    }    
}

export default {
  login,
};
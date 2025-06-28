import express from 'express';

const app = express();

import usersRoutes from './routes/users.routes.js';
import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/task.routes.js';
import morgan from 'morgan';
import errorHandler from './middlewares/errorhandler.js';
import notFound from './middlewares/notfound.js';
import { authenticateToken } from './middlewares/authenticated.js';

//Middlewares
app.use(morgan('dev'));
app.use(express.json());

//Routes
app.use('/api/tasks',authenticateToken, taskRoutes)
//app.use('/api/tasks', taskRoutes)
app.use('/api/login', authRoutes)
app.use('/api/users', usersRoutes);

app.use(notFound)
app.use(errorHandler)

export default app;

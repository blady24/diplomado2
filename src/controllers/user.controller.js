import {User} from "../models/user.js";
import {Task} from "../models/task.js";
import logger from "../logs/logger.js"
import { Status } from "../constants/index.js";
import { encriptar } from "../common/bcrypt.js";
import { Op } from "sequelize";

async function getUsers(req, res) {
    try {
        const users = await User.findAll({
            attributes: ["id", "username","password", "status"],
            order : [["id", "ASC"]],
            where: {
                status: Status.ACTIVE
            },
        });
        res.json(users);
    } catch (error) {
        next(error);
    }    
}

async function getUsersList(req, res) {
    console.log('entro al controlador de getUsersList');
    const { page, limit, search, orderBy, orderDir } = req.query;
    const allowedLimits = [5, 10, 15, 20];
    const allowedOrderBy = ['id', 'username', 'status'];
    const allowedOrderDir = ['ASC', 'DESC'];

    const limitNum = parseInt(limit) || 10;
    const pageNum = parseInt(page) || 1;

    // Validar el límite
    if (!allowedLimits.includes(limitNum)) {
        return res.status(400).json({
            message: `El valor de 'limit' debe ser uno de los siguientes: ${allowedLimits.join(', ')}.`
        });
    }

    // Validar orderBy
    if (orderBy && !allowedOrderBy.includes(orderBy)) {
        return res.status(400).json({
            message: `El valor de 'orderBy' debe ser uno de los siguientes: ${allowedOrderBy.join(', ')}.`
        });
    }

    // Validar orderDir
    if (orderDir && !allowedOrderDir.includes(orderDir.toUpperCase())) {
        return res.status(400).json({
            message: `El valor de 'orderDir' debe ser uno de los siguientes: ${allowedOrderDir.join(', ')}.`
        });
    }

    // Validar page
    if (isNaN(pageNum) || pageNum < 1 || !Number.isInteger(pageNum)) {
        return res.status(400).json({
            message: "El valor de 'page' debe ser un número entero positivo."
        });
    }

    const offset = (pageNum - 1) * limitNum;

    try {
        const where = {};

        if (search && search.trim() !== '') {
            where.username = { [Op.like]: `%${search}%` };
        }

        const users = await User.findAndCountAll({
            attributes: ['id', 'username', 'status'],
            where: where,
            offset: offset,
            limit: limitNum,
            order: [[orderBy || 'username', (orderDir || 'ASC').toUpperCase()]],
        });

        res.json({
            total: users.count,
            page: pageNum,
            limit: limitNum,
            data: users.rows,
            
        });
        console.log("lista retornada: " + users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }    
}


async function createUser(req, res) {
    console.log('entro al controlador');
    console.log(req.body);
    logger.info('Creating a new user');
    try {
        const { username, password } = req.body;
        const user = await User.create({ username, password });
        res.json(user);
    } catch (error) {
        next(error);
    }
}
async function gestUser(req, res, next) {
    try {
        const { id } = req.params;
        const user = await User.findOne({
            where: { id },
            attributes: [ "username","password", "status"],
            where: {
                id
            },
        })
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        next(error);
    }
}

async function updateUser(req, res, next) {
    console.log('entro al controlador de update');
    console.log('body' + req.body);
    console.log(req.body);

    try {
        const { id } = req.params;
        const { username, password } = req.body;

        console.log('ID:', id);
        console.log('Username:', username);
        console.log('Password:', password);


        if (!username && !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }    
        
        const passwordEncriptado = await encriptar(password);

        const user = await User.update(
            { 
                username, 
                password : passwordEncriptado 
            },
            { where: { id } }
        );
        res.json(user);
    } catch (error) {
        next(error);
    }
}

async function deleteUser(req, res, next) {
    try {
        const { id } = req.params;
        await User.destroy({ where: { id } });
        res.status(204).json({ message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
}

async function activateInactiveUser(req, res, next) {
    try {
        const { id } = req.params;
        const status = req.body.status;
        console.log('Status:', status);
        console.log('ID:', id);

        /*
        if (status !== Status.ACTIVE && status !== Status.INACTIVE) {
            return res.status(400).json({ message: `Status must be either ${Status.ACTIVE} or ${Status.INACTIVE}` });
        }
            */

        if(!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.status === status) {
            return res.status(409).json({ message: 'Same status as before' });
        }

        user.status = status;
        await user.save();

        res.json(user);
    } catch (error) {
        next(error);
    }
}

async function getTasks(req, res, next) {
    const {id} = req.params;
    try {
        const user = await User.findOne({
            attributes: ['username'],
            include: [{
                model: Task,
                attributes: ['name', 'done'],
                where: {
                    done: false
                }
            }],
            where: {
                id
            },
        })
        res.json(user);
    } catch (error) {
        
    }
}

export default {
    getUsers,
    createUser,
    gestUser,
    updateUser,
    deleteUser,
    activateInactiveUser,
    getTasks,
    getUsersList
};
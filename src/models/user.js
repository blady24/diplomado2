import { DataTypes } from "sequelize";
import {sequelize} from "../database/database.js";
import { Status } from "../constants/index.js";
import {Task} from "../models/task.js";
import { encriptar } from "../common/bcrypt.js";
import logger from "../logs/logger.js";

export const User = sequelize.define(
    "users",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            validate : {                
                notNull: {
                    msg: "Username is required"
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate : {
                notNull: {
                    msg: "Password is required"
                }
            }
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: Status.ACTIVE,
            validate : {
                isIn:{
                    args: [[Status.ACTIVE, Status.INACTIVE]],
                    msg: `Status must be either ${Status.ACTIVE} or ${Status.INACTIVE}`
                }
            }
        }
    }
);
User.hasMany(Task);
Task.belongsTo(User); 

User.beforeCreate(async (user) => {
    try {
       user.password = await encriptar(user.password);
    } catch (error) {
       logger.error('Error al encriptar la contraseña del usuario anstes de crear el usuario:', error);
       next(error);
    }
});
/*
User.beforeUpdate(async (user) => {
    try {
       user.password = await encriptar(user.password);
    } catch (error) {
       logger.error('Error al encriptar la contraseña del usuario anstes de crear el usuario:', error);
       next(error);
    }
});
*/
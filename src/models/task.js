import { DataTypes } from "sequelize";
import {sequelize} from "../database/database.js";


export const Task = sequelize.define(
    "tasks",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            /*validate : {
                notnull: {
                    msg: "Name is required"
                }
            }*/
        },
        done: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            /*validate : {
                notnull: {
                    msg: "Done is required"
                }
            }*/
        },

    }
);
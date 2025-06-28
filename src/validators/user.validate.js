import joi from 'joi';

export const userRegisterSchema = joi.object({
    username: joi.string().min(3).max(30).required().alphanum(),
    password: joi.string().min(6).max(20).required(),
});

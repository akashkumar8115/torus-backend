
const Joi = require('joi');

exports.validateRegistration = (data) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    });

    return schema.validate(data);
};

exports.validateLogin = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });

    return schema.validate(data);
};

exports.validateTask = (data) => {
    const schema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        dueDate: Joi.date().required(),
        status: Joi.string().valid('To Do', 'In Progress', 'Completed'),
        assignedUser: Joi.string(),
        priority: Joi.string().valid('Low', 'Medium', 'High'),
    });

    return schema.validate(data);
};

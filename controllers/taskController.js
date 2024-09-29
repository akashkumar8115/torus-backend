
const Task = require('../models/Task');
const { validateTask } = require('../utils/validation');

exports.createTask = async (req, res) => {
    try {
        const { error } = validateTask(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const task = new Task({
            ...req.body,
            createdBy: req.user._id,
        });

        const savedTask = await task.save();
        res.status(201).json(savedTask);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const pageSize = 10;
        const page = Number(req.query.page) || 1;

        const keyword = req.query.keyword
            ? {
                title: {
                    $regex: req.query.keyword,
                    $options: 'i',
                },
            }
            : {};

        const count = await Task.countDocuments({ ...keyword });
        const tasks = await Task.find({ ...keyword })
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ createdAt: -1 });

        res.json({ tasks, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (task) {
            res.json(task);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const { error } = validateTask(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const task = await Task.findById(req.params.id);

        if (task) {
            task.title = req.body.title || task.title;
            task.description = req.body.description || task.description;
            task.dueDate = req.body.dueDate || task.dueDate;
            task.status = req.body.status || task.status;
            task.assignedUser = req.body.assignedUser || task.assignedUser;
            task.priority = req.body.priority || task.priority;

            const updatedTask = await task.save();
            res.json(updatedTask);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (task) {
            await task.remove();
            res.json({ message: 'Task removed' });
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getTaskSummary = async (req, res) => {
    try {
        const { status, user, startDate, endDate } = req.query;

        let query = {};

        if (status) query.status = status;
        if (user) query.assignedUser = user;
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        const summary = await Task.aggregate([
            { $match: query },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]);

        res.json(summary);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};


const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
    getTaskSummary,
} = require('../controllers/taskController');

router.route('/').post(protect, createTask).get(protect, getTasks);
router.route('/summary').get(protect, getTaskSummary);
router
    .route('/:id')
    .get(protect, getTaskById)
    .put(protect, updateTask)
    .delete(protect, deleteTask);

module.exports = router;

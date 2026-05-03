const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTask } = require('../controllers/taskController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .post(protect, admin, createTask)
  .get(protect, getTasks);

router.route('/:id')
  .patch(protect, updateTask);

module.exports = router;

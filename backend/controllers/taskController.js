const Task = require('../models/Task');
const Project = require('../models/Project');

const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, project, assignee } = req.body;

    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority: priority || 'Medium',
      project,
      assignee,
      createdBy: req.user.id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const { projectId, status } = req.query;
    let query = {};

    if (projectId) query.project = projectId;
    if (status) query.status = status;

    // Restrict members to view only their assigned tasks
    if (req.user.role !== 'Admin') {
      query.assignee = req.user.id;
    }

    const tasks = await Task.find(query)
      .populate('project', 'name')
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email')
      .sort({ dueDate: 1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { status, title, description, priority, assignee, dueDate } = req.body;
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Members can only update status of their assigned tasks.
    if (req.user.role === 'Member') {
      if (task.assignee?.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to update this task' });
      }
      if (status) task.status = status;
    } else {
      if (status) task.status = status;
      if (title) task.title = title;
      if (description) task.description = description;
      if (priority) task.priority = priority;
      if (assignee) task.assignee = assignee;
      if (dueDate) task.dueDate = dueDate;
    }

    await task.save();
    
    // Populate before returning
    task = await Task.findById(req.params.id)
      .populate('project', 'name')
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email');

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createTask, getTasks, updateTask };

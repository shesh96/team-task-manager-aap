const Project = require('../models/Project');

const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = await Project.create({
      name,
      description,
      owner: req.user.id,
      members: [req.user.id],
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ members: req.user.id })
      .populate('owner', 'name email')
      .populate('members', 'name email');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('members', 'name email');
      
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Check if user is a member
    if (!project.members.some(member => member._id.toString() === req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to view this project' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addMemberToProject = async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Only owner/admin can add members
    if (project.owner.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to add members' });
    }

    if (!project.members.includes(userId)) {
      project.members.push(userId);
      await project.save();
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeMemberFromProject = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Only owner/admin can remove members
    if (project.owner.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to remove members' });
    }

    project.members = project.members.filter(member => member.toString() !== userId);
    await project.save();

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createProject, getProjects, getProjectById, addMemberToProject, removeMemberFromProject };

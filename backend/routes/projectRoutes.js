const express = require('express');
const router = express.Router();
const { createProject, getProjects, getProjectById, addMemberToProject, removeMemberFromProject } = require('../controllers/projectController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .post(protect, admin, createProject)
  .get(protect, getProjects);

router.route('/:id')
  .get(protect, getProjectById);

router.route('/:id/members')
  .post(protect, admin, addMemberToProject);

router.route('/:id/members/:userId')
  .delete(protect, admin, removeMemberFromProject);

module.exports = router;

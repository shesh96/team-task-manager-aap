import React, { useEffect, useState, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import { Plus, Users } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const { user } = useContext(AuthContext);
  const [showCreate, setShowCreate] = useState(false);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchProjects();
    if (user?.role === 'Admin') fetchUsers();
  }, [user]);

  const fetchProjects = async () => {
    const { data } = await API.get('/projects');
    setProjects(data);
  };

  const fetchUsers = async () => {
    const { data } = await API.get('/auth/users');
    setUsers(data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await API.post('/projects', { name, description });
      setName('');
      setDescription('');
      setShowCreate(false);
      fetchProjects();
    } catch (err) {
      alert('Error creating project');
    }
  };

  const addMember = async (projectId, userId) => {
    try {
      await API.post(`/projects/${projectId}/members`, { userId });
      fetchProjects();
    } catch (err) {
      alert('Error adding member');
    }
  };

  const removeMember = async (projectId, userId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;
    try {
      await API.delete(`/projects/${projectId}/members/${userId}`);
      fetchProjects();
    } catch (err) {
      alert('Error removing member');
    }
  };

  return (
    <div className="container animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', marginBottom: '2rem' }}>
        <h1>Projects</h1>
        {user?.role === 'Admin' && (
          <button className="btn btn-primary" onClick={() => setShowCreate(!showCreate)}>
            <Plus size={18} /> New Project
          </button>
        )}
      </div>

      {showCreate && (
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3>Create New Project</h3>
          <form onSubmit={handleCreate} style={{ marginTop: '1.5rem' }}>
            <div className="input-group">
              <label>Project Name</label>
              <input type="text" required className="input" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="input-group">
              <label>Description</label>
              <textarea className="textarea" value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary">Create</button>
          </form>
        </div>
      )}

      <div className="grid-3">
        {projects.map(project => (
          <div key={project._id} className="glass-card">
            <h3>{project.name}</h3>
            <p style={{ marginTop: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>{project.description}</p>
            
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Users size={16} /> Members ({project.members?.length || 0})
              </div>
              {project.members?.map(m => (
                <div key={m._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.25rem 0', paddingLeft: '1.5rem' }}>
                  <span>{m.name}</span>
                  {user?.role === 'Admin' && (
                    <button 
                      onClick={() => removeMember(project._id, m._id)}
                      style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.75rem' }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            {user?.role === 'Admin' && users.length > 0 && (
              <div style={{ marginTop: '1rem', borderTop: '1px solid var(--surface-border)', paddingTop: '1rem' }}>
                <select className="select" style={{ padding: '0.5rem', fontSize: '0.85rem' }} 
                        onChange={(e) => { if(e.target.value) addMember(project._id, e.target.value); e.target.value=''; }}>
                  <option value="">+ Add Member</option>
                  {users.filter(u => !project.members?.find(m => m._id === u._id)).map(u => (
                    <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        ))}
        {projects.length === 0 && <p>No projects found.</p>}
      </div>
    </div>
  );
};

export default Projects;

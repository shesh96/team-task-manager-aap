import React, { useEffect, useState, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const { user } = useContext(AuthContext);
  const [showCreate, setShowCreate] = useState(false);
  
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', priority: 'Medium', project: '', assignee: '' });

  useEffect(() => {
    fetchTasks();
    if (user?.role === 'Admin') {
      fetchProjects();
      fetchUsers();
    }
  }, [user]);

  const fetchTasks = async () => {
    const { data } = await API.get('/tasks');
    setTasks(data);
  };

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
      await API.post('/tasks', newTask);
      setNewTask({ title: '', description: '', dueDate: '', priority: 'Medium', project: '', assignee: '' });
      setShowCreate(false);
      fetchTasks();
    } catch (err) {
      alert('Error creating task');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/tasks/${id}`, { status });
      fetchTasks();
    } catch (err) {
      alert('Error updating status');
    }
  };

  return (
    <div className="container animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', marginBottom: '2rem' }}>
        <h1>Tasks</h1>
        {user?.role === 'Admin' && (
          <button className="btn btn-primary" onClick={() => setShowCreate(!showCreate)}>
            <Plus size={18} /> New Task
          </button>
        )}
      </div>

      {showCreate && (
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <h3>Create New Task</h3>
          <form onSubmit={handleCreate} style={{ marginTop: '1.5rem' }}>
            <div className="grid-2">
              <div className="input-group">
                <label>Task Title</label>
                <input type="text" required className="input" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Due Date</label>
                <input type="date" required className="input" value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Project</label>
                <select required className="select" value={newTask.project} onChange={e => setNewTask({...newTask, project: e.target.value})}>
                  <option value="">Select Project</option>
                  {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label>Assignee (Optional)</label>
                <select className="select" value={newTask.assignee} onChange={e => setNewTask({...newTask, assignee: e.target.value})}>
                  <option value="">Unassigned</option>
                  {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label>Priority</label>
                <select className="select" value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
            <div className="input-group">
              <label>Description</label>
              <textarea className="textarea" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} />
            </div>
            <button type="submit" className="btn btn-primary">Create Task</button>
          </form>
        </div>
      )}

      <div className="grid-3">
        {['To Do', 'In Progress', 'Done'].map(statusGroup => (
          <div key={statusGroup} className="glass-panel" style={{ padding: '1rem', background: 'rgba(15, 23, 42, 0.4)' }}>
            <h3 style={{ marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--surface-border)' }}>
              {statusGroup}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {tasks.filter(t => t.status === statusGroup).map(task => (
                <div key={task._id} className="glass-card" style={{ padding: '1rem', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={{ marginBottom: '0.5rem', paddingRight: '1rem' }}>{task.title}</h4>
                    <span style={{ 
                      fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold',
                      background: task.priority === 'High' ? 'rgba(239, 68, 68, 0.2)' : task.priority === 'Medium' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                      color: task.priority === 'High' ? 'var(--danger)' : task.priority === 'Medium' ? 'var(--warning)' : 'var(--success)'
                    }}>
                      {task.priority}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', marginBottom: '1rem' }}>{task.project?.name}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}</p>
                  {task.assignee && <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Assignee: {task.assignee.name}</p>}
                  
                  <div style={{ marginTop: '1rem' }}>
                    <select className="select" style={{ padding: '0.25rem', fontSize: '0.8rem' }} 
                            value={task.status} onChange={e => updateStatus(task._id, e.target.value)}>
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;

import React, { useEffect, useState, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import { isPast, format } from 'date-fns';
import { AlertCircle, Clock, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await API.get('/tasks');
        setTasks(data);
      } catch (err) {
        console.error('Failed to fetch tasks');
      }
    };
    fetchTasks();
  }, []);

  const pendingTasks = tasks.filter(t => t.status === 'To Do');
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress');
  const completedTasks = tasks.filter(t => t.status === 'Done');
  const overdueTasks = tasks.filter(t => t.status !== 'Done' && isPast(new Date(t.dueDate)));

  const tasksPerUser = {};
  tasks.forEach(task => {
    const name = task.assignee ? task.assignee.name : 'Unassigned';
    tasksPerUser[name] = (tasksPerUser[name] || 0) + 1;
  });

  return (
    <div className="container animate-fade-in">
      <h1 style={{ marginTop: '2rem' }}>{user?.role === 'Admin' ? 'Team Dashboard Overview' : 'My Personal Dashboard'}</h1>
      <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
        {user?.role === 'Admin' 
          ? 'As an Admin, you can see the progress of all tasks across the entire team.' 
          : 'As a Member, you can only see the progress of tasks assigned directly to you.'}
      </p>
      
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <div className="glass-card" style={{ borderLeft: '4px solid var(--text-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: 'var(--text-secondary)' }}>Total Tasks</h3>
          </div>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '1rem' }}>{tasks.length}</p>
        </div>
        <div className="glass-card" style={{ borderLeft: '4px solid var(--warning)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: 'var(--text-secondary)' }}>To Do</h3>
            <Clock size={24} color="var(--warning)" />
          </div>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '1rem' }}>{pendingTasks.length}</p>
        </div>
        <div className="glass-card" style={{ borderLeft: '4px solid #818cf8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: 'var(--text-secondary)' }}>In Progress</h3>
            <Clock size={24} color="#818cf8" />
          </div>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '1rem' }}>{inProgressTasks.length}</p>
        </div>
        <div className="glass-card" style={{ borderLeft: '4px solid var(--success)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: 'var(--text-secondary)' }}>Done</h3>
            <CheckCircle size={24} color="var(--success)" />
          </div>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '1rem' }}>{completedTasks.length}</p>
        </div>
      </div>

      <div className="grid-2">
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <AlertCircle color="var(--danger)" /> Overdue Tasks ({overdueTasks.length})
          </h2>
          {overdueTasks.length === 0 ? (
            <p>No overdue tasks. Great job!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {overdueTasks.map(task => (
                <div key={task._id} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: '8px' }}>
                  <h4 style={{ color: 'white' }}>{task.title}</h4>
                  <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Due: <span style={{ color: 'var(--danger)' }}>{format(new Date(task.dueDate), 'MMM dd, yyyy')}</span></p>
                </div>
              ))}
            </div>
          )}
        </div>

        {user?.role === 'Admin' && (
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Tasks per User</h2>
            {Object.entries(tasksPerUser).map(([name, count]) => (
              <div key={name} style={{ padding: '1rem 0', borderBottom: '1px solid var(--surface-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '500' }}>{name}</span>
                <span style={{ background: 'var(--surface-light)', padding: '4px 12px', borderRadius: '12px', fontSize: '0.9rem' }}>
                  {count} {count === 1 ? 'Task' : 'Tasks'}
                </span>
              </div>
            ))}
            {Object.keys(tasksPerUser).length === 0 && <p>No tasks assigned yet.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

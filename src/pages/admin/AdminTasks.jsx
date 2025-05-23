import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getTasks } from '../../../api/tasks';
import TaskItem from '../../components/tasks/TaskItem';
import TaskForm from '../../components/tasks/TaskForm';

const AdminTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await getTasks();
        setTasks(response.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleTaskCreated = (newTask) => {
    setTasks(prev => [...prev, newTask]);
    setShowForm(false);
  };

  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Task Management</h1>
        {user.is_staff && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : 'Create New Task'}
          </button>
        )}
      </div>

      {showForm && <TaskForm onTaskCreated={handleTaskCreated} />}

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <p>No tasks found</p>
        ) : (
          tasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))
        )}
      </div>
    </div>
  );
};

export default AdminTasks;
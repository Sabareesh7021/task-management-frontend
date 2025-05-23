import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateTask } from '../../api/tasks';
import TaskReport from './TaskReport';

const TaskItem = ({ task }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    status: task.status,
    completion_report: task.completion_report || '',
    worked_hours: task.worked_hours || 0
  });
  const [showReport, setShowReport] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTask(task.id, formData);
      setIsEditing(false);
      window.location.reload(); // Refresh to show updated data
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const canEdit = user.role === 'user' || user.is_staff || user.is_superuser;
  const canViewReport = (user.is_staff || user.is_superuser) && task.status === 'completed';

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg">{task.title}</h3>
          <p className="text-gray-600">{task.description}</p>
          <p className="text-sm text-gray-500">
            Due: {new Date(task.due_date).toLocaleDateString()}
          </p>
          <p className={`text-sm font-medium ${
            task.status === 'completed' ? 'text-green-600' : 
            task.status === 'in_progress' ? 'text-blue-600' : 'text-yellow-600'
          }`}>
            Status: {task.status.replace('_', ' ')}
          </p>
        </div>
        
        {canEdit && (
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        )}
      </div>

      {isEditing && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {formData.status === 'completed' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Completion Report
                </label>
                <textarea
                  name="completion_report"
                  value={formData.completion_report}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Worked Hours
                </label>
                <input
                  type="number"
                  name="worked_hours"
                  value={formData.worked_hours}
                  onChange={handleChange}
                  min="0"
                  step="0.5"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Changes
          </button>
        </form>
      )}

      {canViewReport && task.status === 'completed' && (
        <div className="mt-3">
          <button
            onClick={() => setShowReport(!showReport)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {showReport ? 'Hide Report' : 'View Completion Report'}
          </button>
          {showReport && <TaskReport taskId={task.id} />}
        </div>
      )}
    </div>
  );
};

export default TaskItem;
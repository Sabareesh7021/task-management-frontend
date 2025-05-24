import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Pagination from '../common/Pagination';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {formatDate} from '../../Components/common/helper';
import { TaskApiHook } from '../../Hooks/taskHooks'; 

const TaskList = ({
  tasks,
  isLoading,
  error,
  currentPage,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
  userId,
  userRole, // Add userRole prop
}) => {
    const { mutate: startTask, isLoading: isStarting } = TaskApiHook.useStartTask();
    const queryClient = useQueryClient();
  if (isLoading) return <div className="text-center py-8">Loading tasks...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error loading tasks: {error.message}</div>;

  const formatStatus = (status) => {
    if (!status) return 'Unknown';
    return status.toString().replace(/_/g, ' ');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paused':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  console.log('TaskList rendered with tasks:', tasks);
  const handleStartTask = (taskId) => {
    startTask({id:taskId}, {
      onSuccess: () => {
        toast.success('Task started successfully!');
        queryClient.invalidateQueries(['get-tasks']);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to start task.');
      },
    });
  };

  const hasActiveTask = tasks?.some(
    task => task.assigned_to?.id === userId && task.status === 'in_progress'
  );

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned To
              </th>
              {(onEdit || onDelete || userRole === 'user') && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks?.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    to={`/tasks/${task.id}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {task.title}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(task.status)}`}
                  >
                    {formatStatus(task.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatDate(task.due_date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {task.assigned_to?.username || 'Unassigned'}
                </td>
                {(onEdit || onDelete || userRole === 'user') && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {userRole === 'user' ? (
                      <>
                        {task.status === 'pending' && (
                          <button
                            onClick={() => handleStartTask(task.id)}
                            disabled={hasActiveTask || isStarting}
                            className={`px-3 py-1 rounded-md text-white ${
                              hasActiveTask || isStarting
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700'
                            }`}
                          >
                            {isStarting ? 'Starting...' : 'Start'}
                          </button>
                        )}
                        {task.status === 'in_progress' && String(task.assigned_to?.id) === String(userId) && (
                          <button
                            onClick={() => onEdit(task)}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            Edit
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        {onEdit && (
                          <button
                            onClick={() => onEdit(task)}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            Edit
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(task.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        )}
                      </>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

TaskList.propTypes = {
  tasks: PropTypes.array,
  isLoading: PropTypes.bool,
  error: PropTypes.object,
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  onPageChange: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  userId: PropTypes.string,
  userRole: PropTypes.string, // Add userRole prop type
};

export default TaskList;
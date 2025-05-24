import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import TaskList from '../Components/task/TaskList';
import TaskForm from '../Components/task/TaskCreateForm';
import Modal from '../components/common/Modal';
import { TaskApiHook } from '../Hooks/taskHooks';
import { UserApiHook } from '../Hooks/userHooks';

const TasksView = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [assignedToFilter, setAssignedToFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // User dropdown states
  const [userPage, setUserPage] = useState(1);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);
  
  const queryClient = useQueryClient();
  const userRole = localStorage.getItem('role');
  const userId = localStorage.getItem('user_id');
  const isAdmin = ['admin', 'super_admin'].includes(userRole);
  
  // Fetch tasks based on user role
  const { data: taskDetails, isLoading, error } = TaskApiHook.useGetTasks(
    pageSize, 
    currentPage,
    statusFilter !== 'all' ? statusFilter : undefined,
    assignedToFilter !== 'all' ? assignedToFilter : undefined,
    searchQuery || undefined
  );

  // Fetch a single task by ID if not in the list
  const { data: singleTask } = TaskApiHook.useGetTaskById(taskId, {
    enabled: !!taskId && !taskDetails?.data?.find(t => t.id === parseInt(taskId)),
  });

  // Fetch users with pagination and search
  const { data: usersData, isLoading: isUsersLoading, isFetching: isUsersFetching } = UserApiHook.useGetUsers(
    pageSize,
    userPage,
    userSearchQuery || undefined
  );

  // Update users list when new data arrives
  useEffect(() => {
    if (usersData?.data) {
      if (userPage === 1 || userSearchQuery) {
        // Reset list for new search or first page
        setAllUsers(usersData.data);
      } else {
        // Append new users for pagination
        setAllUsers(prev => {
          const existingIds = new Set(prev.map(user => user.id));
          const newUsers = usersData.data.filter(user => !existingIds.has(user.id));
          return [...prev, ...newUsers];
        });
      }
      
      // Check if there are more users to load
      setHasMoreUsers(
        usersData.current_page < usersData.total_pages
      );
    }
  }, [usersData, userPage, userSearchQuery]);

  // Reset user pagination when search changes
  useEffect(() => {
    setUserPage(1);
    setAllUsers([]);
  }, [userSearchQuery]);

  useEffect(() => {
    if (taskId) {
      const taskToEdit = taskDetails?.data?.find(t => t.id === parseInt(taskId)) || singleTask;
      if (taskToEdit) {
        setSelectedTask(taskToEdit);
        setIsModalOpen(true);
      }
    }
  }, [taskId, taskDetails, singleTask]);

  const updateTaskMutation = TaskApiHook.useUpdateTask();
  const addTaskMutation = TaskApiHook.useCreateTask();
  const deleteTaskMutation = TaskApiHook.useDeleteTask();

  const handleEdit = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleDelete = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTaskMutation.mutate(
        { id: taskId},
        {
          onSuccess: () => {
            toast.success('Task deleted successfully!');
            handleModalClose();
            queryClient.invalidateQueries(['get-tasks']);
          },
          onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to deleted task.');
          },
        }
      );
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
    setUserPage(1);
    setUserSearchQuery('');
    setAllUsers([]);
    setIsUserDropdownOpen(false);
  };

  const handleSubmit = (formData) => {
    if (selectedTask) {
      updateTaskMutation.mutate(
        { id: selectedTask.id, taskData: formData },
        {
          onSuccess: () => {
            toast.success('Task updated successfully!');
            handleModalClose();
            queryClient.invalidateQueries(['get-tasks']);
          },
          onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update task.');
          },
        }
      );
    } else {
      addTaskMutation.mutate(
        {taskData: formData},
        {
          onSuccess: () => {
            toast.success('Task created successfully!');
            handleModalClose();
            queryClient.invalidateQueries(['get-tasks']);
          },
          onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to create task.');
          },
        }
      );
    }
  };

  const handleResetFilters = () => {
    setStatusFilter('all');
    setAssignedToFilter('all');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleUserSearch = (searchTerm) => {
    setUserSearchQuery(searchTerm);
  };

  const handleLoadMoreUsers = () => {
    if (hasMoreUsers && !isUsersFetching) {
      setUserPage(prev => prev + 1);
    }
  };

  const handleUserFilterChange = (userId) => {
    setAssignedToFilter(userId);
    setCurrentPage(1);
    setIsUserDropdownOpen(false);
  };

  const getSelectedUserName = () => {
    if (assignedToFilter === 'all') return 'All Users';
    const selectedUser = allUsers.find(user => user.id.toString() === assignedToFilter);
    return selectedUser ? `${selectedUser.first_name} ${selectedUser.last_name}` : 'Select User';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Task Management</h1>
        {isAdmin && (
          <button
            onClick={() => {
                setSelectedTask(null);
                setIsModalOpen(true);
              }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Create New Task
          </button>
        )}
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Status Filter */}
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          {/* Assigned To Filter - Custom Dropdown */}
          {isAdmin &&(
          <div className="relative">
            <label htmlFor="assigned-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Assigned To
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-left bg-white flex justify-between items-center"
              >
                <span className="truncate">{getSelectedUserName()}</span>
                <svg
                  className={`w-4 h-4 transform transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isUserDropdownOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-64 overflow-hidden">
                  {/* Search Input */}
                  <div className="p-2 border-b border-gray-200">
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={userSearchQuery}
                      onChange={(e) => handleUserSearch(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  {/* Options List */}
                  <div className="max-h-48 overflow-y-auto">
                    <div
                      onClick={() => handleUserFilterChange('all')}
                      className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                        assignedToFilter === 'all' ? 'bg-blue-50 text-blue-600' : ''
                      }`}
                    >
                      All Users
                    </div>

                    {allUsers.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => handleUserFilterChange(user.id.toString())}
                        className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                          assignedToFilter === user.id.toString() ? 'bg-blue-50 text-blue-600' : ''
                        }`}
                      >
                        {user.first_name} {user.last_name}
                      </div>
                    ))}

                    {/* Load More Button */}
                    {hasMoreUsers && (
                      <div className="p-2 border-t border-gray-200">
                        <button
                          onClick={handleLoadMoreUsers}
                          disabled={isUsersFetching}
                          className="w-full p-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md disabled:opacity-50"
                        >
                          {isUsersFetching ? 'Loading...' : 'Load More'}
                        </button>
                      </div>
                    )}

                    {/* No Results */}
                    {allUsers.length === 0 && !isUsersLoading && (
                      <div className="px-3 py-2 text-gray-500 text-sm">
                        No users found
                      </div>
                    )}

                    {/* Loading State */}
                    {isUsersLoading && (
                      <div className="px-3 py-2 text-gray-500 text-sm">
                        Loading users...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          )}
          {/* Search Filter */}
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Tasks
            </label>
            <div className="flex">
              <input
                type="text"
                id="search"
                placeholder="Search by title or description..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full p-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleResetFilters}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-r-md border border-l-0 border-gray-300"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      <TaskList
        tasks={taskDetails?.data}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        error={error}
        currentPage={currentPage}
        totalPages={taskDetails?.pagination?.total_pages || 1}
        onPageChange={setCurrentPage}
        onEdit={handleEdit}
        onDelete={userRole === 'super_admin' ? handleDelete : null}
        userId={userId}
        userRole={userRole}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={selectedTask ? 'Edit Task' : 'Create Task'}
        size="lg"
      >
        <TaskForm
          onSubmit={handleSubmit}
          userRole={userRole}
          isLoading={selectedTask ? updateTaskMutation.isLoading : addTaskMutation.isLoading}
          initialData={selectedTask || {
            title: '',
            description: '',
            assigned_to_id: '',
            due_date: '',
            status: 'pending',
            completion_report: '',
            worked_hours: 0,
          }}
          isEditMode={!!selectedTask}
          canAssign={isAdmin}
          onCancel={handleModalClose}
          users={{ 
            data: allUsers, 
            isLoading: isUsersLoading, 
            isFetching: isUsersFetching,
            hasMore: hasMoreUsers,
            onLoadMore: handleLoadMoreUsers,
            onSearch: handleUserSearch,
            searchQuery: userSearchQuery
          }}
        />
      </Modal>

      {/* Click outside handler for dropdown */}
      {isUserDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default TasksView;
import { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';
import { UserApiHook } from '../../Hooks/userHooks';
import { toast } from 'react-toastify';

const TaskForm = ({
  onSubmit,
  isLoading,
  initialData,
  isEditMode,
  canAssign,
  onCancel,
  userRole,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [userPage, setUserPage] = useState(1);
  const [userSearch, setUserSearch] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);
  const [isDropdownInitialized, setIsDropdownInitialized] = useState(false);
  const dropdownRef = useRef(null);
  const pageSize = 10;

  // Determine if this is a regular user editing
  const isRegularUserEditing = userRole === 'user';

  // Determine if assignment can be changed (only when creating or status is pending)
  const canChangeAssignment = !isEditMode || formData.status === 'pending';

  // Only fetch users when dropdown is actively shown AND we need data
  const shouldFetchUsers = showUserDropdown && (!isDropdownInitialized || userSearch || userPage > 1);
  
  const { data: users, isLoading: isUsersLoading, isFetching } = UserApiHook.useGetUsers(
    pageSize,
    userPage,
    userSearch,
    'user',
    { enabled: shouldFetchUsers }
  );

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  // Handle users data and pagination
  useEffect(() => {
    if (users?.data && showUserDropdown) {
      if (userPage === 1) {
        setAllUsers(users.data);
        setIsDropdownInitialized(true);
      } else {
        setAllUsers(prev => [...prev, ...users.data]);
      }
      
      const totalPages = users.pagination?.total_pages || 1;
      setHasMoreUsers(userPage < totalPages);
    }
  }, [users, userPage, showUserDropdown]);

  // Reset pagination when search changes
  useEffect(() => {
    if (userSearch !== '' && showUserDropdown) {
      setUserPage(1);
      setAllUsers([]);
      setHasMoreUsers(true);
      setIsDropdownInitialized(false);
    }
  }, [userSearch, showUserDropdown]);

  // Reset when dropdown closes
  const closeDropdown = useCallback(() => {
    setShowUserDropdown(false);
    setUserPage(1);
    setAllUsers([]);
    setHasMoreUsers(true);
    setIsDropdownInitialized(false);
    setUserSearch('');
  }, []);

  // Infinite scroll handler
  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight + 10) {
      if (hasMoreUsers && !isFetching && showUserDropdown) {
        setUserPage(prev => prev + 1);
      }
    }
  }, [hasMoreUsers, isFetching, showUserDropdown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'worked_hours') {
      const decimalRegex = /^\d*\.?\d{0,2}$/;
      if (value === '' || decimalRegex.test(value)) {
        setFormData({
          ...formData,
          [name]: value
        });
      }
      return;
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUserSearchChange = (e) => {
    setUserSearch(e.target.value);
  };

  const handleUserSelect = (user) => {
    setFormData(prev => ({
      ...prev,
      assigned_to: user
    }));
    closeDropdown();
  };

  const clearSelectedUser = () => {
    setFormData(prev => ({
      ...prev,
      assigned_to: null
    }));
  };

  const openUserDropdown = () => {
    if (!canChangeAssignment || isRegularUserEditing) return;
    setShowUserDropdown(true);
    setUserPage(1);
    setAllUsers([]);
    setHasMoreUsers(true);
    setIsDropdownInitialized(false);
  };

  const isFieldDisabled = (fieldName) => {
    if (!isEditMode) return false;
    if (userRole !== 'user') return false;
    const editableFields = ['status', 'worked_hours', 'completion_report'];
    return !editableFields.includes(fieldName);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate required fields for all users
    if (formData.status === 'completed') {
      if (!formData.completion_report) {
        newErrors.completion_report = 'Completion report is required';
      }
      if (!formData.worked_hours || formData.worked_hours <= 0) {
        newErrors.worked_hours = 'Valid worked hours are required';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const submitData = isRegularUserEditing
  ? {
      id: formData.id,
      status: formData.status,
      worked_hours: parseFloat(formData.worked_hours).toFixed(2), 
      completion_report: formData.completion_report
    }
  : {
      ...formData,
      assigned_to_id: formData.assigned_to?.id,
      worked_hours: parseFloat(formData.worked_hours).toFixed(2)
    };
    onSubmit(submitData);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    if (showUserDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showUserDropdown, closeDropdown]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title - Readonly for regular users */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title {!isRegularUserEditing && '*'}
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            disabled={isFieldDisabled('title')}
            className={`block w-full rounded-lg border px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              errors.title 
                ? 'border-red-300 bg-red-50 focus:ring-red-500' 
                : isFieldDisabled('title')
                  ? 'bg-gray-100 border-gray-200'
                  : 'border-gray-300 focus:border-indigo-500'
            }`}
            placeholder="Enter task title"
          />
          {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title}</p>}
        </div>

        {/* Due Date - Readonly for regular users */}
        <div>
          <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-2">
            Due Date {!isRegularUserEditing && '*'}
          </label>
          <input
            type="date"
            id="due_date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            disabled={isFieldDisabled('due_date')}
            className={`block w-full rounded-lg border px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              errors.due_date 
                ? 'border-red-300 bg-red-50 focus:ring-red-500' 
                : isFieldDisabled('due_date')
                  ? 'bg-gray-100 border-gray-200'
                  : 'border-gray-300 focus:border-indigo-500'
            }`}
          />
          {errors.due_date && <p className="mt-2 text-sm text-red-600">{errors.due_date}</p>}
        </div>
      </div>

      {/* Description - Readonly for regular users */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description {!isRegularUserEditing && '*'}
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          disabled={isFieldDisabled('description')}
          className={`block w-full rounded-lg border px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none ${
            errors.description 
              ? 'border-red-300 bg-red-50 focus:ring-red-500' 
              : isFieldDisabled('description')
                ? 'bg-gray-100 border-gray-200'
                : 'border-gray-300 focus:border-indigo-500'
          }`}
          placeholder="Describe the task in detail"
        />
        {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status - Editable for all */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {isRegularUserEditing ? (
              <>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </>
            ) : (
              <>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="paused">Paused</option>
              </>
            )}
          </select>
        </div>

        {/* Assign To - Readonly for regular users */}
        {canAssign && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign To {!isRegularUserEditing && '*'}
            </label>
            {canChangeAssignment && !isRegularUserEditing ? (
              <div className="relative" ref={dropdownRef}>
                {formData.assigned_to && (
                  <div className="mb-3 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                          {formData.assigned_to.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{formData.assigned_to.username}</div>
                          <div className="text-sm text-gray-600">{formData.assigned_to.email}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={clearSelectedUser}
                        className="text-gray-400 hover:text-gray-600 p-1"
                        title="Clear selection"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={userSearch}
                    onChange={handleUserSearchChange}
                    onFocus={openUserDropdown}
                    className="block w-full rounded-lg border border-gray-300 px-4 py-3 pr-10 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={openUserDropdown}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showUserDropdown ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                    </svg>
                  </button>
                </div>

                {showUserDropdown && (
                  <div className="absolute z-20 mt-2 w-full bg-white shadow-xl rounded-lg border border-gray-200 max-h-64 overflow-hidden">
                    <div className="max-h-56 overflow-y-auto" onScroll={handleScroll}>
                      {!isDropdownInitialized && isUsersLoading ? (
                        <div className="p-8 text-center">
                          <div className="inline-flex items-center text-sm text-gray-500">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Loading users...
                          </div>
                        </div>
                      ) : allUsers.length > 0 ? (
                        <>
                          <ul className="divide-y divide-gray-100">
                            {allUsers.map((user) => (
                              <li 
                                key={user.id} 
                                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                                  formData.assigned_to?.id === user.id ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''
                                }`}
                                onClick={() => handleUserSelect(user)}
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white font-medium text-xs">
                                    {user.username.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-900 truncate">{user.username}</div>
                                    <div className="text-sm text-gray-500 truncate">{user.email}</div>
                                  </div>
                                  {formData.assigned_to?.id === user.id && (
                                    <div className="text-indigo-500">
                                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    </div>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                          
                          {isFetching && hasMoreUsers && (
                            <div className="p-4 text-center border-t border-gray-100">
                              <div className="inline-flex items-center text-sm text-gray-500">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Loading more users...
                              </div>
                            </div>
                          )}
                          
                          {!hasMoreUsers && allUsers.length >= 10 && (
                            <div className="p-3 text-center border-t border-gray-100 bg-gray-50">
                              <div className="text-xs text-gray-400">
                                • • • End of list • • •
                              </div>
                            </div>
                          )}
                        </>
                      ) : isDropdownInitialized && !isUsersLoading && userSearch ? (
                        <div className="p-8 text-center text-gray-500">
                          <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <div className="font-medium text-gray-600">No users found</div>
                          <div className="text-sm">Try searching with different keywords</div>
                        </div>
                      ) : isDropdownInitialized && !isUsersLoading && allUsers.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                          <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <div className="font-medium text-gray-600">No users available</div>
                          <div className="text-sm">No users found in the system</div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {formData.assigned_to?.username?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {formData.assigned_to?.username || 'Unassigned'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formData.assigned_to?.email || 'No email'}
                    </div>
                  </div>
                </div>
                {isRegularUserEditing && (
                  <p className="text-xs text-gray-500 mt-3 bg-yellow-50 p-2 rounded border-l-2 border-yellow-400">
                    Only admins can change assignment
                  </p>
                )}
              </div>
            )}
            {errors.assigned_to_id && (
              <p className="mt-2 text-sm text-red-600">{errors.assigned_to_id}</p>
            )}
          </div>
        )}
      </div>

      {/* Completion Report and Worked Hours - Always editable */}
      {isEditMode && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="completion_report" className="block text-sm font-medium text-gray-700 mb-2">
              Completion Report {formData.status === 'completed' && '*'}
            </label>
            <textarea
              id="completion_report"
              name="completion_report"
              rows={4}
              value={formData.completion_report || ''}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              placeholder="Add completion notes..."
            />
            {errors.completion_report && <p className="mt-2 text-sm text-red-600">{errors.completion_report}</p>}
          </div>

          <div>
            <label htmlFor="worked_hours" className="block text-sm font-medium text-gray-700 mb-2">
              Worked Hours {formData.status === 'completed' && '*'}
            </label>
            <input
              type="number"
              id="worked_hours"
              name="worked_hours"
              min="0"
              step="0.5"
              value={formData.worked_hours || 0}
              onBlur={(e) => {
                if (e.target.value) {
                  const value = parseFloat(e.target.value).toFixed(2);
                  setFormData({
                    ...formData,
                    worked_hours: value
                  });
                }
              }}
              onChange={handleChange}
              className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="0.0"
            />
            {errors.worked_hours && <p className="mt-2 text-sm text-red-600">{errors.worked_hours}</p>}
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : isEditMode ? (
            'Update Task'
          ) : (
            'Create Task'
          )}
        </button>
      </div>
    </form>
  );
};

TaskForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  initialData: PropTypes.object.isRequired,
  isEditMode: PropTypes.bool,
  canAssign: PropTypes.bool,
  onCancel: PropTypes.func.isRequired,
  userRole: PropTypes.string,
};

export default TaskForm;
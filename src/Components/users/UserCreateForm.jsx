import { useState } from 'react';

const UserForm = ({ 
  onSubmit, 
  isLoading, 
  initialData, 
  isEditMode, 
  canSetAdmin,
  onCancel 
}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!isEditMode && !formData.password) newErrors.password = 'Password is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    console.log('Form submitted with data:', formData)
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-md`}
        />
        {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      
      {!isEditMode && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
          <input
            type="password"
            name="password"
            required={!isEditMode}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            placeholder={isEditMode ? "Leave blank to keep current password" : "Enter password"}
          />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
        </div>
      )}
      
      {canSetAdmin && (
        <div className="flex items-center">
          <input
            type="checkbox"
            name="is_staff"
            id="is_staff"
            checked={formData.is_staff}
            onChange={handleChange}
            className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
          />
          <label htmlFor="is_staff" className="ml-2 block text-sm text-gray-700">
            Admin User
          </label>
        </div>
      )}
      
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : isEditMode ? 'Update User' : 'Create User'}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { UserApiHook } from '../Hooks/userHooks';
import UserList from '../components/users/UserList';
import UserForm from '../components/users/UserCreateForm';
import Modal from '../components/common/Modal';

const UsersView = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const queryClient = useQueryClient();
  const userRole = localStorage.getItem('role');
  const updateUserMutation = UserApiHook.useUpdateUser();
  const addUserMutation = UserApiHook.useCreateUser();
  const deleteUserMutation = UserApiHook.useDeleteUser();
  // Fetch user list
  const { data: userDetails, isLoading, error } = UserApiHook.useGetUsers(pageSize, currentPage);

  // Fetch a user by ID if not in the list
  const { data: singleUser } = UserApiHook.useGetUserById(userId, {
    enabled: !!userId && !userDetails?.data?.find(u => u.id === parseInt(userId)),
  });

  useEffect(() => {
    if (userId) {
      const userToEdit = userDetails?.data?.find(u => u.id === parseInt(userId)) || singleUser;
      if (userToEdit) {
        setSelectedUser(userToEdit);
        setIsModalOpen(true);
      }
    }
  }, [userId, userDetails, singleUser]);


  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUserMutation.mutate(
        { id: userId},
        {
          onSuccess: () => {
            toast.success('Task user successfully!');
            handleModalClose();
            queryClient.invalidateQueries(['get-users']);
          },
          onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to deleted user.');
          },
        }
      );
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSubmit = (formData) => {
    if (selectedUser) {
       console.log('Submitting selectedUser:', selectedUser.id);
      updateUserMutation.mutate(
        { id: selectedUser.id, userData: formData },
        {
          onSuccess: () => {
            toast.success('User updated successfully!');
            queryClient.invalidateQueries(['get-user']);
            handleModalClose();
          },
          onError: () => {
            toast.error('Failed to update user. Please try again.');
          },
        }
      );
    } else {
      addUserMutation.mutate(
        {userData: formData },
        {
          onSuccess: () => {
            toast.success('User created successfully!');
            queryClient.invalidateQueries(['get-users']);
            handleModalClose();
          },
          onError: () => {
            toast.error('Failed to creataed user. Please try again.');
          },
        }
      );
    }
  };
  
  

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">User Management</h1>
        {['super_admin', 'admin'].includes(userRole) && (
          <button
            onClick={() => {
              setSelectedUser(null);
              setIsModalOpen(true);
            }}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Create New User
          </button>
        )}
      </div>

      <UserList
        users={userDetails?.data}
        isLoading={isLoading}
        error={error}
        currentPage={currentPage}
        totalPages={Math.ceil(userDetails?.count / pageSize) || 1}
        onPageChange={setCurrentPage}
        onEdit={handleEdit}
        onDelete={handleDelete}
        canEdit={['super_admin', 'admin'].includes(userRole)}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={selectedUser ? 'Edit User' : 'Create User'}
      >
        <UserForm
          onSubmit={handleSubmit}
          isLoading={selectedUser ? updateUserMutation.isLoading : addUserMutation.isLoading}
          initialData={selectedUser || {
            username: '',
            email: '',
            first_name: '',
            last_name: '',
            password: '',
            is_staff: false,
          }}
          isEditMode={!!selectedUser}
          canSetAdmin={userRole === 'super_admin'}
          onCancel={handleModalClose}
        />
      </Modal>
    </div>
  );
};

export default UsersView;

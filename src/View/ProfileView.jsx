import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserApiHook } from '../Hooks/userHooks';
import UserForm from '../components/users/UserCreateForm';

const ProfileView = () => {
  const queryClient = useQueryClient();
  const userId = localStorage.getItem('user_id');
  const updateUserMutation = UserApiHook.useUpdateUser();
  const { data: profile, isLoading, error } = UserApiHook.useGetUserById(userId);

  const handleSubmit = (formData) => {
      updateUserMutation.mutate(
        { id: profile?.data?.id, userData: formData },
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
    };

  if (isLoading) return <div>Loading profile...</div>;
  if (error) return <div>Error loading profile</div>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">Your Profile</h1>
        <p className="text-gray-600">Manage your account information</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <UserForm 
          onSubmit={handleSubmit}
          isLoading={updateUserMutation.isLoading}
          initialData={{
            username: profile?.data?.username || '',
            email: profile?.data?.email || '',
            first_name: profile?.data?.first_name || '',
            last_name: profile?.data?.last_name || '',
            password: ''
          }}
          isEditMode={true}
          canSetAdmin={false}
        />
      </div>
    </div>
  );
};

export default ProfileView;
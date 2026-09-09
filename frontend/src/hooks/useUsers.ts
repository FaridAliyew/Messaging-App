import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsers, getUserById, updateProfile } from '../services/userService';
import { User, UpdateProfileInput } from '../types/user';

export const useUsers = (search?: string) => {
  return useQuery<User[]>({
    queryKey: ['users', search || ''],
    queryFn: () => getUsers(search),
  });
};

export const useUser = (id: string) => {
  return useQuery<User>({
    queryKey: ['user', id],
    queryFn: () => getUserById(id),
    enabled: !!id,
    retry: 1,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, UpdateProfileInput>({
    mutationFn: updateProfile,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['auth', 'me'], updatedUser);
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

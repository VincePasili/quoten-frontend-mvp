import React, { useMemo, useState, useContext } from 'react';
import { MRT_EditActionButtons, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Box, Button, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip } from '@mui/material';
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchUsers, createUser, updateUser, deleteUser, fetchProjects } from '../utilities/api';
import AlertContext from '../contexts/AlertContext';


const Example = () => { 

  const [validationErrors, setValidationErrors] = useState({});
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const { data: fetchedProjects = [] } = useGetProjects();

  const { showAlert } = useContext(AlertContext);

  const formattedProjects = fetchedProjects.map(project => ({
    label: project.project_name,
    value: project.project_name,
  }));
  
  
  const computeLabourMarginByProject = (labourMargin, billableRate) => {
    return billableRate ? (labourMargin / billableRate).toFixed(2) : 0;
  };
  
  const columns = useMemo(
    () => [
      // { accessorKey: 'id', header: 'Id', enableEditing: false, size: 80 },
      {
        accessorKey: 'firstName',
        header: 'First Name',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.firstName,
          helperText: validationErrors?.firstName,
          onFocus: () => setValidationErrors({ ...validationErrors, firstName: undefined }),
        },
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.lastName,
          helperText: validationErrors?.lastName,
          onFocus: () => setValidationErrors({ ...validationErrors, lastName: undefined }),
        },
      },
      {
        accessorKey: 'agentRole',
        header: 'Role',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.agentRole,
          helperText: validationErrors?.agentRole,
          onFocus: () => setValidationErrors({ ...validationErrors, agentRole: undefined }),
        },
      },
      {
        accessorKey: 'hourlyRate',
        header: 'Hourly Rate',
        muiEditTextFieldProps: {
          required: true,
          type: Number,
          error: !!validationErrors?.hourlyRate,
          helperText: validationErrors?.hourlyRate,
          onFocus: () => setValidationErrors({ ...validationErrors, hourlyRate: undefined }),
        },
      },
      {
        accessorKey: 'labourMargin',
        header: 'Labour Margin (LM)',
        muiEditTextFieldProps: {
          required: true,
          type: Number,
          error: !!validationErrors?.labourMargin,
          helperText: validationErrors?.labourMargin,
          onFocus: () => setValidationErrors({ ...validationErrors, labourMargin: undefined }),
        },
      },
      {
        accessorKey: 'billableRate',
        header: 'Billable Rate (Per TM)',
        muiEditTextFieldProps: {
          required: true,
          type: Number,
          error: !!validationErrors?.billableRate,
          helperText: validationErrors?.billableRate,
          onFocus: () => setValidationErrors({ ...validationErrors, billableRate: undefined }),
        },
      },
      {
        accessorKey: 'projectName',
        header: 'Project (P)',
        editVariant: 'select',
        editSelectOptions: formattedProjects,
        muiEditTextFieldProps: {
          select: true,
          error: !!validationErrors?.project,
          helperText: validationErrors?.project,
        },
      },
      {
        accessorKey: 'labourMarginByProject',
        header: 'Labour Margin by Project (LM/P)',
        muiEditTextFieldProps: {
          type: Number,
          error: !!validationErrors?.labourMarginByProject,
          helperText: validationErrors?.labourMarginByProject,
          onFocus: () => setValidationErrors({ ...validationErrors, labourMarginByProject: undefined }),
        },
      },
    ],
    [fetchedProjects, validationErrors]
  );

  const { mutateAsync: createUser, isPending: isCreatingUser } = useCreateUser(setAlert);
  const { data: fetchedUsers = [], isError: isLoadingUsersError, isFetching: isFetchingUsers, isLoading: isLoadingUsers } = useGetUsers();
  const { mutateAsync: updateUser, isPending: isUpdatingUser } = useUpdateUser(setAlert);
  const { mutateAsync: deleteUser, isPending: isDeletingUser } = useDeleteUser(setAlert);

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  const handleCreateUser = async ({ values, table }) => {
    try {
      const newValidationErrors = validateUser(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      await createUser(values);
      table.setCreatingRow(null); // exit creating mode
      showAlert({ message: 'User created successfully!', severity: 'success' });
    } catch (error) {
      showAlert({ message: error.message, severity: 'error' });
    }
  };

  const handleSaveUser = async ({ values, table }) => {
    try {
      const newValidationErrors = validateUser(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      await updateUser(values);
      table.setEditingRow(null); // exit editing mode
      showAlert({ message: 'User updated successfully!', severity: 'success' });
    } catch (error) {
      showAlert({ message: error.message, severity: 'error' });
    }
  };

  const openDeleteConfirmModal = async (row) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(row.original.id);
        showAlert({ message: 'User deleted successfully!', severity: 'success' });
      } catch (error) {
        showAlert({ message: 'Error deleting user.', severity: 'error' });
      }
    }
  };

  const dataWithComputedValues = useMemo(() => {
    return fetchedUsers.map((user) => ({
      ...user,
      labourMarginByProject: computeLabourMarginByProject(user.labourMargin, user.billableRate),
    }));
  }, [fetchedUsers]);

  const table = useMaterialReactTable({
    columns,
    data: dataWithComputedValues,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    getRowId: (row) => row.id,
    muiToolbarAlertBannerProps: isLoadingUsersError
      ? {
          color: 'error',
          children: 'Error loading data',
        }
      : undefined,
    muiTableContainerProps: {
      sx: {
        minHeight: '500px',
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateUser,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: async ({ values, row, table }) => {
      const rowId = row.original.id; // Access the row id
      values.id = rowId;
      await handleSaveUser({ values, table });
    },
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h4">Add New Member</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Edit Member</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        onClick={() => {
          table.setCreatingRow(true);
        }}
      >
        Add Team Member
      </Button>
    ),
    state: {
      isLoading: isLoadingUsers,
      isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
      showAlertBanner: isLoadingUsersError,
      showProgressBars: isFetchingUsers,
    },
  });

  return (
    <>
      <MaterialReactTable table={table} />
    </>
  );
};

function useCreateUser(setAlert) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onMutate: async (newUserInfo) => {
      await queryClient.cancelQueries(['users']);
      const previousUsers = queryClient.getQueryData(['users']) || [];
      return { previousUsers };
    },
    onError: (err, newUserInfo, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(['users'], context.previousUsers);
      }
      setAlert({
        open: true,
        message: 'Error creating user.',
        severity: 'error',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(['users']);
    },
  });
}

function useGetUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    refetchOnWindowFocus: false,
  });
}

function useUpdateUser(setAlert) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUser,
    onMutate: async (updatedUserInfo) => {
      await queryClient.cancelQueries(['users']);
      const previousUsers = queryClient.getQueryData(['users']);
      queryClient.setQueryData(['users'], (old) =>
        old.map((user) => (user.id === updatedUserInfo.id ? { ...user, ...updatedUserInfo } : user))
      );
      return { previousUsers };
    },
    onError: (err, updatedUserInfo, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(['users'], context.previousUsers);
      }

      setAlert({
        open: true,
        message: 'Error updating user.',
        severity: 'error',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(['users']);
    },
  });
}

function useDeleteUser(setAlert) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId) => deleteUser(userId),
    onMutate: async (userId) => {
      await queryClient.cancelQueries(['users']);
      const previousUsers = queryClient.getQueryData(['users']);
      queryClient.setQueryData(['users'], (old) => old.filter((user) => user.id !== userId));
      return { previousUsers };
    },
    onError: (err, userId, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(['users'], context.previousUsers);
      }
      setAlert({
        open: true,
        message: 'Error deleting user.',
        severity: 'error',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries(['users']);
    },
  });
}

function useGetProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    refetchOnWindowFocus: false,
  });
}

const queryClient = new QueryClient();

const ExampleWithProviders = () => (
  <QueryClientProvider client={queryClient}>
    <Example />
  </QueryClientProvider>
);

export default ExampleWithProviders;

const validateRequired = (value) => !!value.length;

function validateUser(user) {
  return {
    firstName: !validateRequired(user.firstName) ? 'First Name is Required' : '',
    lastName: !validateRequired(user.lastName) ? 'Last Name is Required' : '',
  };
}
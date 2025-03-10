import React, { useMemo, useState, forwardRef, useContext } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Button, Snackbar, IconButton, Tooltip, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MuiAlert from '@mui/material/Alert';
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchProjects, createProject, updateProject, deleteProject } from '../utilities/api';
import AlertContext from '../contexts/AlertContext';

const Team = () => {
  const { showAlert } = useContext(AlertContext);

  const queryClient = useQueryClient();

  const { data: projects = [], error, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: 'client_name',
        header: 'Client Name',
        muiEditTextFieldProps: {
          required: true,
        },
        Cell: ({ cell }) => (
          <div style={{ color: '#333', fontWeight: 'bold' }}>
            {cell.getValue()}
          </div>
        ),
      },
      {
        accessorKey: 'project_name',
        header: 'Project Name',
        muiEditTextFieldProps: {
          required: true,
        },
        Cell: ({ cell }) => (
          <div style={{ color: 'blue', fontWeight: 'bold' }}>
            {cell.getValue()}
          </div>
        ),
      },
      {
        accessorKey: 'description',
        header: 'Project Description',
        muiEditTextFieldProps: {
          required: true,
          multiline: true,
        },
      },
      {
        accessorKey: 'project_scope',
        header: 'Project Scope',
        muiEditTextFieldProps: {
          required: true,
          multiline: true,
        },
      },
      {
        accessorKey: 'proposal_version',
        header: 'Proposal Version',
        muiEditTextFieldProps: {
          required: true,
          multiline: true,
        },
      },
      {
        accessorKey: 'team_size',
        header: 'Team Size',
        muiEditTextFieldProps: {
          type: 'number',
          required: true,
        },
      },
    ],
    []
  );

  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
      showAlert({ message: 'Project created successfully!', severity: 'success' });
    },
    onError: () => showAlert({ message: 'Error creating project.', severity: 'error' }),
  });

  const updateProjectMutation = useMutation({
    mutationFn: updateProject,
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
      showAlert({ message: 'Project updated successfully!', severity: 'success' });
    },
    onError: () => showAlert({ message: 'Error updating project.', severity: 'error' }),
  });

  const deleteProjectMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
      showAlert({ message: 'Project deleted successfully!', severity: 'success' });
    },
    onError: () => showAlert({ message: 'Error deleting project.', severity: 'error' }),
  });

  const handleCreateProject = async ({ values, table }) => {
    values.team_size = Number(values.team_size);
    if (!values.client_name || !values.project_name || !values.description || isNaN(values.team_size) || values.team_size < 0) {
      showAlert({ message: 'All fields are required, and the Number of Workers must be a non-negative number.', severity: 'error' });
      return;
    }

    try {
      await createProjectMutation.mutateAsync(values);
      table.setCreatingRow(null);
    } catch (error) {
      showAlert({
        message: error.message,
        severity: 'error',
      });
    }
  };

  const handleSaveProject = async ({ values, table }) => {
    values.team_size = Number(values.team_size);
    if (!values.client_name || !values.project_name || !values.description || isNaN(values.team_size) || values.team_size < 0) {
      showAlert({ message: 'All fields are required, and the Number of Workers must be a non-negative number.', severity: 'error' });
      return;
    }
    
    try {
      await updateProjectMutation.mutateAsync(values);
      table.setEditingRow(null);
    } catch (error) {
      showAlert({
        message: error.message,
        severity: 'error',
      });
    }
  };

  const handleDeleteProject = async (row) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProjectMutation.mutateAsync(row.original.id);
      } catch (error) {
        console.error('Error deleting project.');
      }
    }
  };

  const tableInstance = useMaterialReactTable({
    columns,
    data: projects,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    getRowId: (row) => row.id,
    onCreatingRowSave: handleCreateProject,
    onEditingRowSave: async ({ values, row, table }) => {
      const rowId = row.original.id;
      values.id = rowId;
      await handleSaveProject({ values, table });
    },
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => handleDeleteProject(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    muiTableProps: {
      sx: {
        border: '1px solid #ccc',
        '& th': { 
          backgroundColor: '#f0f0f0',
          borderRight: '1px solid #e90e0e', 
          color: '#333',
          '& svg': {
            color: '#e90e0e', 
          },
        },
        '& td': { 
          borderRight: '1px solid #e90e0e',
          color: '#555',
        },
      },
    },
    muiTableBodyCellProps: {
      sx: {
        '&:hover': {
          backgroundColor: '#f9f9f9',
        },
      },
    },
    muiTableHeadCellProps: {
      sx: {
        borderBottom: '2px solid #000',
      },
    },
  });

  return (
    <>
      <MaterialReactTable table={tableInstance} />
    </>
  );
};

const queryClient = new QueryClient();

const ProjectTableWithProviders = () => (
  <QueryClientProvider client={queryClient}>
    <Team />
  </QueryClientProvider>
);

export default ProjectTableWithProviders;
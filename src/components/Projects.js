import React, { useEffect, useContext, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { TeamIcon, RoleIcon,  QuotesIcon, ScopeIcon, ClientIcon, PlusIcon } from "./Icons";
import { useDeleteProjectMutation, useProjects, useTeamMembers } from "../utilities/api";
import ProjectModal from "./ProjectModal";
import FlexibleTable from "./FlexibleTable";
import AlertContext from "../contexts/AlertContext";

const Projects = () => {
  const { showAlert } = useContext(AlertContext);
  const { projects, isLoading, isError, error, refreshProjects } = useProjects();
  const { fetchMembers } = useTeamMembers();
  
  const queryClient = useQueryClient();
  const { deleteProjectMutate } = useDeleteProjectMutation(queryClient);
  const [deleting, setDeleting ] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    if (isError) {
      showAlert({
        message: error.message || 'An error occurred while fetching team members',
        severity: 'error',
      });
    }
  }, [isError, error, showAlert]);

  useEffect(() => {
    refreshProjects();
  }, [projects])
  const teamColumns = [
    { name: "Client Name", icon: <ClientIcon className={"w-6 h-6 pr-1"}/>, accessorKey: "client_name" },
    { name: "Project Name", icon: <RoleIcon/>, accessorKey: "project_name" },
    { name: "Scope", icon: <ScopeIcon/>, accessorKey: "scope" },
    { name: "Quote #", icon: <QuotesIcon className={"w-6 h-6 pr-1"}/>, accessorKey: "quote_version" },
    { name: "Team Size", icon: <TeamIcon className={"w-6 h-6 pr-1"}/>, accessorKey: "team_size" },
    { id: 'actions', icon: <PlusIcon className={"w-6 h-6 pr-1"}/>},
  ];

  const actionItems = [
    { item: 'Edit Project', action: 'edit' },
    { item: 'Delete Project', action: 'delete' }
  ];

  // Handle actions for team members
  const onAction = (action, recordData = null) => {
    switch(action) {
      case 'edit':
        if (recordData) {
          setSelectedProject(recordData);
          setModalMode('edit');
          setIsModalOpen(true);
        }
        break;
      case 'delete':
        if (recordData) {    
          setDeleting(true);
          deleteProjectMutate(recordData, {
            onSuccess: () => {
              setDeleting(false);
              showAlert({message: "Project deleted successfully.", severity:'success'});
              refreshProjects();
              fetchMembers();
            },
            onError: (error) => {
              setDeleting(false);
              showAlert({message: error.message || "An error occurred deleting the project.", severity:'error'});
            }
          });
          
        }
        break;
      case 'create':
        setSelectedProject(null);
        setModalMode("create");
        setIsModalOpen(true);
        break;
      case 'update_columns':
        showAlert({
          message: "All the fields are visible.",
          severity: 'info',
        });
        break;
      default:
        showAlert({
          message: "Unknown action",
          severity: 'info',
        });
    }
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
    refreshProjects();
    fetchMembers();
  };

  const loading = () => {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  };
  
  // Loading state rendering
  if (isLoading) {
    return loading();
  }

  return (
    <div>
      
    { projects && projects.length > 0 ? (
      <FlexibleTable 
        data={projects} 
        columns={teamColumns} 
        showBottomToolbar={true} 
        showColumnActions={false} 
        enableColumnOrdering={false}
        columnsWithColorMarkers={['role']} 
        columnsWithPellets={['role']} 
        addRowButtonText="Add Project" 
        addRowButtonId="add-project-button"
        actionItems={actionItems}
        onAction={onAction}
        firstColumnClassNames={""}
        customCellClasses={"text-sm font-sans font-[450] antialiased"}
      />
        ):
        (
          <div className="flex flex-col items-center justify-center px-4 py-3 border-t border-gray-200">
            <span className="col-2 mb-2">No project found.</span>
            <button 
              id="add-project-button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold font-mono py-1 px-4 rounded-full transition duration-300 ease-in-out"
              onClick={() => {onAction("create")}}
            >
              Add Project
            </button>
          </div>
          )
      }

      <ProjectModal
        open={isModalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        project={selectedProject}
      />
      
      {deleting && loading()}      

    </div>
  );
}

export default Projects;
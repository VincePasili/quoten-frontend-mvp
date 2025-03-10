import React, { useEffect, useContext, useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { TeamIcon, RoleIcon, TimeIcon, DollarIcon, ProjectsIcon, PercentageIcon, GraphIcon, PlusIcon } from "./Icons";
import { useTeamMembers, useUpdateTeamMemberMutation, useProjects } from "../utilities/api";
import TeamMemberModal from "./TeamMemberModal";
import AddFieldModal from "./AddFieldModal";
import FlexibleTable from "./FlexibleTable";
import AlertContext from "../contexts/AlertContext";

const Team = () => {
  const { showAlert } = useContext(AlertContext);
  const { members, isLoading, isError, error, fetchMembers } = useTeamMembers();
  const { refreshProjects } = useProjects();
  
  const queryClient = useQueryClient();
  const { updateTeamMemberMutate } = useUpdateTeamMemberMutation(queryClient);
  const [archiving, setArchiving ] = useState(false);
    
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedMember, setSelectedMember] = useState(null);
  const [isAddFieldModalOpen, setIsAddFieldModalOpen] = useState(false);
  const [originalColumns, setOriginalColumns] = useState([
    { name: "Team Member", icon: <TeamIcon className="w-5 h-5 mr-2"/>, accessorKey: "name", visible: true },
    { name: "Primary Role", icon: <RoleIcon className="w-5 h-5 mr-2"/>, accessorKey: "role", visible: true },
    { name: "Hourly Rate", icon: <TimeIcon className="w-6 h-6 mr-2"/>, accessorKey: "rate", visible: true },
    { name: "Billable Rate", icon: <DollarIcon className="w-6 h-6 mr-2"/>, accessorKey: "billable_rate", visible: true },
    { name: "Labour Margin", icon: <PercentageIcon className="w-5 h-5 mr-2"/>, accessorKey: "labour_margin", visible: true },
    { name: "Other Roles", icon: <RoleIcon className="w-5 h-5 mr-2"/>, accessorKey: "other_roles", visible: false },
    { name: "Projects", icon: <ProjectsIcon className="w-5 h-5 mr-2"/>, accessorKey: "project_names", visible: false },
    { name: "Labour Margin / Project", icon: <GraphIcon className="w-5 h-5 mr-2"/>, accessorKey: "labour_margin_by_project", visible: false },
    { id: 'actions', name: 'Add Field', icon: <PlusIcon/>, visible: true },
  ]);

  const [columns, setColumns] = useState(originalColumns.filter(col => col.visible));
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isError) {
      showAlert({
        message: error.message || 'An error occurred while fetching team members',
        severity: 'error',
      });
    }
  }, [isError, error, showAlert]);

  useEffect(() => {
    setColumns(originalColumns.filter(col => col.visible));
  }, [originalColumns]);

  const openAddFieldModal = useCallback((event) => {
    setClickPosition({ x: event.clientX, y: event.clientY });
    setIsAddFieldModalOpen(true);
  }, []);

  const closeAddFieldModal = useCallback(() => {
    setIsAddFieldModalOpen(false);
  }, []);

  const toggleColumnVisibility = useCallback((accessorKey) => {
    setOriginalColumns(prevColumns => 
      prevColumns.map(col => 
        col.accessorKey === accessorKey ? { ...col, visible: !col.visible } : col
      )
    );
    closeAddFieldModal();
  }, [closeAddFieldModal]);

  const actionItems = [
    { item: 'Edit Team Member', action: 'edit' },
    { item: 'Archive Team Member', action: 'archive' }
  ];

  const onAction = useCallback((action, recordData = null, event) => {
    switch(action) {
      case 'edit':
        if (recordData) {
          setSelectedMember(recordData);
          setModalMode('edit');
          setIsModalOpen(true);
        }
        break;
      case 'archive':
          if (recordData) {
            setArchiving(true);
            updateTeamMemberMutate({
              ...Object.fromEntries(
                Object.entries(recordData).map(([key, value]) => [
                  key,
                  typeof value === 'string' ? value.replace(/[\$%]/g, '') : value
                ])
              ),
              "archived": true
            }, {
              onSuccess: () => {
                setArchiving(false);
                showAlert({message: "Team member archived successfully.", severity:'success'});
                fetchMembers();
              },
              onError: (error) => {
                setArchiving(false);
                showAlert({message: error.message || "An error occurred while archiving the team member.", severity:'error'});
              }
            });
        
          }
          break;
      case 'create':
        setModalMode("create");
        setIsModalOpen(true);
        break;
      case 'update_columns':
        if(columns.length === originalColumns.length)
        {
          showAlert({
            message: "All the fields are visible.",
            severity: 'info',
          });
        }
        openAddFieldModal(event);
        
        break;
      default:
        showAlert({
          message: "Unknown Action.",
          severity: 'info',
        });
    }
  }, [openAddFieldModal, showAlert]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedMember(null);
    fetchMembers();
    refreshProjects();
    
  }, []);


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
    <div className="team-component">
      {members && members.length > 0 ? (
          <FlexibleTable 
              data={members} 
              columns={columns} 
              showBottomToolbar={true} 
              showColumnActions={false} 
              enableColumnOrdering={true}
              columnsWithColorMarkers={['role']} 
              columnsWithPellets={['role']} 
              addRowButtonText="Add Member"
              addRowButtonId="add-member-button" 
              actionItems={actionItems}
              onAction={onAction}
              firstColumnClassNames="text-sm font-bold"
              customCellClasses="text-xs font-semibold"
            />
          ):
          (
            <div className="flex flex-col items-center justify-center px-4 py-3 border-t border-gray-200">
              <span className="col-2 mb-2">No team member found.</span>
              <button 
                id="add-member-button"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold font-mono py-1 px-4 rounded-full transition duration-300 ease-in-out"
                onClick={() => {onAction("create")}}
              >
                Add Member
              </button>
            </div>
          )
      }
      
      {isModalOpen && (
        <TeamMemberModal 
          open={isModalOpen} 
          onClose={handleCloseModal} 
          mode={modalMode} 
          teamMember={selectedMember}
        />
      )}
      {isAddFieldModalOpen && (
        <AddFieldModal 
          isOpen={isAddFieldModalOpen} 
          onClose={closeAddFieldModal} 
          columns={originalColumns} 
          onToggleVisibility={toggleColumnVisibility}
          clickPosition={clickPosition}
        />
      )}

      {archiving && loading()}     
    </div>
  );
}

export default Team;
import React, { useState, useContext } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCreateTeamMemberMutation, useUpdateTeamMemberMutation, useProjects, useCreateNotificationMutation, useNotifications } from '../utilities/api';
import AddRoleModal from './AddRoleModal';
import SelectItemModal from './SelectItemModal';
import AlertContext from '../contexts/AlertContext';

const cleanValue = (value) => {
  if (typeof value === 'string') {
    return value.replace(/[\$%]/g, '');
  }
  return value;
};

const TeamMemberModal = ({ open, onClose, mode, teamMember }) => {
  const [memberData, setMemberData] = useState({
    first_name: teamMember?.first_name || '',
    last_name: teamMember?.last_name || '',
    role: teamMember?.role || '',
    other_roles: teamMember?.other_roles || [],
    rate: teamMember ? cleanValue(teamMember.rate) : '',
    billable_rate: teamMember ? cleanValue(teamMember.billable_rate) : '',
    labour_margin: teamMember ? cleanValue(teamMember.labour_margin) : '',
    projects: teamMember?.projects || [],
    labour_margin_by_project: teamMember ? cleanValue(teamMember.labour_margin_by_project) : ''
  });
  
  const queryClient = useQueryClient();
  const { createTeamMemberMutate } = useCreateTeamMemberMutation(queryClient);
  const { updateTeamMemberMutate } = useUpdateTeamMemberMutation(queryClient);

  const { createNotificationMutate } = useCreateNotificationMutation();
  const { refreshNotifications } = useNotifications();


  const [isLoading, setIsLoading] = useState(false);
  const [addRoleModalOpen, setAddRoleModalOpen] = useState(false);
  const [selectItemModalOpen, setSelectItemModalOpen] = useState(false);
  
  const { projects } = useProjects();
  const { showAlert } = useContext(AlertContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['rate', 'billable_rate', 'labour_margin', 'labour_margin_by_project'].includes(name)) {
      if (!isNaN(value) || value === '') {
        setMemberData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setMemberData(prev => ({ ...prev, [name]: value }));
    }
  };

  const removeRole = (index) => {
    setMemberData(prev => ({
      ...prev,
      other_roles: prev.other_roles.filter((_, i) => i !== index)
    }));
  };

  const handleAddRole = (newRole) => {
    setMemberData(prev => ({
      ...prev,
      other_roles: [...prev.other_roles, newRole]
    }));
    setAddRoleModalOpen(false);
  };

  const removeProject = (index) => {
    setMemberData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const handleSelectProject = (selectedProjects) => {
    setMemberData(prev => ({
      ...prev,
      projects: selectedProjects
    }));
    setSelectItemModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (mode === 'create') {
      setIsLoading(true);
      createTeamMemberMutate(memberData, {
        onSuccess: async () => {
          setIsLoading(false);
          onClose();
          showAlert({message: "Team member added successfully.", severity: 'success'});

          const notification = {            
            type: 'new_member',
            content: `${memberData.first_name} ${memberData.last_name}`,
            scope: 'organisation'
          }
          createNotificationMutate(notification);
          await refreshNotifications();

        },
        onError: (error) => {
          setIsLoading(false);
          showAlert({message: error.message || "An error occurred while adding the team member.", severity:'error'});
        }
      });
    } else {
      setIsLoading(true);
      updateTeamMemberMutate({
        ...memberData,
        id: teamMember.id 
      }, {
        onSuccess: () => {
          setIsLoading(false);
          onClose();
          showAlert({message: "Team member updated successfully.", severity:'success'});
        },
        onError: (error) => {
          setIsLoading(false);
          showAlert({message: error.message || "An error occurred while updating the team member.", severity:'error'});
        }
      });
    }
  };

  return (
    <div className={`${open ? 'block' : 'hidden'} fixed z-10 inset-0 overflow-y-auto`} 
         aria-labelledby="modal-title" 
         role="dialog" 
         aria-modal={open ? "true" : "false"}>
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:min-w-[640px] min-w-full" role="document">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                {mode === 'create' ? 'Add New Team Member' : 'Edit Team Member'}
              </h3>
              <button type="button" 
                      className="text-gray-800 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                      onClick={onClose}
                      aria-label="Close modal">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} aria-label="Team Member Form">
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name</label>
                  <input type="text" name="first_name" id="first_name" value={memberData.first_name} onChange={handleChange} 
                         className="mt-1 block w-full text-gray-700 shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md" 
                         placeholder="Alex" required />
                </div>
                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input type="text" name="last_name" id="last_name" value={memberData.last_name} onChange={handleChange} 
                         className="mt-1 block w-full text-gray-700 shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md" 
                         placeholder="Macpherson" required />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">Primary Role</label>
                  <input type="text" name="role" id="role" value={memberData.role} onChange={handleChange} 
                         className="mt-1 block w-full text-gray-700 shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md" 
                         placeholder="Software Engineer" required />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Other Roles</label>
                  <div className="mt-1 p-1 flex flex-wrap items-center border border-gray-300 rounded" role="list" aria-label="Other roles list">
                    {memberData.other_roles.length > 0 ? (
                      memberData.other_roles.map((role, index) => (
                        <div key={index} className="ml-0.5 px-2 py-1 bg-gray-200 text-gray-800 rounded-full flex items-center" role="listitem">
                          <span className="text-sm font-semibold">{role}</span>
                          <button type="button" 
                                  onClick={() => removeRole(index)} 
                                  className="m-0.5 text-gray-800 hover:text-red-800"
                                  aria-label={`Remove ${role} role`}>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                            </svg>
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center p-2 text-sm font-medium text-gray-500">
                        No other roles added
                      </div>
                    )}
                    <button type="button" 
                      className="ml-auto p-1 hover:bg-gray-300 rounded-full" 
                      aria-label="Add other role"
                      onClick={() => setAddRoleModalOpen(true)}
                    >
                      <svg className="w-6 h-6 text-gray-900 rounded-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <rect width="24" height="24" fill="none"/>
                        <path d="M12 6V18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M6 12H18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="rate" className="block text-sm font-medium text-gray-700">Hourly Rate</label>
                  <input type="number" step="0.01" name="rate" id="hourly_rate" value={memberData.rate} onChange={handleChange} 
                         className="mt-1 block w-full text-gray-700 shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md" 
                         placeholder="100.00" required />
                </div>
                <div>
                  <label htmlFor="billable_rate" className="block text-sm font-medium text-gray-700">Billable Rate</label>
                  <input type="number" step="0.01" name="billable_rate" id="billable_rate" value={memberData.billable_rate} onChange={handleChange} 
                         className="mt-1 block w-full text-gray-700 shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md" 
                         placeholder="150.00" required />
                </div>
                <div>
                  <label htmlFor="labour_margin" className="block text-sm font-medium text-gray-700">Labour Margin (LM)</label>
                  <input type="number" step="0.01" name="labour_margin" id="labour_margin" value={memberData.labour_margin} onChange={handleChange} 
                         className="mt-1 block w-full text-gray-700 shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md" 
                         placeholder="16.50" required />
                </div>
                <div className='col-span-2'>
                  <label className="block text-sm font-medium text-gray-700">Projects (P)</label>
                  <div className="mt-1 p-1 flex flex-wrap items-center border border-gray-300 rounded" role="list" aria-label="Projects list">
                    {memberData.projects && memberData.projects.length > 0 ? (
                      memberData.projects.map((project, index) => (
                        <div key={index} className="ml-0.5 px-2 py-1 bg-gray-200 text-gray-800 rounded-full flex items-center" role="listitem">
                          <span className="text-sm font-semibold">{project.project_name}</span>
                          <button type="button" 
                                  onClick={() => removeProject(index)} 
                                  className="m-0.5 text-gray-800 hover:text-red-800"
                                  aria-label={`Remove ${project.project_name} project`}>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                            </svg>
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center p-2 text-sm font-medium text-gray-500">
                        No projects selected
                      </div>
                    )}
                    <button type="button" 
                      className="ml-auto p-1 hover:bg-gray-300 rounded-full" 
                      aria-label="Add project"
                      onClick={() => setSelectItemModalOpen(true)}
                    >
                      <svg className="w-6 h-6 text-gray-900 rounded-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <rect width="24" height="24" fill="none"/>
                        <path d="M12 6V18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M6 12H18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="labour_margin_by_project" className="block text-sm font-medium text-gray-700">Labour Margin by Project (LM/P)</label>
                  <input type="number" step="0.01" name="labour_margin_by_project" id="labour_margin_by_project" value={memberData.labour_margin_by_project} onChange={handleChange} 
                         className="mt-1 block w-full text-gray-700 shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md" 
                         placeholder="123" required />
                </div>
              </div>
              <div className="mt-5 mb-5">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`inline-flex px-6 py-2 bg-blue-600 text-white text-sm font-normal rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isLoading ? " opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg width="20" height="20" fill="currentColor" className="mr-2 animate-spin-slow" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                        <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5z"></path>
                      </svg>
                      <span>{mode === 'create' ? 'Saving Team Member' : 'Updating Team Member'}</span>
                    </>
                  ) : (
                    <>                     
                    {mode === 'create' ? 'Save' : 'Save Changes'}
                  </>)}
                </button>
                {addRoleModalOpen && (
                   <AddRoleModal 
                     isOpen={addRoleModalOpen} 
                     onClose={() => setAddRoleModalOpen(false)} 
                     onAddRole={handleAddRole}
                   />
                 )}
                {selectItemModalOpen && (
                  <SelectItemModal 
                    isOpen={selectItemModalOpen}
                    onClose={() => setSelectItemModalOpen(false)}
                    onSelect={handleSelectProject}
                    items={projects}
                    isProjectSelection={true}
                    userProjects={memberData.projects}
                  />
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberModal;
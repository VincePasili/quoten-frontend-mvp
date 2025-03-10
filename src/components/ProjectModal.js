import React, { useState, useEffect, useContext } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProject, updateProject, useTeamMembers, useCreateNotificationMutation, useNotifications } from '../utilities/api';
import AlertContext from '../contexts/AlertContext';
import SelectItemModal from './SelectItemModal';

const ProjectModal = ({ open, onClose, mode, project }) => {
  const [projectData, setProjectData] = useState({
    client_name: project?.client_name || '',
    project_name: project?.project_name || '',
    scope: project?.scope || '',
    quote_version: project?.quote_version || '',
    team: project?.team || [],
  });

  
  const [selectItemModalOpen, setSelectItemModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const { showAlert } = useContext(AlertContext);

  const { members, isError, error, fetchMembers} = useTeamMembers();
  const { createNotificationMutate } = useCreateNotificationMutation();
  const { refreshNotifications } = useNotifications();
  

  const queryClient = useQueryClient();

  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
      onClose();
      showAlert({
        message: "Project created successfully.",
        severity: 'success',
      });
    },
    onError: (error) => {
      showAlert({
        message: error.message,
        severity: 'error',
      });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: updateProject,
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
      onClose();
      showAlert({
        message: "Project updated successfully.",
        severity: 'success',
      });
    },
    onError: (error) => {
      showAlert({
        message: error.message,
        severity: 'error',
      });
    },
  });

  useEffect(() => {
    if (mode === 'edit' && project) {
      setProjectData({
        ...project,
      });
    }
    else if(mode === "create") {
      setProjectData({
        client_name: '',
        project_name: '',
        scope: '',
        quote_version: '',
        team: [],
      })
    }
  }, [mode, project]);

  
  useEffect(() => {
    if (isError) {
      showAlert({
        message: error.message || 'An error occurred while fetching team members',
        severity: 'error',
      });
    }

    if (project && (mode === "create" || mode === "edit"))
    {
      fetchMembers();
    }
  }, [isError, error, showAlert, project, mode]);

  const handleAddMembersToProject = (selectedMembers) => {
    setProjectData(prev => ({
      ...prev,
      team: selectedMembers
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const removeMember = (memberIdToRemove) => {
    setProjectData(prevData => ({
      ...prevData,
      team: prevData.team.filter(member => member.id !== memberIdToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true);
    if (mode === 'create') {
      createProjectMutation.mutate({
        ...Object.fromEntries(
          Object.entries(projectData).filter(([key]) => key !== 'team_size')
        ),
      }, {
        onSuccess: async () => {
          setIsLoading(false);
          const notification = {            
            type: 'new_project',
            content: `${projectData.project_name}`,
            scope: 'organisation'
          }
          createNotificationMutate(notification);
          await refreshNotifications();
        },
        onError: () => {
          setIsLoading(false);
        }
      });
    } else {
      updateProjectMutation.mutate({
        ...Object.fromEntries(
          Object.entries(projectData).filter(([key]) => key !== 'team_size')
        ),
        id: project.id 
      }, {
        onSuccess: () => {
          setIsLoading(false);
        },
        onError: () => {
          setIsLoading(false);
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
                {mode === 'create' ? 'Create Project' : 'Edit Project'}
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
            <form onSubmit={handleSubmit} aria-label="Project Form">
              <div className="mt-5">
                <label htmlFor="client_name" className="block text-sm font-medium text-gray-700">Client Name</label>
                <div className="mt-1">
                  <input type="text" name="client_name" id="client_name" value={projectData.client_name} onChange={handleChange} 
                         className="block w-full text-gray-700 shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md" 
                         placeholder="Greenhat" 
                         required 
                         aria-required="true" />
                </div>
              </div>
              <div className="mt-5">
                <label htmlFor="project_name" className="block text-sm font-medium text-gray-700">Project Name</label>
                <div className="mt-1">
                  <input type="text" name="project_name" id="project_name" value={projectData.project_name} onChange={handleChange} 
                         className="block w-full text-gray-700 shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md" 
                         placeholder="Quoten Product Launch" 
                         required 
                         aria-required="true" />
                </div>
              </div>
              <div className="mt-5">
                <label htmlFor="scope" className="block text-sm font-medium text-gray-700">Project Scope</label>
                <div className="mt-1">
                  <input type="text" name="scope" id="scope" value={projectData.scope} onChange={handleChange} 
                         className="block w-full text-gray-700 shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md" 
                         placeholder="Interface Design & Development" 
                         required 
                         aria-required="true" />
                </div>
              </div>
              <div className="mt-5">
                <label className="block text-sm font-medium text-gray-700">Team Members</label>
                <div className="mt-1 p-1 flex flex-wrap items-center border border-gray-300 rounded" role="list" aria-label="Team members list">
                  {projectData.team.length > 0 ? (
                    projectData.team.map((member, index) => (
                      <div key={member.id} className="ml-0.5 px-2 py-1 bg-gray-200 text-gray-800 rounded-full flex items-center" role="listitem">
                        <span className="text-sm font-semibold">{member.first_name} {member.last_name}</span>
                        <button type="button" 
                                onClick={() => removeMember(member.id)} 
                                className="m-0.5 text-gray-800 hover:text-red-800"
                                aria-label={`Remove ${member.first_name} ${member.last_name} from team`}>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                          </svg>
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className=" text-center p-2 text-sm font-medium text-gray-500">
                      No team members selected
                    </div>
                  )}
                  <button type="button" 
                    className="ml-auto p-1 hover:bg-gray-300 rounded-full" 
                    aria-label="Add team member"
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
              <div className="mt-5">
                <label htmlFor="quote_version" className="block text-sm font-medium text-gray-700">Quote Version #</label>
                <div className="mt-1">
                  <input type="text" name="quote_version" id="quote_version" value={projectData.quote_version} onChange={handleChange} 
                         className="block w-full text-gray-700 shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md" 
                         placeholder="19112024.rev01" 
                         required 
                         aria-required="true" />
                </div>
              </div>
              <div className="mt-5 mb-5">               
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`inline-flex px-4 py-2 bg-blue-600 text-white text-sm font-normal rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isLoading ? " opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg width="20" height="20" fill="currentColor" className="mr-2 animate-spin-slow" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                          <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z">
                          </path>
                      </svg>
                      <span>{mode === 'create' ? 'Creating Project' : 'Updating Project'}</span>
                    </>              
                  ) : (
                    <>
                      <svg className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path fillRule="evenodd" clipRule="evenodd" d="M6 1C4.34315 1 3 2.34315 3 4V20C3 21.6569 4.34315 23 6 23H18C19.6569 23 21 21.6569 21 20V8.82843C21 8.03278 20.6839 7.26972 20.1213 6.70711L15.2929 1.87868C14.7303 1.31607 13.9672 1 13.1716 1H6ZM5 4C5 3.44772 5.44772 3 6 3H12V8C12 9.10457 12.8954 10 14 10H19V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V4ZM18.5858 8L14 3.41421V8H18.5858Z" fill="currentColor"/>
                      </svg>
                      {mode === 'create' ? 'Create Project' : 'Update Project'}
                    </>
                  )}
                </button>
                <SelectItemModal 
                  isOpen={selectItemModalOpen} 
                  onClose={() => setSelectItemModalOpen(false)} 
                  onSelect={handleAddMembersToProject}
                  items={members}
                  isProjectSelection={false}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
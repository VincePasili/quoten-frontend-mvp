
import Cookies from 'js-cookie'
import CryptoJS from 'crypto-js';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const waitForElement = (selector, timeout = 3000) => 
  new Promise((resolve, reject) => {
    const interval = 100;
    let elapsed = 0;
    const check = () => {
      const el = document.querySelector(selector);
      if (el) resolve(el);
      else {
        elapsed += interval;
        if (elapsed >= timeout) reject(new Error(`Element not found: ${selector}`));
        else setTimeout(check, interval);
      }
    };
    check();
  });

export const retrieveCsrfToken = () => {

  const csrfToken = Cookies.get(process.env.REACT_APP_CSRF_TOKEN_COOKIE_NAME);

  if (!csrfToken) {
      // Redirect to SignIn Page
      window.location.href=process.env.REACT_APP_SIGNIN_ROUTE;
  }

  return csrfToken;
};

export const deleteCSRFToken = () => {
  Cookies.remove(process.env.REACT_APP_CSRF_TOKEN_COOKIE_NAME);
};

const secureFetch = async (url, options = {}) => {
  const response = await fetch(url, {
    credentials: 'include',
    ...options,
  });

  if (response.status === 403) {
    //deleteCSRFToken();
    // window.location.href = process.env.REACT_APP_SIGNIN_ROUTE;
    return; // Prevent further execution
  }

  return response;
};


export const fetchCsrfToken = async () => {
  try {
      const response = await secureFetch(`${process.env.REACT_APP_API_BASE_URL}/csrf-token`, {
          method: 'GET',
          credentials: 'include',
      });

      if (!response.ok) {
          throw new Error('Failed to retrieve CSRF token');
      }

      const { csrf_token } = await response.json();
      return { csrfToken: csrf_token }; // Return as an object
  } catch (error) {
      throw new Error('Failed to retrieve CSRF token');
  }
};

export const fetchTeam = async () => {
  const csrfToken = retrieveCsrfToken();
  const response = await secureFetch(`${process.env.REACT_APP_API_BASE_URL}/team`, {
    methon: 'GET',
    headers: {
      'X-CSRF-Token': csrfToken
    },
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const processTeamMembers = (data) => {
  return data.map(member => ({
    id: member.id,
    first_name: member.first_name,
    last_name: member.last_name,
    name: `${member.first_name} ${member.last_name}`,
    role: member.primary_role,
    other_roles: member.other_roles?.roles || [],
    rate: "$" + member.hourly_rate,
    labour_margin: member.labour_margin + "%",
    billable_rate: "$" + member.billable_rate,
    projects: member.projects?.projects || [],
    project_names: member.projects?.projects.map(project => project.project_name) || [],
    labour_margin_by_project: "$" + member.labour_margin_by_project
  }));
};

export const useTeamMembers = () => {
  const queryKey = ['teamMembers'];

  const { data: members, isLoading, isError, error, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await fetchTeam();
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch team members');
      }
      return processTeamMembers(response.data);
    },
    enabled: false,
  });

  const fetchMembers = () => {
    refetch();
  };

  if (!members) {
    fetchMembers();
  }
    
  return { 
    members, 
    isLoading, 
    isError, 
    error, 
    fetchMembers 
  };
}

// Function to process project data based on the backend response structure
const processProjects = (projects) => {
  return projects.map(project => ({
    id: project.id,
    project_name: project.project_name,
    client_name: project.client_name,
    organisation_id: project.organisation_id,
    quote_version: project.quote_version,
    scope: project.scope,
    team: project.team || [],
    team_size: project.team ? project.team.length : 0
  }));
};

export const useProjects = () => {
  const queryKey = ['projects'];

  const { data: projects, isLoading, isError, error, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await fetchProjects(); 
      if (!response.success) {
        
        throw new Error('Failed to fetch projects');
      }
      return processProjects(response.projects);
    },
    enabled: false,
  });


  const refreshProjects = () => {
    refetch();
  };

  if (!projects) {
    refreshProjects();
  }
    
  return { 
    projects, 
    isLoading, 
    isError, 
    error, 
    refreshProjects
  };
};

export const useSelectedProject = () => {
  const queryClient = useQueryClient();

  const { data: selectedProject, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['selectedProject'],
    queryFn: async () => {
      const currentProject = queryClient.getQueryData(['selectedProject']);
      if (!currentProject) {
        return null;
      }
      return currentProject;
    },
    enabled: false,
  });

  const setSelectedProject = (newData) => {
    queryClient.setQueryData(['selectedProject'], newData);
    refetch();
  };

  const getSelectedProject = () => {
    return queryClient.getQueryData(['selectedProject']) || null;
  };

  return { 
    selectedProject, 
    isLoading, 
    isError, 
    error, 
    setSelectedProject,
    getSelectedProject
  };
};


export const createTeamMember = async (user) => {
  const csrfToken = retrieveCsrfToken();
  const response = await secureFetch(`${process.env.REACT_APP_API_BASE_URL}/team`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken
    },
    body: JSON.stringify(user)
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create user');
  }
  return response.json();
};

export const updateTeamMember = async (user) => {
  const csrfToken = retrieveCsrfToken();
  const response = await secureFetch(`${process.env.REACT_APP_API_BASE_URL}/team`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken
    },
    body: JSON.stringify(user),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to update team member.');
  }

  return response.json();
};

export const useCreateTeamMemberMutation = () => {
  const queryClient = useQueryClient();

  const { mutate: createTeamMemberMutate, isLoading: isCreating, isError, error } = useMutation({
    mutationFn: createTeamMember,
    onSuccess: () => {
      queryClient.invalidateQueries(['teamMembers']);
    },
    onError: (error) => {
      throw new Error('Failed to create team member.');
    },
  });

  return {
    createTeamMemberMutate,
    isCreating,
    isError,
    error
  };
};

export const useUpdateTeamMemberMutation = () => {
  const queryClient = useQueryClient();

  const { mutate: updateTeamMemberMutate, isLoading: isUpdating, isError, error } = useMutation({
    mutationFn: updateTeamMember,
    onSuccess: () => {
      queryClient.invalidateQueries(['teamMembers']);
      
    },
    onError: (error) => {
      throw new Error('Failed to update team member.');
    },
  });

  return {
    updateTeamMemberMutate,
    isUpdating,
    isError,
    error
  };
};


export const fetchQuotes = async () => {
  const csrfToken = retrieveCsrfToken();
  const response = await secureFetch(`${process.env.REACT_APP_API_BASE_URL}/quotes`, {
    method: 'GET',
    headers: {
      'X-CSRF-Token': csrfToken,
    },
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch quotes');
  return response.json();
};

const processQuotes = (quotes) => {
  return quotes.map(quote => ({
    id: quote.id,
    quote_id: quote.quote_id,
    organisation_id: quote.organisation_id,
    project_id: quote.project_id,
    upvotes: quote.upvotes,
    project_name: quote.project_name || 'Unknown',
    client_name: quote.client_name || 'Unknown',
    quote_version: quote.quote_version || 'Unknown'
  }));
};
export const useQuotes = () => {
  const queryClient = useQueryClient();

  const { data: quotes, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['quotes'],
    queryFn: async () => {
        const response = await fetchQuotes(); 
        if (!response.success) {
          throw new Error('Failed to fetch quotes');
        }
        return processQuotes(response.quotes);
    },
    enabled: false, 
  });

  const refreshQuotes = () => {
    refetch();
  };

  const getQuotes = () => {
    return queryClient.getQueryData(['quotes']) || []; 
  };

  if (!quotes) {
    refreshQuotes();
  }

  return { 
    quotes, 
    isLoading, 
    isError, 
    error, 
    refreshQuotes,
    getQuotes
  };
};

export const deleteQuote = async (quoteId) => {
  const csrfToken = retrieveCsrfToken();
  const response = await secureFetch(`${process.env.REACT_APP_API_BASE_URL}/quotes`, {
    method: 'DELETE',
    headers: {
      'X-CSRF-Token': csrfToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ quote_id: quoteId }),
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to delete quote');
  return response.json();
};

export const useDeleteQuoteMutation = () => {
  const queryClient = useQueryClient();

  const { mutate: deleteQuoteMutate, isLoading: isDeleting, isError, error } = useMutation({
    mutationFn: deleteQuote,
    onSuccess:  async () => {
      queryClient.invalidateQueries(['quotes']);
      const response = await fetchQuotes(); 
       if (!response.success) {
         throw new Error('Failed to fetch quotes');
       }

       queryClient.setQueryData(['quotes'], processQuotes(response.quotes));
    },
    onError: (error) => {
      throw new Error('Failed to delete quote.');
    },
  });

  return {
    deleteQuoteMutate,
    isDeleting,
    isError,
    error
  };
};

// Upvote a quote
export const upvoteQuote = async ({quoteId, projectId, quoteVersion, voteType}) => {
  const csrfToken = retrieveCsrfToken();
  const response = await secureFetch(`${process.env.REACT_APP_API_BASE_URL}/quotes`, {
    method: 'PUT',
    headers: {
      'X-CSRF-Token': csrfToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ quote_id: quoteId, project_id: projectId, quote_version: quoteVersion, vote_type: voteType }),
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to upvote quote');
  return response.json();
};

export const useUpvoteQuoteMutation = () => {
  const queryClient = useQueryClient();

  const { mutate: upvoteQuoteMutate, isLoading: isUpvoting, isError, error } = useMutation({
    mutationFn: upvoteQuote,
    onSuccess: () => {
      queryClient.invalidateQueries(['quotes']);
    },
    onError: (error) => {
      throw new Error('Failed to upvote quote.');
    },
  });

  return {
    upvoteQuoteMutate,
    isUpvoting,
    isError,
    error
  };
};

export const deleteUser = async (user) => {
  const csrfToken = retrieveCsrfToken();
  const response = await secureFetch(`${process.env.REACT_APP_API_BASE_URL}/team/archive`, {
    method: 'DELETE',
    headers: {
      'X-CSRF-Token': csrfToken
    },
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Failed to delete user');
  }
  return response.json();
};
//End of dashboard activities


export const formatTimeAgo = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  if (diffInSeconds < 3600) {
    const duration = Math.floor(diffInSeconds / 60);
    return `${duration} minute${duration > 1 ? 's' : ''} ago`;
  }
  if (diffInSeconds < 86400) {
    const duration = Math.floor(diffInSeconds / 3600);
    return `${duration} hour${duration > 1 ? 's' : ''} ago`;
  }
  
  const duration = Math.floor(diffInSeconds / 86400);
  return `${duration} day${duration > 1 ? 's' : ''} ago`;
};

const processNotifications = (notifications) => {
  return notifications.map(notification => ({
    id: notification.id,
    type: notification.type,
    content: notification.content,
    organisation_id: notification.organisation_id,
    scope: notification.scope,
    project_name: notification.project_name,
    project_id: notification.project || 0,
    created_at: formatTimeAgo(new Date(notification.created_at)),
    viewed: notification.viewed,
    quote_id: notification.quote_id || '',
    quote_version: notification.quote_version || ''
  }));
};

export const useNotifications = () => {
  const queryKey = ['notifications'];
  const queryClient = useQueryClient();

  const { data: notifications, isLoading, isError, error, refetch } = useQuery({
    queryKey,
    queryFn:  () => {
      const response = fetchNotifications(); 
        if (!response.success) {
          throw new Error('Failed to fetch notifications');
        }

        return processNotifications(response.notifications);
      
    },
    enabled: false, // Fetch only when explicitly told to
  });

  const refreshNotifications = async () => {
    const response = await fetchNotifications(); 
    if (!response.success) {
      throw new Error('Failed to fetch notifications');
    }
    queryClient.invalidateQueries(['notifications']);
    queryClient.setQueryData(['notifications'], processNotifications(response.notifications));
  };
  
  const getNotifications = () => {
    return queryClient.getQueryData(['notifications']) || []; 
  };

  
  return { 
    notifications, 
    isLoading, 
    isError, 
    error, 
    refreshNotifications,
    getNotifications
  };
};

// Fetch all notifications
export const fetchNotifications = async () => {
  // Retrieve CSRF token for secure API calls
  const csrfToken = retrieveCsrfToken();
  const response = await secureFetch(`${process.env.REACT_APP_API_BASE_URL}/notifications`, {
    method: 'GET',
    headers: {
      'X-CSRF-Token': csrfToken
    },
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch notifications');
  return response.json();
};

// Create a new notification
export const createNotification = async (notificationData) => {
  const csrfToken = retrieveCsrfToken();
  const response = await secureFetch(`${process.env.REACT_APP_API_BASE_URL}/notifications`, {
    method: 'POST',
    headers: {
      'X-CSRF-Token': csrfToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(notificationData),
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to create notification');
  return response.json();
};

// Mark all notifications as viewed
export const updateNotifications = async () => {
  const csrfToken = retrieveCsrfToken();
  const response = await secureFetch(`${process.env.REACT_APP_API_BASE_URL}/notifications`, {
    method: 'PUT',
    headers: {
      'X-CSRF-Token': csrfToken
    },
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to update notifications');
  return response.json();
};

// Delete specified notifications
export const deleteNotifications = async (notificationIds) => {
  const csrfToken = retrieveCsrfToken();
  const response = await secureFetch(`${process.env.REACT_APP_API_BASE_URL}/notifications`, {
    method: 'DELETE',
    headers: {
      'X-CSRF-Token': csrfToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ids: notificationIds }),
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to delete notifications');
  return response.json();
};

export const useDeleteNotificationsMutation = () => {
  const queryClient = useQueryClient();

  const { mutate: deleteNotificationsMutate, isLoading: isDeleting, isError, error } = useMutation({
    mutationFn: deleteNotifications,
    onSuccess: async () => {
      queryClient.invalidateQueries(['notifications']);
      
      queryClient.setQueryData(['notifications'], []);

      const response = await fetchNotifications(); 
      if (!response.success) {
        throw new Error('Failed to fetch notifications');
      }
      queryClient.setQueryData(['notifications'], processNotifications(response.notifications));
    },
    onError: (error) => {
      throw new Error('Failed to delete notifications.');
    },
  });

  return {
    deleteNotificationsMutate,
    isDeleting,
    isError,
    error
  };
};

// Create Notification
export const useCreateNotificationMutation = () => {
  const queryClient = useQueryClient();

  const { mutate: createNotificationMutate, isLoading: isCreating, isError, error } = useMutation({
    mutationFn: createNotification,
    onSuccess: async () => {
      queryClient.invalidateQueries(['notifications']);
      
      const response = await fetchNotifications(); 
      if (!response.success) {
        throw new Error('Failed to fetch notifications');
      }

      queryClient.setQueryData(['notifications'], processNotifications(response.notifications));
    },
    onError: (error) => {
      throw new Error('Failed to create notification.');
    },
  });

  return { createNotificationMutate, isCreating, isError, error };
};

// Update Notifications (Mark as Viewed)
export const useUpdateNotificationsMutation = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: updateNotificationsMutate, isLoading: isUpdating, isError, error } = useMutation({
    mutationFn: updateNotifications,
    onSuccess: async () => {
      queryClient.invalidateQueries(['notifications']);

      const response = await fetchNotifications(); 
      if (!response.success) {
        throw new Error('Failed to fetch notifications');
      }

      queryClient.setQueryData(['notifications'], processNotifications(response.notifications));
    },
    onError: (error) => {
      throw new Error('Failed to update notifications.');
    },
  });

  return { updateNotificationsMutate, isUpdating, isError, error };
};


export const QuoteGenerationStatus = {
  BEGINNING: 'BEGINNING',
  ACTIVE: 'ACTIVE',
  IDLE: 'IDLE'
};

export const useQuoteGenerationStatus = () => {
  const queryClient = useQueryClient();

  // Function to get the current status
  const getQuoteGenerationStatus = () => {
    const currentStatus = queryClient.getQueryData(['quoteGenerationStatus']);
    if (currentStatus === undefined) {
      queryClient.setQueryData(['quoteGenerationStatus'], QuoteGenerationStatus.IDLE);
    }
    return queryClient.getQueryData(['quoteGenerationStatus']);
  };

  // Function to set the status
  const setQuoteGenerationStatus = (status) => {
    if (Object.values(QuoteGenerationStatus).includes(status)) {
      queryClient.setQueryData(['quoteGenerationStatus'], status);
    } else {
      throw new Error('Invalid status. Must be one of ' + Object.values(QuoteGenerationStatus).join(', ') + '.');
    }
  };

  return {
    getQuoteGenerationStatus,
    setQuoteGenerationStatus
  };
};


export const useQuoteText = () => {
  const queryClient = useQueryClient();

  const { data: quoteText, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['quoteText'],
    queryFn: async () => {
      const currentQuoteText = queryClient.getQueryData(['quoteText']);
      if (!currentQuoteText) {
        return ""; // Default to an empty string if no quote text found
      }
      return currentQuoteText;
    },
    enabled: false, // Fetch only when explicitly told to
  });

  const setQuoteText = (newText) => {
    queryClient.setQueryData(['quoteText'], newText);
    refetch(); // Trigger a refetch to update the UI with new text
  };

  const getQuoteText = () => {
    return queryClient.getQueryData(['quoteText']) || "";
  };

  return { 
    quoteText, 
    isLoading, 
    isError, 
    error, 
    setQuoteText,
    getQuoteText
  };
};



export const useGeneratedQuoteId = () => {
  const queryClient = useQueryClient();

  const { data: generatedQuoteId, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['generatedQuoteId'],
    queryFn: async () => {
      const currentQuoteId = queryClient.getQueryData(['generatedQuoteId']);
      if (!currentQuoteId) {
        return null; // Default to null if no quote ID found
      }
      return currentQuoteId;
    },
    enabled: false, // Fetch only when explicitly told to
  });

  const setGeneratedQuoteId = (newId) => {
    queryClient.setQueryData(['generatedQuoteId'], newId);
    refetch(); // Trigger a refetch to update the UI with new ID
  };

  const getGeneratedQuoteId = () => {
    return queryClient.getQueryData(['generatedQuoteId']) || null;
  };

  return { 
    generatedQuoteId, 
    isLoading, 
    isError, 
    error, 
    setGeneratedQuoteId,
    getGeneratedQuoteId
  };
};


export const useQuoteFiles = () => {
  const queryClient = useQueryClient();

  const { data: quoteFiles, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['quoteFiles'],
    queryFn: async () => {
      const currentQuoteFiles = queryClient.getQueryData(['quoteFiles']);
      if (!currentQuoteFiles) {
        return [];
      }
      return currentQuoteFiles;
    },
    enabled: false,
  });

  const setQuoteFiles = (newFiles) => {
    queryClient.setQueryData(['quoteFiles'], newFiles);
    refetch();
  };

  const getQuoteFiles = () => {
    return queryClient.getQueryData(['quoteFiles']) || [];
  };

  const clearQuoteFiles = () => {
    queryClient.setQueryData(['quoteFiles'], []);
    refetch();
  };

  return { 
    quoteFiles, 
    isLoading, 
    isError, 
    error, 
    setQuoteFiles,
    getQuoteFiles,
    clearQuoteFiles
  };
};


export const useAdditionalInfo = () => {
  const queryClient = useQueryClient();

  const { data: additionalInfo = "", isLoading: additionalInfoLoading, isError: additionalInfoError, error: additionalInfoErrorData, refetch: refetchAdditionalInfo } = useQuery({
    queryKey: ['additionalInfo'],
    queryFn: async () => queryClient.getQueryData(['additionalInfo']) || "",
    enabled: false,
  });

  const { data: proposedChanges = "", isLoading: proposedChangesLoading, isError: proposedChangesError, error: proposedChangesErrorData, refetch: refetchProposedChanges } = useQuery({
    queryKey: ['proposedChanges'],
    queryFn: async () => queryClient.getQueryData(['proposedChanges']) || "",
    enabled: false,
  });

  const setAdditionalInfo = (newInfo) => {
    queryClient.setQueryData(['additionalInfo'], newInfo);
    refetchAdditionalInfo();
  };

  const setProposedChanges = (newInfo) => {
    queryClient.setQueryData(['proposedChanges'], newInfo);
    refetchProposedChanges();
  };

  const getAdditionalInfo = () => queryClient.getQueryData(['additionalInfo']) || "";
  const getProposedChanges = () => queryClient.getQueryData(['proposedChanges']) || "";

  const clearQuoteExtraInfo = () => {
    queryClient.setQueryData(['additionalInfo'], "");
    queryClient.setQueryData(['proposedChanges'], "");
  }

  return { 
    additionalInfo, 
    additionalInfoLoading, 
    additionalInfoError, 
    additionalInfoErrorData,
    setAdditionalInfo,
    getAdditionalInfo,
    proposedChanges, 
    proposedChangesLoading, 
    proposedChangesError, 
    proposedChangesErrorData,
    setProposedChanges,
    getProposedChanges,
    clearQuoteExtraInfo
  };
};

//Start of admin sign up and registration features.

export const generateQuoteStream = async (project, quoteFiles, additionalInfo, onChunkReceived) => {
  const csrfToken = retrieveCsrfToken();
  
  const controller = new AbortController(); 
  const signal = controller.signal;        

  const formData = new FormData();
  
  formData.append('project', JSON.stringify(project));

  if (quoteFiles && quoteFiles.length > 0) {
    quoteFiles.forEach(file => {
      formData.append('quoteFiles', file);
    });
  }

  formData.append('additionalInfo', additionalInfo);

  const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/generate_quote`, {
    method: "POST",
    headers: {
      "X-CSRF-Token": csrfToken,
    },
    credentials: "include",
    body: formData,
    signal: signal
  });

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
      const jsonData = await response.json();
      
      if (!jsonData.success)
      {
        throw new Error(jsonData.error || 'Failed to generate PDF');
      }
      return;
  }
 
  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let quoteId = null;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
  
      chunk.split("\n").forEach((line) => {
        if (line.startsWith("data: ")) {
          const data = JSON.parse(line.replace("data: ", ""));
          
          if (data.status === 'quote-id') {
            quoteId = data.text;
            onChunkReceived({ text: '', status: 'quote-id', quoteId }); // Notify that quote ID is received
          } else if (data.status === 'error') {
            onChunkReceived({ text: data.text, status: 'error' });
            controller.abort();
          } else {
            onChunkReceived({
              text: data.text || "",  
              status: data.status || null, 
            });
          }
        }
      });
    }
  }
  catch (error) {
    if (error.name === 'AbortError') {
      //pass
    } 
    else 
    {
      throw error;
    }
  }
  
};


// Generate PDF
export const generatePDF = async (quoteId) => {
  const csrfToken = retrieveCsrfToken();
  const response = await secureFetch(`${process.env.REACT_APP_API_BASE_URL}/generate-pdf`, {
    method: 'POST',
    headers: {
      'X-CSRF-Token': csrfToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      quoteId: quoteId // Send the quoteId to the backend
    }),
    credentials: 'include',
  });

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
      const jsonData = await response.json();
      
      if (!jsonData.success)
      {
        throw new Error(jsonData.error || 'Failed to generate PDF');
      }
      return;
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

export const usePdfUrl = () => {
  const queryClient = useQueryClient();

  const { data: pdfUrl, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['pdfUrl'],
    queryFn: async () => {
      const currentPdfUrl = queryClient.getQueryData(['pdfUrl']);
      return currentPdfUrl || ""; // Default to an empty string if no URL found
    },
    enabled: false, // Fetch only when explicitly told to
  });

  const setPdfUrl = (newUrl) => {
    queryClient.setQueryData(['pdfUrl'], newUrl);
    refetch(); // Trigger a refetch to update the UI with new URL
  };

  const getPdfUrl = () => {
    return queryClient.getQueryData(['pdfUrl']) || "";
  };

  return { 
    pdfUrl, 
    isLoading, 
    isError, 
    error, 
    setPdfUrl,
    getPdfUrl
  };
};



const encryptData = (data) => {
  // Convert the data to a JSON string.
  const dataString = JSON.stringify(data);
  
  // Encrypt the data using AES.
  // CryptoJS will internally generate a salt and use a key derivation method.
  const encrypted = CryptoJS.AES.encrypt(dataString, process.env.REACT_APP_SECRET_KEY).toString();
  
  return encrypted;
};

const processAPIKeys = (data) => {
  return data.api_keys.map(key => ({
    id: key.id,
    name: key.name || '',
    value: key.key,  
    organisation_id: key.organisation_id,
    status: key.status,
    created: new Date(key.created_at).toLocaleString() // Convert to a local string format, adjust as needed
  }));
};

// Fetch all API keys
export const fetchAPIKeys = async () => {
  const csrfToken = retrieveCsrfToken();
  const response = await secureFetch(`${process.env.REACT_APP_API_BASE_URL}/api-keys`, {
    method: 'GET',
    headers: {
      'X-CSRF-Token': csrfToken
    },
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch api keys');
  }

  const data = await response.json();

  const processedAPIKeys = processAPIKeys(data);
  return processedAPIKeys;
};

// Create a new API key
export const createAPIKey = async (apiKeyData) => {
  const csrfToken = retrieveCsrfToken();
  const encryptedData = encryptData({ apiKey: apiKeyData.value, name: apiKeyData.name });

  const response = await secureFetch(`${process.env.REACT_APP_API_BASE_URL}/api-keys`, {
    method: 'POST',
    headers: {
      'X-CSRF-Token': csrfToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ encryptedKey: encryptedData }),
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create API Key.');
  }
  return response.json();
};

// Update an API key
export const updateAPIKey = async ({id, status}) => {
  const csrfToken = retrieveCsrfToken();
  const response = await secureFetch(`${process.env.REACT_APP_API_BASE_URL}/api-keys/${id}`, {
    method: 'PUT',
    headers: {
      'X-CSRF-Token': csrfToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id, status }),
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update API Key.');
  }
  return response.json();
};

// Delete specified API keys
export const deleteAPIKeys = async (apiKeyId) => {
  const csrfToken = retrieveCsrfToken();
  const response = await secureFetch(`${process.env.REACT_APP_API_BASE_URL}/api-keys`, {
    method: 'DELETE',
    headers: {
      'X-CSRF-Token': csrfToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ apiKeyId }),
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to delete API Key.');
  }
  return response.json();
};


// API Keys Query
export const useAPIKeys = () => {
  const queryClient = useQueryClient();
  const { data: apiKeys, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['apiKeys'],
    queryFn: async () => {
      const keys = await fetchAPIKeys(); 
      if (!keys) {
        throw new Error('Failed to fetch API Keys');
      }
      
      return keys;
    },
    enabled: true, 
  });

  const setApiKeys = (newUrl) => {
    queryClient.setQueryData(['apiKeys'], newUrl);
    refetch(); // Trigger a refetch to update the UI with new URL
  };

  const getApiKeys = () => {
    return queryClient.getQueryData(['apiKeys']) || "";
  };

  const clearApiKeys = () => {
    queryClient.setQueryData(['apiKeys'], []);
  }


  return { 
    apiKeys, 
    isLoading, 
    isError, 
    error, 
    setApiKeys,
    getApiKeys,
    clearApiKeys,
    refetch

  };
};

export const useCreateAPIKeyMutation = () => {
  const queryClient = useQueryClient();

  const {
    mutate: createAPIKeyMutate,
    isLoading: isCreating,
    isError,
    error,
  } = useMutation({
    mutationFn: createAPIKey,
    onSuccess: async () => {
      // Invalidate queries so that any cached API keys are refreshed
      queryClient.invalidateQueries(['apiKeys']);
    },
    onError: (error) => {
      throw new Error(error.message || 'Failed to create API key.');
    },
  });

  return {
    createAPIKeyMutate,
    isCreating,
    isError,
    error,
  };
};

// Mutation for updating an API key
export const useUpdateAPIKeyMutation = () => {
  const queryClient = useQueryClient();

  const {
    mutate: updateAPIKeyMutate,
    isLoading: isUpdating,
    isError,
    error,
  } = useMutation({
    mutationFn: updateAPIKey,
    onSuccess: async () => {
      // Invalidate queries so that any cached API keys are refreshed
      queryClient.invalidateQueries(['apiKeys']);
    },
    onError: (error) => {
      throw new Error( error.message || 'Failed to update API key.');
    },
  });

  return {
    updateAPIKeyMutate,
    isUpdating,
    isError,
    error,
  };
};


export const useDeleteAPIKeysMutation = () => {
  const queryClient = useQueryClient();

  const {
    mutate: deleteAPIKeyMutate,
    isLoading: isDeleting,
    isError,
    error,
  } = useMutation({
    mutationFn: deleteAPIKeys, // Ensure this function accepts a single key ID
    onMutate: async (keyId) => {
      await queryClient.cancelQueries(['apiKeys']);
      const previousKeys = queryClient.getQueryData(['apiKeys']);
      queryClient.setQueryData(['apiKeys'], (old) =>
        old ? old.filter((key) => key.id !== keyId) : []
      );
      return { previousKeys };
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['apiKeys']);
    },
    onError: (error, keyId, context) => {
      if (context?.previousKeys) {
        queryClient.setQueryData(['apiKeys'], context.previousKeys);
      }
      throw new Error(error.message || 'Failed to delete API key.');
    },
    onSettled: () => {
      queryClient.invalidateQueries(['apiKeys']);
    },
  });

  return { deleteAPIKeyMutate, isDeleting, isError, error };
};

//Admin registration
export const registerUser = async (user) => {
  const response = await secureFetch(`${process.env.REACT_APP_API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(user)
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to register user');
  }
  return response.json();
};

// Admin Login
export const loginUser = async (user) => {
  try {
    const response = await secureFetch(`${process.env.REACT_APP_API_BASE_URL}/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(errorDetails.error || 'Failed to log in');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};


// Request Password reset
export const requestPasswordReset = async (email) => {
  const response = await secureFetch(`${process.env.REACT_APP_API_BASE_URL}/request_password_reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(email)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to request reset link.');
  }

  return response.json();
};

// Reset password
export const resetPassword = async (values) => {
  const response = await secureFetch(`${process.env.REACT_APP_API_BASE_URL}/reset_password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(values)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to reset password');
  }

  return response.json();
};


// Projects management features
export const fetchProjects = async () => {
  const csrfToken = retrieveCsrfToken();
  const response = await secureFetch(`${process.env.REACT_APP_API_BASE_URL}/projects`, {
    method: 'GET',
    headers: {
      'X-CSRF-Token': csrfToken
    },
    credentials: 'include',
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch projects');
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch projects');
  }

  return data;
};

export const createProject = async (project) => {
  const csrfToken = retrieveCsrfToken();
  const response = await secureFetch(`${process.env.REACT_APP_API_BASE_URL}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken
    },
    credentials: 'include',
    body: JSON.stringify(project)
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create project');
  }
  return response.json();
};

export const updateProject = async (project) => {
  const csrfToken = retrieveCsrfToken();
  const response = await secureFetch(`${process.env.REACT_APP_API_BASE_URL}/projects`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken
    },
    credentials: 'include',
    body: JSON.stringify(project)
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update project');
  }
  return response.json();
};

export const deleteProject = async (project) => {
  const csrfToken = retrieveCsrfToken();
  const response = await secureFetch(`${process.env.REACT_APP_API_BASE_URL}/projects`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken
    },
    credentials: 'include',
    body: JSON.stringify(project)
  });
  if (!response.ok) {
    throw new Error('Failed to delete project');
  }
  return response.json();
};

export const useDeleteProjectMutation = () => {
  const queryClient = useQueryClient();

  const { mutate: deleteProjectMutate, isLoading: isDeleting, isError, error } = useMutation({
    mutationFn: deleteProject,
    onSuccess: async() => {
      queryClient.invalidateQueries(['projects']);
      queryClient.invalidateQueries(['teamMembers']);

      const projects_response = await fetchProjects(); 
       if (!projects_response.success) {
         throw new Error(projects_response.error || 'Failed to fetch projects');
       }

       queryClient.setQueryData(['projects'], processProjects(projects_response.projects));

       const team_response = await fetchTeam(); 
       if (!team_response.success) {
         throw new Error('Failed to fetch team');
       }

       queryClient.setQueryData(['teamMembers'], processTeamMembers(team_response.data));
    },
    onError: (error) => {
      throw new Error(error.message, 'Failed to delete project.');
    },
  });

  return {
    deleteProjectMutate,
    isDeleting,
    isError,
    error
  };
};
// End of project management features

// Google Oauth features
export const checkInternetConnection = () => {
  return new Promise((resolve) => {
    let timeout = setTimeout(() => resolve(false), 3000);

    fetch('https://www.google.com', { method: 'HEAD', mode: 'no-cors' })
      .then(() => {
        clearTimeout(timeout);
        resolve(true);
      })
      .catch(() => {
        clearTimeout(timeout);
        resolve(false);
      });
  });
};

export const googleOAuth = async(accessToken) => {
  const response = await secureFetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/google`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ access_token: accessToken }),
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to authenticate with Google!');
  }
  return response.json();
}
// End of Google Oauth features

export const useUserData = () => {
  const csrfToken = retrieveCsrfToken();
  const queryClient = useQueryClient();

  const { data: userData, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['userData'],
    queryFn: async () => {
      let storedData = queryClient.getQueryData(['userData']) || { name: "", email: "", avatarUrl: null };

      // If essential details are missing, fetch from API
      if (!storedData.name || !storedData.email) {
        try {
          const apiData = await fetchUser();
          storedData = { 
            ...storedData, 
            name: apiData.full_name || storedData.name,
            email: apiData.email || storedData.email 
          };
        } catch {
          throw new Error('Failed to fetch user data');
        }
      }

      // Fetch avatar if missing
      if (!storedData.avatarUrl) {
        try {
          const avatarUrl = await fetchImage('avatar');
          storedData.avatarUrl = avatarUrl;
        } catch {
          storedData.avatarUrl = null;
        }
      }

      return storedData;
    },
    enabled: true, // Runs automatically on mount
  });

  const setUserData = (newData) => {
    const currentData = queryClient.getQueryData(['userData']) || {};
    queryClient.setQueryData(['userData'], { ...currentData, ...newData });
    refetch();
  };

  const clearUserData = () => {
    queryClient.setQueryData(['userData'], []);
  }


  const setName = (name) => setUserData({ name });
  const setEmail = (email) => setUserData({ email });
  const setAvatarUrl = (avatarUrl) => setUserData({ avatarUrl });

  const fetchAndSetAvatar = async () => {
    try {
      const avatarUrl = await fetchImage('avatar');
      setUserData({ avatarUrl });
    } catch {
      setUserData({ avatarUrl: null });
    }
  };

  const getUserData = () => queryClient.getQueryData(['userData']) || { name: "", email: "", avatarUrl: null };

  const refreshUserData = () => refetch();

  return { 
    userData, 
    isLoading, 
    isError, 
    error, 
    setUserData, 
    clearUserData,
    setName, 
    setEmail, 
    setAvatarUrl,
    fetchAndSetAvatar,
    getUserData,
    refreshUserData
  };
};


export const fetchUser = async () => {
  const csrfToken = retrieveCsrfToken();
  const response = await secureFetch(`${process.env.REACT_APP_API_BASE_URL}/user`, {
    method: 'GET',
    headers: {
      'X-CSRF-Token': csrfToken
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch user data');
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch user data');
  }

  return data.user;
};

export const updateUserData = async (fullName, email) => {
  const csrfToken = retrieveCsrfToken();

  const response = await secureFetch(`${process.env.REACT_APP_API_BASE_URL}/user`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken
    },
    body: JSON.stringify({ fullName, email })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to update user data');
  }

  return await response.json();
};

export const changeUserPassword = async (currentPassword, newPassword, confirmPassword) => {
  const csrfToken = retrieveCsrfToken();

  const response = await secureFetch(`${process.env.REACT_APP_API_BASE_URL}/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken
    },
    body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to change password');
  }

  return await response.json();
};




export const uploadImage = async (file, category) => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('category', category); // 'avatar' or 'logo'

  const csrfToken = retrieveCsrfToken();

  const response = await secureFetch(`${process.env.REACT_APP_API_BASE_URL}/images`, {
    method: 'POST',
    headers: {
      'X-CSRF-Token': csrfToken
    },
    body: formData
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to upload image');
  }

  // Convert the file to a data URL
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result); // reader.result is the Data URL
    reader.onerror = reject;
    reader.readAsDataURL(file); // Convert file to data URL
  });
};


export const fetchImage = async (category) => {
  const csrfToken = retrieveCsrfToken();

  try {
    const response = await secureFetch(`${process.env.REACT_APP_API_BASE_URL}/images/${category}`, {
      method: 'GET',
      headers: {
        'X-CSRF-Token': csrfToken,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch image');
    }

   // Convert the response to a Blob
   const blob = await response.blob();

   // Convert Blob to Base64 Data URL
   return new Promise((resolve, reject) => {
     const reader = new FileReader();
     reader.onloadend = () => resolve(reader.result); // Resolve with base64 data URL
     reader.onerror = reject;
     reader.readAsDataURL(blob);
   });

  } catch (error) {
      throw new Error('Failed to fetch image');
  }
};


export const uploadPdf = async (file, category) => {
  const formData = new FormData();
  formData.append('pdf', file);
  formData.append('category', category); // e.g., 'about'

  const csrfToken = retrieveCsrfToken();

  const response = await secureFetch(`${process.env.REACT_APP_API_BASE_URL}/pdfs`, {
    method: 'POST',
    headers: {
      'X-CSRF-Token': csrfToken
    },
    body: formData
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to upload PDF');
  }

  return response.json();
};

export const fetchPdf = async (category) => {
  if (!category) throw new Error("Category is required to fetch a PDF");

  const csrfToken = retrieveCsrfToken();

  try {
    const response = await secureFetch(`${process.env.REACT_APP_API_BASE_URL}/pdfs/${category}`, {
      method: 'GET',
      headers: {
        'X-CSRF-Token': csrfToken,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch PDF for category: ${category}`);
    }

    return await response.blob(); // Return PDF as a Blob
  } catch (error) {
    return null;
  }
};

// Subscription API Functions

export const initiateCheckout = async (tier) => {
  const csrfToken = retrieveCsrfToken();
  const response = await secureFetch(`${process.env.REACT_APP_API_BASE_URL}/subscriptions/checkout`, {
    method: 'POST',
    headers: {
      'X-CSRF-Token': csrfToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tier }),
    credentials: 'include',
  });
  return response.json();
};

export const fetchSubscriptionStatus = async () => {
  const csrfToken = retrieveCsrfToken();
  const response = await secureFetch(`${process.env.REACT_APP_API_BASE_URL}/subscriptions/status`, {
    method: 'GET',
    headers: {
      'X-CSRF-Token': csrfToken,
    },
    credentials: 'include',
  });
  return response.json();
};

export const cancelSubscription = async () => {
  const csrfToken = retrieveCsrfToken();
  const response = await secureFetch(`${process.env.REACT_APP_API_BASE_URL}/subscriptions/cancel`, {
    method: 'POST',
    headers: {
      'X-CSRF-Token': csrfToken,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  return response.json();
};

export const updatePaymentMethod = async () => {
  const csrfToken = retrieveCsrfToken();
  const response = await secureFetch(`${process.env.REACT_APP_API_BASE_URL}/subscriptions/update-payment`, {
    method: 'POST',
    headers: {
      'X-CSRF-Token': csrfToken,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  const data = await response.json();
  
  if (response.ok && data.sessionUrl) {
    window.location.href = data.sessionUrl; // Redirect to Stripe's billing portal
  } else {
    throw new Error(data.error || 'Failed to retrieve billing portal URL.');
  }
};


export const fetchPermissions = async () => {
  const csrfToken = retrieveCsrfToken();
  const response = await secureFetch(`${process.env.REACT_APP_API_BASE_URL}/subscriptions/permissions`, {
    method: 'GET',
    headers: {
      'X-CSRF-Token': csrfToken,
    },
    credentials: 'include',
  });
  return response.json();
};

// Subscription Query Hooks

const formatTimeRemaining = (seconds) => {
  if (seconds <= 0) return '0 minutes';

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`;

  return 'Less than a minute';
};

export const useSubscriptionStatus = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['subscriptionStatus'],
    queryFn: fetchSubscriptionStatus,
    enabled: true,
  });

  return {
    subscription: data?.subscription,
    formattedTimeRemaining: formatTimeRemaining(data?.time_remaining_before_downgrade ?? 0),
    rawTimeRemaining: data?.time_remaining_before_downgrade ?? 0,
    downgraded: data?.downgraded,
    isLoading,
    isError,
    error,
    refetch,
  };
};



export const usePermissions = () => {
  const queryClient = useQueryClient();
  const { data: permissions, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['permissions'],
    queryFn: fetchPermissions,
    enabled: true,
  });

  return { permissions, isLoading, isError, error, refetch };
};

// Subscription Mutation Hooks

export const useInitiateCheckoutMutation = () => {
  const queryClient = useQueryClient();
  const {
    mutate: initiateCheckoutMutate,
    isLoading: isInitiating,
    isError,
    error,
  } = useMutation({
    mutationFn: initiateCheckout,
    onSuccess: (data) => {
      // Redirect to Stripe checkout URL
      window.location.href = data.sessionUrl;
    },
    onError: (error) => {
      throw new Error(error.message || 'Failed to initiate checkout.');
    },
  });

  return { initiateCheckoutMutate, isInitiating, isError, error };
};

export const useCancelSubscriptionMutation = () => {
  const queryClient = useQueryClient();
  const {
    mutate: cancelSubscriptionMutate,
    isLoading: isCancelling,
    isError,
    error,
  } = useMutation({
    mutationFn: cancelSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries(['subscriptionStatus']);
      queryClient.invalidateQueries(['permissions']);
    },
    onError: (error) => {
      throw new Error(error.message || 'Failed to cancel subscription.');
    },
  });

  return { cancelSubscriptionMutate, isCancelling, isError, error };
};

export const useUpdatePaymentMethodMutation = () => {
  const {
    mutate: updatePaymentMethodMutate,
    isLoading: isUpdating,
    isError,
    error,
  } = useMutation({
    mutationFn: updatePaymentMethod,
    onError: (error) => {
      throw new Error(error.message || 'Failed to update payment method.');
    },
  });

  return { updatePaymentMethodMutate, isUpdating, isError, error };
};

export const verifyStripeSession = async (sessionId) => {
  const csrfToken = retrieveCsrfToken();
  try {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/subscriptions/verify-subscription`, {
      method: "POST",
      headers: {
        "X-CSRF-Token": csrfToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ session_id: sessionId }),
      credentials: "include",
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to verify session");
  } catch (error) {
    console.error("Error verifying Stripe session:", error);
  }
};

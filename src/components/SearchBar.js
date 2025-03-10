import React, { useState, useEffect } from 'react';
import { FiSearch, FiXCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { waitForElement } from '../utilities/api'

// Define navigation items with their actions or routes
const navigationItems = [
  { names: ['Dashboard'], route: '/dashboard', type: 'page' },
  { names: ['Team'], route: '/team', type: 'page' },
  { names: ['Quotes'], route: '/quotes', type: 'page' },
  { names: ['Create quote', 'Add Quote'], route: '/dashboard', type: 'page' },
  { names: ['Resources'], route: '/resources', type: 'page' },
  { names: ['Projects'], route: '/projects', type: 'page' },
  { 
    names: ['Subscription', 'Billing', 'Payment', 'Plan', 'Upgrade'], 
    route: '/subscriptions', 
    type: 'page' 
  },
  {
    names: ['Profile', 'Change Password', 'Edit Profile'],
    type: 'action',
    actions: [
      { type: 'navigate', route: '#', delay: 500 },
      { type: 'click', selector: '#user-account-button', timeout: 5000 }
    ]
  },
  {
    names: ['Add Project', 'Create Project', 'New Project'],
    type: 'action',
    actions: [
      { type: 'navigate', route: '/projects', delay: 500 },
      { type: 'click', selector: '#add-project-button', timeout: 5000 }
    ]
  },
  {
    names: ['Terms'],
    type: 'action',
    actions: [
      { type: 'navigate', route: '/legal', delay: 500 },
      { type: 'click', selector: '#terms', timeout: 5000 }
    ]
  },
  {
    names: ['Privacy', 'Policy'],
    type: 'action',
    actions: [
      { type: 'navigate', route: '/legal', delay: 500 },
      { type: 'click', selector: '#privacy', timeout: 5000 }
    ]
  },
  {
    names: ['Add Member', 'Invite Member'],
    type: 'action',
    actions: [
      { type: 'navigate', route: '/team', delay: 500 },
      { type: 'click', selector: '#add-member-button', timeout: 5000 }
    ]
  },
  { 
    names: ['OpenAI API Keys', 'Create Key', 'Company Logo', 'About Us PDF', 'First Page Background', 'Other Pages Background', 'Templates', 'Manage Templates', 'Current Quote Template'], 
    route: '/resources', 
    type: 'page',
    sections: {
      'OpenAI API Keys': 'api-keys',
      'Create Key': 'api-keys',
      'Company Logo': 'quote-customization',
      'About Us PDF': 'quote-customization',
      'First Page Background': 'quote-customization',
      'Other Pages Background': 'quote-customization',
      'Templates': 'templates',
      'Manage Templates': 'templates',
      'Current Quote Template': 'templates'
    }
  },
];


/**
 * Process a series of actions which could be navigation or DOM interactions.
 * @param {Array} actions - Array of action objects to process.
 * @param {Function} navigate - Navigation function from react-router.
 */
const processActions = async (actions, navigate) => {
  for (const action of actions) {
    if (action.type === 'navigate') {
      navigate(action.route);
      await new Promise(resolve => setTimeout(resolve, action.delay || 300));
    } else if (action.type === 'click') {
      try {
        const el = await waitForElement(action.selector, action.timeout);
        el.click();
      } catch (err) {
        console.error('Error in action processing:', err);
      }
    }
  }
};

/**
 * SearchBar component for handling user search functionality with complex actions.
 * @returns {JSX.Element} The search bar UI component with dynamic suggestions.
 */
const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showNoResultsMessage, setShowNoResultsMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        const filtered = navigationItems.flatMap(item => {
          const matchingNames = item.names.filter(name => 
            name.toLowerCase().includes(searchQuery.toLowerCase())
          );
          return matchingNames.length > 0 ? [{ ...item, names: matchingNames }] : [];
        });
        setSearchSuggestions(filtered);
        setIsSearching(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSearchSuggestions([]);
      setIsSearching(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    let noResultsTimer;
    if (!isSearching && searchQuery && searchSuggestions.length === 0) {
      noResultsTimer = setTimeout(() => setShowNoResultsMessage(true), 500);
    } else {
      setShowNoResultsMessage(false);
    }
    return () => clearTimeout(noResultsTimer);
  }, [isSearching, searchQuery, searchSuggestions]);

  const handleSearchInputChange = (e) => setSearchQuery(e.target.value);

  const handleSuggestionClick = async (item) => {
    setSearchQuery('');
    setSearchSuggestions([]);

    if (item.type === 'page' && item.route) {
      if (item.route === '/resources' && item.sections) {
        navigate(item.route);
        setTimeout(() => {
          const sectionId = item.sections[item.names.find(name => item.sections[name])];
          if (sectionId) {
            const element = document.getElementById(sectionId);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        }, 500);
      } else {
        navigate(item.route);
      }
    } else if (item.actions) {
      await processActions(item.actions, navigate);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative flex items-center">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600" />
        <input
          type="text"
          placeholder="Search Quoten"
          value={searchQuery}
          onChange={handleSearchInputChange}
          className="w-full h-8 pl-10 py-2 bg-gray-200 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Search Quoten"
        />
      </div>
      {!isSearching && searchQuery && (
        <div className="absolute z-10 w-full mt-1 max-h-[300px] overflow-y-auto">
          {searchSuggestions.length > 0 ? (
            <ul className="bg-white border border-gray-200 rounded-md shadow-lg">
              {searchSuggestions.map((item, itemIndex) => (
                item.names.map((name, nameIndex) => (
                  <li
                    key={`${itemIndex}-${nameIndex}`}
                    className="text-gray-700 flex items-center w-5/6 px-4 py-2 ml-4 text-sm font-semibold rounded hover:bg-blue-200 hover:text-blue-600 cursor-pointer"
                    onClick={() => handleSuggestionClick(item)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${name}`}
                  >
                    {name}
                  </li>
                ))
              ))}
            </ul>
          ) : (
            showNoResultsMessage && (
              <div className="bg-white border border-gray-200 rounded-md shadow-lg p-3 flex items-center gap-2">
                <FiXCircle className="w-5 h-5 text-red-500" />
                <span className="text-gray-700 text-sm">No results found.</span>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
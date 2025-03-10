import React from 'react';
import LeftPanel from "../components/LeftPanel";
import NavBar from '../components/NavBar'; // Corrected the import name from NavBar to Navbar
import QuotePreparation from '../components/QuotePreparation';
import QuoteGenerator from '../components/QuoteGenerator';
import Team from '../components/Team';
import Projects from '../components/Projects';
import Resources from '../components/Resources';
import SubscriptionDashboard from '../components/SubscriptionDashboard';

const MainLayout = ({ activeComponent = 'Dashboard' }) => {

  const defaultClasses = "h-full";
  const renderActiveComponent = () => {
    let component, additionalClasses;

    switch(activeComponent) {
      case 'Dashboard':
        component = <QuotePreparation />;
        additionalClasses = "flex items-center justify-center";
        break;
      case 'Projects':
        component = <Projects />;
        additionalClasses = "";
        break;
      case 'Team':
        component = <Team />;
        additionalClasses = "";
        break;
      case 'Quotes':
        component = <QuoteGenerator/>;
        additionalClasses = "";
        break;
      case 'Resources':
        component = <Resources />;
        additionalClasses = "";
        break;
      case 'Subscriptions':
        component = <SubscriptionDashboard />;
        additionalClasses = "";
        break;
      default:
        component = null;
        additionalClasses = "";
    }

    return { component, classes: `${defaultClasses} ${additionalClasses}`.trim() };
  };

  const { component, classes } = renderActiveComponent();

  return (
    <div className="grid h-screen grid-rows-[auto,1fr] overflow-x-auto whitespace-nowrap" role="application" aria-label="Main Application Layout" >
      <NavBar className="grid grid-cols-1 sm:grid-cols-3 bg-gray-100 border-b border-gray-300" aria-label="Main Navigation" />

      <div className="grid grid-cols-[1fr,5fr]" role="region" aria-label="Content Area">
        <div className="border-r border-gray-300" role="navigation" aria-label="Sidebar Navigation">
          <LeftPanel />
        </div>   
        <div className={`${classes} overflow-auto`} role="main" aria-label={`${activeComponent} Content`}>
          {component}
        </div>    
      </div>
    </div>
  );
};

export default MainLayout;
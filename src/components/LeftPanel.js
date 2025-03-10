import { NavLink } from "react-router-dom";
import { DashboardIcon, QuotesIcon, ResourcesIcon, TeamIcon, ProjectsIcon, SubscriptionIcon } from "./Icons";
import ProjectModal from "./ProjectModal";

export function LeftPanel() {
  return (
    <nav aria-label="Sidebar with Links" className="h-full w-full bg-gray-100 border-0 text-current">
      <div className="h-full overflow-y-auto overflow-x-hidden rounded px-3" role="navigation">
        <ul className="mt-4 space-y-2">
          {/* Dashboard */}
          <li role="none">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center py-1 px-2 text-sm font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-400 dark:hover:bg-gray-700 ${isActive ? "bg-gray-300 text-dark" : ""}`
              }
              aria-label="Go to Dashboard"
            >
              {({ isActive }) => (
                <>
                  <DashboardIcon className="flex-shrink-0 w-4 h-4 text-gray-950 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"/>
                  <span className="ml-3">Dashboard</span>
                </>
              )}
            </NavLink>
          </li>
            
          {/* Projects */}
          <li role="none">
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                `flex items-center py-1 px-2 text-sm font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-400 dark:hover:bg-gray-700 ${isActive ? "bg-gray-300 text-dark" : ""}`
              }
              aria-label="Go to Projects"
            >
              {({ isActive }) => (
                <>
                  <ProjectsIcon className={"flex-shrink-0 w-4 h-4 text-gray-950 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"}/>
                  <span className="ml-3">Projects</span>
                </>
              )}
            </NavLink>
          </li>
            
          {/* Team */}
          <li role="none">
            <NavLink
              to="/team"
              className={({ isActive }) =>
                `flex items-center py-1 px-2 text-sm font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-400 dark:hover:bg-gray-700 ${isActive ? "bg-gray-300 text-dark" : ""}`
              }
              aria-label="Go to Team"
            >
              {({ isActive }) => (
                <>
                  <TeamIcon className={"flex-shrink-0 w-4 h-4 text-gray-950 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"}/>
                  <span className="ml-3">Team</span>
                </>
              )}
            </NavLink>
          </li>
          
          {/* Quotes */}
          <li role="none">
            <NavLink
              to="/quotes"
              className={({ isActive }) =>
                `flex items-center py-1 px-2 text-sm font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-400 dark:hover:bg-gray-700 ${isActive ? "bg-gray-300 text-dark" : ""}`
              }
              aria-label="Go to Quotes"
            >
              {({ isActive }) => (
                <>
                  <QuotesIcon className={"flex-shrink-0 w-4 h-4 text-gray-950 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"}/>
                  <span className="ml-3">Quotes</span>
                </>
              )}
            </NavLink>
          </li>
          {/* Resources */}
          <li role="none">
            <NavLink
              to="/resources"
              className={({ isActive }) =>
                `flex items-center py-1 px-2 text-sm font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-400 dark:hover:bg-gray-700 ${isActive ? "bg-gray-300 text-dark" : ""}`
              }
              aria-label="Go to Resources"
            >
              {({ isActive }) => (
                <>
                  <ResourcesIcon className="flex-shrink-0 w-4 h-4 text-gray-950 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"/>
                  <span className="ml-3">Resources</span>
                </>
              )}
            </NavLink>
          </li>
          {/* Subscriptions*/}
          {/* <li role="none">
            <NavLink
              to="/subscriptions"
              className={({ isActive }) =>
                `flex items-center py-1 px-2 text-sm font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-400 dark:hover:bg-gray-700 ${isActive ? "bg-gray-300 text-dark" : ""}`
              }
              aria-label="Go to Subscriptions"
            >
              {({ isActive }) => (
                <>
                  <SubscriptionIcon className="flex-shrink-0 w-4 h-4 text-gray-950 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"/>
                  <span className="ml-3">Subscriptions</span>
                </>
              )}
            </NavLink>
          </li> */}
        </ul>
      </div>
    </nav>
  );
}

export default LeftPanel;

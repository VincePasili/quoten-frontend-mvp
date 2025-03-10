import React from "react";

const TeamIcon = ({ className }) => {
    return (
      <svg 
        className={`${className}`}
        viewBox="0 0 32 27"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g transform="translate(0.000000,27.000000) scale(0.100000,-0.100000)" fill="currentColor" stroke="none">
          <path d="M72 224 c-34 -23 -42 -53 -26 -92 12 -28 11 -34 -2 -39 -17 -6 -38 -42 -30 -50 3 -3 17 4 32 16 35 27 93 28 127 1 30 -24 37 -25 37 -5 0 8 -11 22 -25 31 -23 15 -24 18 -10 37 22 31 18 65 -10 92 -28 29 -61 32 -93 9z m76 -26 c25 -25 1 -88 -35 -88 -17 0 -53 36 -53 54 0 37 61 61 88 34z" />
          <path d="M187 233 c-14 -13 -6 -23 17 -23 57 0 75 -60 26 -88 -36 -20 -34 -33 7 -44 17 -4 36 -15 43 -23 16 -19 30 -19 30 0 0 8 -11 22 -24 30 -23 15 -23 18 -10 43 20 38 18 50 -15 83 -28 27 -60 37 -74 22z" />
        </g>
      </svg>
    );
  };

const SubscriptionIcon = ({ className }) => {
    return (
      <svg
        className={`${className}`}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.703 13.456h28.328c1.734 0 3.469 1.734 3.469 3.469v20.234c0 1.734-1.734 3.469-3.469 3.469H8.969c-1.734 0-3.469-1.734-3.469-3.469V13.456c0-2.891.578-3.758 2.891-3.758l24.859-2.313c2.023-.116 2.313.578 2.313 1.445v4.625" />
          <path d="M18.83 34.035c1.334 1 2.668 1.334 5.337 1.334h1.334c2.395 0 4.336-1.941 4.336-4.336s-1.941-4.336-4.336-4.336h-3.002c-2.395 0-4.336-1.941-4.336-4.336s1.941-4.336 4.336-4.336h1.334c3.002 0 4.336.334 5.337 1.334" />
        </g>
      </svg>
    );
  };

const RoleIcon = () => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 17H12M9 9H15M9 13H15M10 2H14M7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}

const TimeIcon = () => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24">
        <title>time / 22 - time, clock, quarter, date, time icon</title>
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
            <g transform="translate(-525.000000, -674.000000)" id="Group" stroke="#000000" strokeWidth="2">
                <g transform="translate(523.000000, 672.000000)" id="Shape">
                    <path d="M12,21 C7.02943725,21 3,16.9705627 3,12 C3,7.02943725 7.02943725,3 12,3 C16.9705627,3 21,7.02943725 21,12 C21,16.9705627 16.9705627,21 12,21 Z">
                    </path>
                    <polyline points="11.9963184 7 12 12.25 6.9951527 12.25">
                    </polyline>
                </g>
            </g>
        </g>
      </svg>
    );
}
const PercentageIcon = ({className}) => {
    return (
        <svg className={`${className || ''}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 19C15.8954 19 15 18.1046 15 17C15 15.8954 15.8954 15 17 15C18.1046 15 19 15.8954 19 17C19 18.1046 18.1046 19 17 19Z" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 9C5.89543 9 5 8.10457 5 7C5 5.89543 5.89543 5 7 5C8.10457 5 9 5.89543 9 7C9 8.10457 8.10457 9 7 9Z" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19 5L5 19" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}
const DollarIcon = ({className}) => {
    return (
        <svg className={`${className || ''}`} viewBox="0 0 24 24" fill="none">
          <path stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.5 10-.035-.139A2.457 2.457 0 0 0 12.082 8h-.522a1.841 1.841 0 0 0-.684 3.55l2.248.9A1.841 1.841 0 0 1 12.44 16h-.521a2.457 2.457 0 0 1-2.384-1.861L9.5 14M12 6v2m0 8v2m9-6a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
        </svg>
    );
}

const GraphIcon = ({className}) => {
    return (
        <svg fill="#000000" className={` ${className || ''}`} viewBox="-2 0 19 19" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.55 15.256H1.45a.554.554 0 0 1-.553-.554V3.168a.554.554 0 1 1 1.108 0v10.98h11.544a.554.554 0 0 1 0 1.108zM3.121 13.02V6.888a.476.476 0 0 1 .475-.475h.786a.476.476 0 0 1 .475.475v6.132zm2.785 0V3.507a.476.476 0 0 1 .475-.475h.786a.476.476 0 0 1 .475.475v9.513zm2.785 0V6.888a.476.476 0 0 1 .475-.475h.786a.476.476 0 0 1 .475.475v6.132zm2.786 0v-2.753a.476.476 0 0 1 .475-.475h.785a.476.476 0 0 1 .475.475v2.753z"/>
        </svg>
    );
}

const MoreIcon = ({ className }) => {
    return (
      <svg 
        className={`h-5 w-5 ${className || ''}`}
        viewBox="0 0 20 20" 
        fill="currentColor"
        aria-label="More items"
      >
        <path fill="#000000" fillRule="evenodd" d="M3 8a2 2 0 100 4 2 2 0 000-4zm5 2a2 2 0 114 0 2 2 0 01-4 0zm7 0a2 2 0 114 0 2 2 0 01-4 0z"/>
      </svg>
    );
  };

const ColoredCircleIcon = ({color}) => {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" className="mr-2" style={{ fill: color }}
        >
          <circle cx="8" cy="8" r="5" />
        </svg>
    );
}

const PlusIcon = () => {
    return (
        <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="hover:cursor-pointer"
            aria-label="Add Field"
        >
            <path d="M6 12H18M12 6V18" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );
}

const ActionsIcon = () => {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="hover:cursor-pointer">
            <path d="M8 12C9.10457 12 10 12.8954 10 14C10 15.1046 9.10457 16 8 16C6.89543 16 6 15.1046 6 14C6 12.8954 6.89543 12 8 12Z" fill="#000000"/>
            <path d="M8 6C9.10457 6 10 6.89543 10 8C10 9.10457 9.10457 10 8 10C6.89543 10 6 9.10457 6 8C6 6.89543 6.89543 6 8 6Z" fill="#000000"/>
            <path d="M10 2C10 0.89543 9.10457 -4.82823e-08 8 0C6.89543 4.82823e-08 6 0.895431 6 2C6 3.10457 6.89543 4 8 4C9.10457 4 10 3.10457 10 2Z" fill="#000000"/>
        </svg>
    );
}

const ScopeIcon = ({ className }) => {
    return (
      <svg 
        className={`w-6 h-6 ${className}`}
        viewBox="0 0 58 59"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g transform="translate(0.000000,59.000000) scale(0.100000,-0.100000)" fill="currentColor" stroke="none">
          <path d="M54 466 c-3 -7 -4 -42 -2 -77 l3 -64 68 -3 67 -3 0 31 c0 24 4 30 23 30 21 0 22 -3 22 -97 l0 -98 40 -5 c35 -4 40 -8 40 -30 0 -24 3 -25 68 -28 l67 -3 0 81 0 81 -67 -3 c-67 -3 -68 -3 -68 -30 1 -23 -4 -28 -22 -28 -22 0 -23 3 -23 80 0 77 1 80 23 80 18 0 23 -5 22 -27 0 -28 1 -28 68 -31 l67 -3 0 81 0 81 -67 -3 c-67 -3 -68 -3 -68 -30 1 -28 0 -28 -62 -28 l-63 0 0 30 0 30 -65 0 c-46 0 -67 -4 -71 -14z m101 -66 c0 -38 -1 -40 -32 -40 -32 0 -33 2 -33 40 0 38 1 40 33 40 31 0 32 -2 32 -40z m260 0 c0 -38 -1 -40 -32 -40 -32 0 -33 2 -33 40 0 38 1 40 33 40 31 0 32 -2 32 -40z m0 -200 c0 -38 -1 -40 -32 -40 -32 0 -33 2 -33 40 0 38 1 40 33 40 31 0 32 -2 32 -40z" />
        </g>
      </svg>
    );
  };
  

const ProjectsIcon = ({ className }) => {
    return (        
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 32 32" 
        strokeWidth="1.5" 
        aria-hidden="true"
        className={`${className}`}
       >
         <path fill="currentColor" stroke="currentColor" d="M28 8.25h-4.25v-3.25c-0.002-1.518-1.232-2.748-2.75-2.75h-10c-1.518 0.002-2.748 1.232-2.75 2.75v3.25h-4.25c-1.518 0.002-2.748 1.232-2.75 2.75v16c0.002 1.518 1.232 2.748 2.75 2.75h24c1.518-0.002 2.748-1.232 2.75-2.75v-16c-0.002-1.518-1.232-2.748-2.75-2.75h-0zM9.75 5c0.001-0.69 0.56-1.249 1.25-1.25h10c0.69 0.001 1.249 0.56 1.25 1.25v3.25h-12.5zM29.25 27c-0.001 0.69-0.56 1.249-1.25 1.25h-24c-0.69-0.001-1.249-0.56-1.25-1.25v-16c0.001-0.69 0.56-1.249 1.25-1.25h24c0.69 0.001 1.249 0.56 1.25 1.25v0z"></path>
       </svg>
    );
}

const QuotesIcon = ({ className }) => {
    return (
      <svg 
        className={`${className}`}
        viewBox="0 0 39 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g transform="translate(0.000000,44.000000) scale(0.100000,-0.100000)" fill="currentColor" stroke="none">
          <path d="M40 380 c-6 -12 -9 -66 -8 -132 3 -98 5 -113 21 -116 15 -3 17 8 17 117 l0 121 100 0 c82 0 100 3 100 15 0 12 -19 15 -110 15 -99 0 -110 -2 -120 -20z" />
          <path d="M106 314 c-12 -30 -7 -259 6 -272 8 -8 49 -12 120 -12 129 0 128 -1 128 122 l0 84 -48 47 -48 47 -76 0 c-60 0 -77 -3 -82 -16z m134 -54 l0 -40 40 0 40 0 0 -80 0 -80 -90 0 -90 0 0 120 0 120 50 0 50 0 0 -40z" />
        </g>
      </svg>
    );
  };

const QuoteIcon = ({ className }) => {
  return (
      <svg 
        className={`${className}`} 
        fill="currentColor" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg" 
        aria-hidden="true"
      >
        <path d="M20.71,6.3l0,0-5-5-.005,0A1.1,1.1,0,0,0,15,1H4A1,1,0,0,0,3,2V22a1,1,0,0,0,1,1H20a1,1,0,0,0,1-1V7A1.081,1.081,0,0,0,20.71,6.3ZM19,21H5V3h9V7a1,1,0,0,0,1,1h4ZM15.707,10.293a1,1,0,0,1,0,1.414l-4,4a1,1,0,0,1-1.347.061l-2-1.666a1,1,0,0,1,1.28-1.537l1.3,1.082,3.355-3.354A1,1,0,0,1,15.707,10.293Z"/>
      </svg>
  );
}

const ResourcesIcon = ({ className }) => {
    return (
      <svg 
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24" strokeWidth="1.5" 
        stroke="currentColor" 
        className={`${className}`}
        aria-hidden="true"
        >
        <path fill="none" stroke="#000000" strokeWidth="2" d="M12,3 L21,7.5 L12,12 L3,7.5 L12,3 Z M16.5,10.25 L21,12.5 L12,17 L3,12.5 L7.5,10.25 L7.5,10.25 M16.5,15.25 L21,17.5 L12,22 L3,17.5 L7.5,15.25 L7.5,15.25"/>
      </svg>
    );
  };

const DashboardIcon = ({ className }) => {
    return (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth="1.5" 
        stroke="currentColor" 
        className={`${className}`}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    );
  };

const ClientIcon = ({ className }) => {
    return (
      <svg 
        className={`${className}`}
        viewBox="0 0 45 43"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g transform="translate(0.000000,43.000000) scale(0.100000,-0.100000)" fill="currentColor" stroke="none">
          <path d="M135 356 c-57 -31 -81 -50 -83 -65 -3 -21 -3 -21 170 -19 150 3 173 5 176 19 2 12 -23 30 -87 63 -49 25 -91 46 -93 46 -1 0 -39 -20 -83 -44z m135 -21 l45 -24 -90 0 -90 0 40 24 c22 14 42 25 45 24 3 0 25 -11 50 -24z" />
          <path d="M90 175 c0 -58 2 -65 20 -65 18 0 20 7 20 65 0 58 -2 65 -20 65 -18 0 -20 -7 -20 -65z" />
          <path d="M200 175 c0 -58 2 -65 20 -65 18 0 20 7 20 65 0 58 -2 65 -20 65 -18 0 -20 -7 -20 -65z" />
          <path d="M310 175 c0 -58 2 -65 20 -65 18 0 20 7 20 65 0 58 -2 65 -20 65 -18 0 -20 -7 -20 -65z" />
          <path d="M50 50 c0 -19 7 -20 175 -20 168 0 175 1 175 20 0 19 -7 20 -175 20 -168 0 -175 -1 -175 -20z" />
        </g>
      </svg>
    );
  };
  
const ThumbsUpIcon = ( { className }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"       
      className={`${className}`}
      aria-hidden="true"
    >
      <path d="M7.3,11.4,10.1,3a.6.6,0,0,1,.8-.3l1,.5a2.6,2.6,0,0,1,1.4,2.3V9.4h6.4a2,2,0,0,1,1.9,2.5l-2,8a2,2,0,0,1-1.9,1.5H4.3a2,2,0,0,1-2-2v-6a2,2,0,0,1,2-2h3v10" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
    </svg>
  );
}

const PDFIcon = ( { className }) => {
  return (
    <svg 
      className={`${className}`}
      fill="white" 
      stroke="blue" 
      strokeWidth="2"  
      version="1.1" 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 482.14 482.14" 
    >
      <g>
	        <path d="M142.024,310.194c0-8.007-5.556-12.782-15.359-12.782c-4.003,0-6.714,0.395-8.132,0.773v25.69
	        	c1.679,0.378,3.743,0.504,6.588,0.504C135.57,324.379,142.024,319.1,142.024,310.194z"/>
	        <path d="M202.709,297.681c-4.39,0-7.227,0.379-8.905,0.772v56.896c1.679,0.394,4.39,0.394,6.841,0.394
	        	c17.809,0.126,29.424-9.677,29.424-30.449C230.195,307.231,219.611,297.681,202.709,297.681z"/>
	        <path d="M315.458,0H121.811c-28.29,0-51.315,23.041-51.315,51.315v189.754h-5.012c-11.418,0-20.678,9.251-20.678,20.679v125.404
	        	c0,11.427,9.259,20.677,20.678,20.677h5.012v22.995c0,28.305,23.025,51.315,51.315,51.315h264.223
	        	c28.272,0,51.3-23.011,51.3-51.315V121.449L315.458,0z M99.053,284.379c6.06-1.024,14.578-1.796,26.579-1.796
	        	c12.128,0,20.772,2.315,26.58,6.965c5.548,4.382,9.292,11.615,9.292,20.127c0,8.51-2.837,15.745-7.999,20.646
	        	c-6.714,6.32-16.643,9.157-28.258,9.157c-2.585,0-4.902-0.128-6.714-0.379v31.096H99.053V284.379z M386.034,450.713H121.811
	        	c-10.954,0-19.874-8.92-19.874-19.889v-22.995h246.31c11.42,0,20.679-9.25,20.679-20.677V261.748
	        	c0-11.428-9.259-20.679-20.679-20.679h-246.31V51.315c0-10.938,8.921-19.858,19.874-19.858l181.89-0.19v67.233
	        	c0,19.638,15.934,35.587,35.587,35.587l65.862-0.189l0.741,296.925C405.891,441.793,396.987,450.713,386.034,450.713z
	        	 M174.065,369.801v-85.422c7.225-1.15,16.642-1.796,26.58-1.796c16.516,0,27.226,2.963,35.618,9.282
	        	c9.031,6.714,14.704,17.416,14.704,32.781c0,16.643-6.06,28.133-14.453,35.224c-9.157,7.612-23.096,11.222-40.125,11.222
	        	C186.191,371.092,178.966,370.446,174.065,369.801z M314.892,319.226v15.996h-31.23v34.973h-19.74v-86.966h53.16v16.122h-33.42
	        	v19.875H314.892z"/>
      </g>
    </svg>
  )
};

const CopyIcon = ({ className }) => {
  return (
    <svg 
      className={`${className}`}
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3 16V4C3 2.89543 3.89543 2 5 2H15M9 22H18C19.1046 22 20 21.1046 20 20V8C20 6.89543 19.1046 6 18 6H9C7.89543 6 7 6.89543 7 8V20C7 21.1046 7.89543 22 9 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
};

const DownloadIcon = ({ className }) => {
  return (
    <svg 
      className={`${className}`}
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path id="Vector" d="M6 21H18M12 3V17M12 17L17 12M12 17L7 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
    </svg>
  )
}

export {TeamIcon, SubscriptionIcon, RoleIcon, TimeIcon, PercentageIcon, DollarIcon, GraphIcon, MoreIcon, ColoredCircleIcon, PlusIcon, ActionsIcon, ScopeIcon, ProjectsIcon, QuotesIcon, QuoteIcon, DashboardIcon, ResourcesIcon, ClientIcon, ThumbsUpIcon, PDFIcon, CopyIcon, DownloadIcon};
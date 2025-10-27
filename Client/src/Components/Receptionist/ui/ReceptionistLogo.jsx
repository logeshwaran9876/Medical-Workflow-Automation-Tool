export default function ReceptionistLogo() {
    return (
      <div className="flex items-center space-x-2">
        {}
        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 text-white" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
        </div>
  
        {}
        <div>
          <h1 className="text-xl font-bold text-gray-800">MediCare</h1>
          <p className="text-xs text-blue-600 font-medium">Reception Desk</p>
        </div>
      </div>
    );
  }
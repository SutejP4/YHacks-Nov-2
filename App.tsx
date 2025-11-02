import React, { useState, useEffect } from 'react';

// Define the structure of a user object based on the Google Sheet columns
interface User {
  id: number;
  name: string;
  email: string;
  imageUrl: string;
  linkedIn: string;
  offer: string[];
  ask: string[];
}

const UserModal: React.FC<{ user: User; onClose: () => void }> = ({ user, onClose }) => {
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-modal-title"
      >
        <div 
          className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-8 max-w-sm w-full relative transform transition-all duration-300 ease-in-out scale-95 animate-fade-in"
          onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
        >
           <button 
             onClick={onClose} 
             className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors text-2xl font-bold"
             aria-label="Close user details"
           >
            &times;
          </button>
          <div className="flex flex-col items-center text-center">
              <img
                src={user.imageUrl.replace('150', '200')} // Larger image for modal
                alt={`Profile picture of ${user.name}`}
                className="w-32 h-32 rounded-full object-cover mb-6 border-4 border-teal-400"
              />
              <h2 id="user-modal-title" className="text-3xl font-bold text-white">{user.name}</h2>
              <p className="text-gray-400 text-md mt-1">{user.email}</p>
              {user.linkedIn && (
                <a 
                  href={user.linkedIn} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="mt-2 text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center"
                  aria-label={`View ${user.name}'s LinkedIn profile`}
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  View LinkedIn Profile
                </a>
              )}
              <div className="border-t border-gray-700 w-full my-6"></div>
              
              {user.offer.length > 0 && (
                  <div className="w-full text-left mb-4">
                      <h3 className="text-lg font-semibold text-white">Offering</h3>
                      <div className="flex flex-wrap justify-start mt-2 gap-2">
                        {user.offer.map((item) => (
                          <span
                            key={item}
                            className="bg-gray-700 text-teal-300 text-sm font-medium px-3 py-1 rounded-full"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                  </div>
              )}

              {user.ask.length > 0 && (
                   <div className="w-full text-left">
                      <h3 className="text-lg font-semibold text-white">Looking For</h3>
                      <div className="flex flex-wrap justify-start mt-2 gap-2">
                        {user.ask.map((item) => (
                          <span
                            key={item}
                            className="bg-gray-700 text-indigo-300 text-sm font-medium px-3 py-1 rounded-full"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                  </div>
              )}
          </div>
        </div>
      </div>
    );
};

const Spinner: React.FC = () => (
    <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-400" role="status" aria-label="Loading"></div>
    </div>
);

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vTXkwex5ZTd1yU3Lzqvl6yqaeBmG3XLXe0FXlnjnsfYaR6-zaQbVNmAVcHcv-63-gWdWDNH2fP7GS1M/pub?output=csv');
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const csvText = await response.text();
        
        const rows = csvText.trim().split('\n').slice(1); // remove header row
        const parsedUsers: User[] = rows.map((row, index) => {
          // Regex to split CSV row, handling quoted fields.
          const columns = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
          
          // Headers: First name, Last name, Email, LinkedIn, Image, Offer, Ask
          if (columns.length < 7) {
            console.warn(`Skipping malformed row ${index + 2}:`, row);
            return null;
          }

          const cleanColumn = (col: string): string => {
            let value = col || '';
            // Remove surrounding quotes if they exist
            if (value.startsWith('"') && value.endsWith('"')) {
              value = value.slice(1, -1);
            }
            return value.trim();
          };
          
          const firstName = cleanColumn(columns[0]);
          const lastName = cleanColumn(columns[1]);
          const email = cleanColumn(columns[2]);
          const linkedIn = cleanColumn(columns[3]);
          const imageUrl = cleanColumn(columns[4]);
          const offer = cleanColumn(columns[5]);
          const ask = cleanColumn(columns[6]);
          
          // Basic validation to ensure essential data is present
          if (!firstName || !lastName || !email || !imageUrl) {
            console.warn(`Skipping incomplete user data at row ${index + 2}:`, row);
            return null;
          }

          return {
            id: index, // Use row index for a stable ID
            name: `${firstName} ${lastName}`,
            email: email,
            imageUrl: imageUrl,
            linkedIn: linkedIn,
            offer: offer.split(';').map(i => i.trim()).filter(Boolean),
            ask: ask.split(';').map(i => i.trim()).filter(Boolean),
          };
        }).filter((user): user is User => user !== null); // Type guard to filter out nulls

        setUsers(parsedUsers);
      } catch (e) {
        if (e instanceof Error) {
            setError(`Failed to fetch user data: ${e.message}`);
        } else {
            setError('An unknown error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const renderContent = () => {
    if (loading) {
      return <Spinner />;
    }

    if (error) {
      return (
        <div className="flex justify-center items-center h-64 bg-red-900 bg-opacity-30 rounded-lg">
          <p className="text-xl text-red-400">{error}</p>
        </div>
      );
    }
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 flex flex-col items-center text-center transform hover:scale-105 hover:shadow-cyan-500/20 transition-all duration-300 cursor-pointer"
              aria-label={`View details for ${user.name}`}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedUser(user)}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedUser(user)}
            >
              <img
                src={user.imageUrl}
                alt={`Profile picture of ${user.name}`}
                className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-gray-600"
              />
              <h2 className="text-xl font-bold text-white">{user.name}</h2>
              <p className="text-gray-400 text-sm mt-1">{user.email}</p>
            </div>
          ))}
        </div>
    );
  };


  return (
    <main className="bg-gray-900 text-white min-h-screen font-sans p-8">
      <div className="container mx-auto">
        <header className="text-center mb-12">
            <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500 pb-2">
            User Directory
            </h1>
            <p className="mt-4 text-lg text-gray-400">
            A directory of our talented team members.
            </p>
        </header>
        {renderContent()}
      </div>
      {selectedUser && <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
    </main>
  );
};

export default App;

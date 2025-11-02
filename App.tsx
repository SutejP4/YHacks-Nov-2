import React, { useState } from 'react';

// Define the structure of a user object
interface User {
  id: number;
  name: string;
  email: string;
  imageUrl: string;
  interests: string[];
}

// Mock data for the user directory
const users: User[] = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice.j@example.com',
    imageUrl: 'https://i.pravatar.cc/150?u=alice.j@example.com',
    interests: ['Photography', 'Hiking', 'Reading'],
  },
  {
    id: 2,
    name: 'Bob Williams',
    email: 'bob.w@example.com',
    imageUrl: 'https://i.pravatar.cc/150?u=bob.w@example.com',
    interests: ['Cooking', 'Gaming', 'Jazz Music'],
  },
  {
    id: 3,
    name: 'Charlie Brown',
    email: 'charlie.b@example.com',
    imageUrl: 'https://i.pravatar.cc/150?u=charlie.b@example.com',
    interests: ['Painting', 'Traveling', 'History'],
  },
  {
    id: 4,
    name: 'Diana Miller',
    email: 'diana.m@example.com',
    imageUrl: 'https://i.pravatar.cc/150?u=diana.m@example.com',
    interests: ['Yoga', 'Meditation', 'Writing'],
  },
  {
    id: 5,
    name: 'Ethan Davis',
    email: 'ethan.d@example.com',
    imageUrl: 'https://i.pravatar.cc/150?u=ethan.d@example.com',
    interests: ['Coding', 'Robotics', 'Sci-Fi Movies'],
  },
  {
    id: 6,
    name: 'Fiona Garcia',
    email: 'fiona.g@example.com',
    imageUrl: 'https://i.pravatar.cc/150?u=fiona.g@example.com',
    interests: ['Dancing', 'Gardening', 'Baking'],
  },
];

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
          className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-8 max-w-sm w-full relative transform transition-all duration-300 ease-in-out scale-95"
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
              <div className="border-t border-gray-700 w-full my-6"></div>
              <h3 className="text-lg font-semibold text-white self-start">Interests</h3>
              <div className="flex flex-wrap justify-center mt-3 gap-2">
                {user.interests.map((interest) => (
                  <span
                    key={interest}
                    className="bg-gray-700 text-teal-300 text-sm font-medium px-3 py-1 rounded-full"
                  >
                    {interest}
                  </span>
                ))}
              </div>
          </div>
        </div>
      </div>
    );
};


const App: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 flex flex-col items-center text-center transform hover:scale-105 hover:shadow-cyan-500/20 transition-all duration-300 cursor-pointer"
              aria-label={`View details for ${user.name}`}
              role="button"
              onClick={() => setSelectedUser(user)}
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
      </div>
      {selectedUser && <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
    </main>
  );
};

export default App;

import { useState } from 'react'
import { useEffect } from 'react'
import viteLogo from '/public/vite.svg'
import reactLogo from '/src/assets/react.svg'
import './Home.css'
import '/src/App.css'


function Home() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('http://127.0.0.1:5000/api/users');
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : (data.users ?? []));
    };
    fetchUsers();
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <h2>Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.name}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
export default Home
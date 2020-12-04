import React, { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  // load existing blogs
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    );
  }, []);

  // check if user has already logged in once
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser');

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log('logging in with', username, password);

    try {
      const user = await loginService.login({ username, password });

      // persist login information https://developer.mozilla.org/en-US/docs/Web/API/Storage
      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user));

      blogService.setToken(user.token);

      setUser(user);
      setUsername('');
      setPassword('');
    } catch (e) {
      setErrorMessage('Wrong Credentials');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  return (
    <div>
      {user === null
        ? <div>
          <h2>Log in to application</h2>
          {loginForm()}
        </div>
        : <div>
          <h2>blogs</h2>
          {user.name} logged in
          <button onClick={() => window.localStorage.removeItem('loggedBloglistUser')}>logout</button>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog}/>
          )}
        </div>
      }
    </div>
  );
};

export default App;

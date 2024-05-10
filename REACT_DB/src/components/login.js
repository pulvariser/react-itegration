// Login.js
import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data)
        onLogin(data.token); 
      } else {
        
        throw new Error('Authentication failed. Please check your credentials.');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;



// import React from 'react'

// const login = () => {
//   return (
//     <div>
//          <form method="post" action="http://localhost:5000/login">

// <fieldset>
//   <legend>Personal details:</legend>
//   <label htmlFor="fname">Username:</label><br/>
//   <input type="text" id="fname" name="username" /><br/>
//   <label htmlFor="lname">Password: </label><br/>
//   <input type="password" id="lname" name="password" /><br/><br/>
// </fieldset>

// <input type="reset"/><br/>
// <input type="submit" value="Submit"/>
// </form> 
//     </div>
//   )
// }

// export default login



















// import React from 'react'

// const Login = () => {
//   return (
//     <div className='loginForm'>
//           <form action=''>
//              <label for="userName">Fullname:</label>
//              <input type='text' placeholder='Enter your Name' name='name' id='userName'/>

//              <label for="email">Email:</label>
//              <input type='email' placeholder='Enter your Email' name='name' id='email'/>\

//              <label for="password">password</label>
//              <input type='text' placeholder='Enter your Password' name='name' id='password'/>

//              <input type='submit' value="Submit"/>
//              <input type='reset' value='Reset'/>
//           </form>
//     </div>
//   )
// }

// export default Login;

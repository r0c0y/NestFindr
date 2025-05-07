import React from 'react';

const Signup = () => {
  return (
    <div>
      <h2>Sign Up</h2>
      <form>
        <input type="email" placeholder="Email" /><br />
        <input type="password" placeholder="Password" /><br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Signup;

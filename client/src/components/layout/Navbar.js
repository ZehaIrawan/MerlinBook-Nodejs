import React from 'react';
import {Link} from 'react-router-dom';

const Navbar = () => {
  return (
    <li className='navbar bg-dark'>
      <h1>
        <Link to='/'>
          <i className='fas fa-code' /> Merlinbook
        </Link>
      </h1>
      <ul>
        <li>
          <Link to='/profiles'>Developers</Link>
        </li>
        <li>
          <Link to='/register'>Register</Link>
        </li>
        <li>
          <Link to='/login'>Login</Link>
        </li>
      </ul>
    </li>
  );
};

export default Navbar;

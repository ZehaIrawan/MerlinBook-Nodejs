import axios from 'axios';

import { REGISTER_SUCCESS, REGISTER_FAIL } from '../actions/types';

//Register User
export const register = ({ name, email, password}) => async dispatch => {
     const config = {
         headers: {
             'Content-Type':'application/json'
         }
     }
}
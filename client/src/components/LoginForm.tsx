import React from 'react';
import { Context } from '..';
import { observer } from 'mobx-react-lite';


const LoginForm: React.FC = () => {
   const { store } = React.useContext(Context);
   const [userData, setUserData] = React.useState({
      email: '',
      password: ''
   });
   const { email, password } = userData;

   return (
      <div style={{
         display: 'flex',
         flexDirection: 'column',
         justifyContent: 'center',
      }}>
            <input type="email" placeholder="Email" value={ email } onChange={(e) => setUserData({ ...userData, email: e.target.value })} />
            <input type="password" placeholder="Password" value={ password} onChange={(e) => setUserData({ ...userData, password: e.target.value })} />
            <button onClick={() => store.login(email, password)} >Login</button>
            <button onClick={() => store.registration(email, password)} >Registration</button>
      </div>
   );

}

export default observer(LoginForm);

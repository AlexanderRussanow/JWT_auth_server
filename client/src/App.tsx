import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Context } from '.';
import LoginForm from './components/LoginForm';

const App = () => {
  const { store } = React.useContext(Context);
  
  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
    store.checkAuth()
    };
  }, [])
  
  return (
    <div
      style={ {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
      } }>
      {store.isLoading ? (
          <div>Loading...</div>
      ) : (
          <div>
              <h3>{store.isAuth ? `Hello ${ store.user.email }` : 'SignIn or SingUp'}</h3>
              {store.isAuth ? <button onClick={ store.logout }>Logout</button> : <LoginForm />}
          </div>
      )}
  </div>
  )
}

export default observer(App);

import {useState, useRef, useContext, FormEvent} from 'react';
import { TextInput, View, Button, Text } from 'react-native-web';

// import {useHistory} from 'react-router-dom';

// import AuthContext from '../../store/auth-context';
import classes from './AuthForm.module.css';

const AuthForm = () => {
  //   const history = useHistory();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  //   const authCtx = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin(prevState => !prevState);
  };

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const enteredEmail = emailInputRef?.current.value;
    const enteredPassword = passwordInputRef?.current.value;

    setIsLoading(true);
    let url;
    if (isLogin) {
      url =
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAdjZ0gY9D8b9CputNQr3Sq8Nhii5PJzIg';
    } else {
      url =
        'https://';
    }
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        setIsLoading(false);
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then(data => {
            let errorMessage = 'Authentication failed!';
            // if (data && data.error && data.error.message) {
            //   errorMessage = data.error.message;
            // }

            throw new Error(errorMessage);
          });
        }
      })
      .then(data => {
        const expirationTime = new Date(
          new Date().getTime() + +data.expiresIn * 1000,
        );
        // authCtx.login(data.idToken, expirationTime.toISOString());
        // history.replace('/');
      })
      .catch(err => {
        alert(err.message);
      });
  };

  return (
    <View className={classes.auth}>
      <Text>{isLogin ? 'Login' : 'Sign Up'}</Text>
      <form onSubmit={submitHandler}>
        <View className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </View>
        <View className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <TextInput
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </View>
        <View className={classes.actions}>
          {!isLoading && (
            <Button>{isLogin ? 'Login' : 'Create Account'}</Button>
          )}
          {isLoading && <p>Sending request...</p>}
          <Button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}>
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </Button>
        </View>
      </form>
    </View>
  );
};

export default AuthForm;

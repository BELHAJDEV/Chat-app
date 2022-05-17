import React,{useState,useEffect} from 'react';
import './welcome.css';
import img from '../../images/home-img.svg';
import {signInWithPopup, GoogleAuthProvider,onAuthStateChanged,signOut} from "firebase/auth";
import auth from '../../Firebase';
import { useNavigate } from 'react-router-dom';


const Welcome = () => {
  const navigate = useNavigate();
  const [isAuth,setIsAuth] = useState(false);
  const [user,setUser] = useState({});

  useEffect(()=> {
    getUser();
  },[])
  const getUser = ()=> {
    onAuthStateChanged(auth, (user) => {
    if (user) {
        setUser(user);
        setIsAuth(true);
        navigate('/Home');

    } else {
      setIsAuth(false);
      navigate('/');

    }
  });
  }
  const signIn = () => {
      const provider = new GoogleAuthProvider();
          signInWithPopup(auth, provider)
          .then(res => {
              setUser(res.user);
              setIsAuth(true);
              navigate('/Home');
          })
          .catch(err => {
            navigate('/');
          })
  }

  return (
    
    
    <div className='welcome_container'>
        <div className="title">
            
            <h1>Get The Conversations <br /> Started .</h1>
            <div className="sign_btn" onClick={()=> {
              if(isAuth){
                navigate('/Home');
                
              }else{
                navigate('/');
                signIn();
              }
            }}>START <i className="fa-solid fa-right-long"></i></div>
        </div>
        <div className="image">
            <img src={img} alt="" />
        </div>
    </div>
    
  )
}

export default Welcome
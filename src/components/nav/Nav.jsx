import React,{ useState,useEffect } from 'react';
import './nav.css';
import logo from '../../images/logo.png';
import img from '../../images/user.jpg';
import {signInWithPopup, GoogleAuthProvider,onAuthStateChanged,signOut} from "firebase/auth";
import auth from '../../Firebase';
import Avatar from '@mui/material/Avatar';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { userActions } from '../../store/user';
import { messageActions } from '../../store/message';


import axios from 'axios';




const Nav = () => {
    const theUser = useSelector((state)=> state.userReducer.user);
    const DATA = useSelector((state)=> state.messageReducer.data);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isAuth,setIsAuth] = useState(false);
    const [openSearch,setOpenSearch] = useState(false);
    const [user,setUser] = useState({});
    const [openSidebar,setOpenSideBar] = useState(false);
    const [openSend,setOpenSend] = useState(false)
    const [searchText,setSearchText] = useState('');
    const [myusers,setMyUsers] = useState([]);
    const [currentRes,setCurrentRes] = useState({});
    const [text,setText] = useState('');

    useEffect(()=> {
      getUser();
    },[])

    useEffect(()=> {
    
        setUsers(searchText);

      
    },[searchText])
    const getUser = ()=> {
      onAuthStateChanged(auth, (authuser) => {
      if (authuser) {
          setUser(authuser);
          dispatch(userActions.SET(
            {
              displayName : authuser.displayName,
              userId : authuser.uid,
              photoURL : authuser.photoURL,
              email : authuser.email
            }
            ));
            LogUser({
              username : authuser.displayName,
              userId : authuser.uid,
              image : authuser.photoURL,
              email : authuser.email
            })
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
    const signout = ()=>{
    signOut(auth)
    .then(()=> {
        setIsAuth(false);
        dispatch(userActions.SET({}));
    })
    .catch(err => console.log(err))
  }
    const LogUser = async(us_er) => {
      // await axios.post('http://localhost:4000/api/users',us_er);
      await axios.post(`${process.env.REACT_APP_URL}/api/users`,us_er);
      
    }  

    const setUsers = async(n)=> {
      if(n === ''){
        setMyUsers([]);
      }else{
        const res = await axios.get(`${process.env.REACT_APP_URL}/api/users/${n}`);
        
        setMyUsers(res.data);

        
      }
      
    }


    const Send = async(e) => {
      e.preventDefault();

      let msg = {
        senderImage : theUser.photoURL,
        senderId : theUser.userId,
        senderName : theUser.displayName,
        receiverId : currentRes.id,
        receiverName : currentRes.username,
        text,
        date : Date.now()
      }
      

      const res = await axios.post(`${process.env.REACT_APP_URL}/api/messages`,msg);

      
      dispatch(messageActions.ADD(res.data));
      setText('');
      setOpenSend(false);
      dispatch(userActions.SET_MODEL());

    }
  return (
    <div className='navbar_container'>
      
      <div className="logo">
        <img src={logo} alt="" />
      </div>
      {!isAuth ? (
      <div className="is-not-auth">
        <span>About</span>
        <button onClick={(e)=> {
        e.preventDefault();
        signIn();
        }}>Sign up</button>
      </div>
      ):(
      <div className="is-auth">
      <i 
      className="fa-solid fa-magnifying-glass"
      onClick={()=> {
        setOpenSearch(!openSearch);
        dispatch(userActions.SET_MODEL());
      }}
      />
      {/* <i className={DATA.length === 0 ?"fa-solid fa-bell" : "fa-solid fa-bell notif"} */}
      
      {/* /> */}
      <i className="fa-solid fa-arrow-right-from-bracket"
      onClick={signout}
      ></i>
      <Avatar 
          className='avatar' 
          alt={user.displayName.toUpperCase()} 
          src={user && user.photoURL} 
          onClick={()=> {
            setOpenSideBar(!openSidebar);
            dispatch(userActions.SET_MODEL());

          }}  
          // sx={{ width: 56, height: 56 }}
      />
      </div>
      )}
      
      
      <div className= {!openSearch ? "search-zone of" : "search-zone on"}>

          <div className="search-bar">
            <form action="">
              <input type="text" placeholder='Search...'
                value={searchText}
                onChange={ (e) => setSearchText(e.target.value)}
              />
              <button>Search</button>
            </form>
          </div>
          {myusers.length !== 0 ? (
            <div className="users">
              {myusers.map((u,i)=> {
                return (
                  <div className='user' key={i}>
                  <div>
                    {u.image ? (
                    <Avatar alt={u.username} src={u.image && u.image} />

                    ):(
                      <Avatar alt={u.username} />

                    )}
                    <span>{u.username}</span>
                  
                  </div>
                      <i className="fa-solid fa-paper-plane"
                      
                      onClick={()=> {
                        setCurrentRes({
                          id : u.userId,
                          username : u.username,              
                        })
                        setOpenSend(true);
                        setOpenSearch(false);
                      }}></i>
                  </div>
                )
              })}
            </div>
          ):(
            <div className='no_results'>No results</div>
          )}

          
      </div>
      <div className= {!openSidebar ? "sidebar of" : "sidebar on"}>
        <h3>{user.displayName}</h3>
        <i className='fas fa-times'
        onClick={()=> {
          setOpenSideBar(false);
          dispatch(userActions.SET_MODEL());

        }}

        />
        <span className="home">Home</span>
        <span className="home">Setings</span>
        <span className="signout_btn" onClick={signout}>
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            <h4>Sign out</h4>
        </span>
      </div>

      <div className={ !openSend ? "send_zone of" : "send_zone on"}>
        <span
        onClick={()=> {
          setOpenSend(false);
          dispatch(userActions.SET_MODEL());

        }}
        ><i className='fas fa-times'></i></span>
        <header>To <span>{currentRes.id && currentRes.username}</span></header>
        <form action="" onSubmit={Send}>
          <input type="text" 
          value={text}
          placeholder='Type a message...'
          onChange={(e)=> setText(e.target.value)} />
          <button type="submit">
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  )
}

export default Nav
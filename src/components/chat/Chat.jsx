import React,{useState,useEffect} from 'react';
import './chat.css';
import Avatar from '@mui/material/Avatar';
import { useNavigate,useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { messageActions } from '../../store/message';
import axios from 'axios';

const Chat = () => {
    let { id }  = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const CHAT = useSelector((state)=> state.messageReducer.chat);
    const theUser = useSelector((state)=> state.userReducer.user);
    const [contact,setContact] = useState({});
    const [text,setText] = useState('');
    const [lastSeen,setLastSeen] = useState('');
    // const [messages,setMessages] = useState([]);
    const [myChat,setMyChat] = useState([]);

    

    const getContact = async(i) => {
        const res = await axios.get('https://messaging-my-app.herokuapp.com/api/users/user/' + i);

        setContact(res.data);
    }
    

    useEffect(()=> {
        if(id) {
            getContact(id);
            // scroling();
        }
        
    },[id])

    useEffect(()=> {
        scroling();
    },[])

    const set_chat = async()=> {
        const res = await axios.post('https://messaging-my-app.herokuapp.com/api/messages/chat',{
            idTwo : theUser.userId,
            idOne : id
        });
        dispatch(messageActions.SET_CHAT(res.data));
        setMyChat(res.data);
        console.log(res.data)


    }
    useEffect(()=> {
        if(id) {
            set_chat();
            // scroling();
        }
    },[id,myChat]);

    const SEND = async(e) => {
        e.preventDefault();
        let msg = {
            senderImage: theUser.photoURL,
            senderId : theUser.userId,
            senderName : theUser.displayName,
            receiverId : id,
            receiverName : contact.username,
            text,
            date : Date.now()
        }
        const res = await axios.post('https://messaging-my-app.herokuapp.com/api/messages',msg);
        dispatch(messageActions.ADD(res.data));
       scroling();
        setText('');
    }

    const getTime = async(i) => {
        const res = await axios.get('https://messaging-my-app.herokuapp.com/api/messages/'+ i);

        let date = new Date(res.data);

        let year = date.getFullYear();
        let month = date.getMonth() +1;
        let day = date.getDate();
        let hour = date.getHours();
        let minute = date.getMinutes();
    
        // setLastSeen(day + '/' + month + + ' at ' + hour + ' : ' + minute);
        setLastSeen(`${day}-${month}-${year} at ${hour}:${minute}`);

    }

    useEffect(()=> {
        getTime(id);
    },[id]);

    const scroling = () => {
        const myDiv = document.getElementById('chat');

        myDiv.scrollTop = myDiv.scrollHeight;
    }
  return (
    <div className="chat" id='chat'>
            <footer>
                <div className="imojies" onClick={()=> {
                    setText(text + '😃');
                }}>
                    <i className="fa-solid fa-face-grin-wide"></i>
                </div>
                <form action="" onSubmit={SEND}>
                    <input type="text" 
                    placeholder='Type a message...'
                    value={text}
                    onChange={ (e) => setText(e.target.value)} />
                    <button type='submit'>
                        <i className="fa-solid fa-paper-plane"></i>
                    </button>
                </form>
            </footer>
            <div className="user_chat">
            <i className="fa-solid fa-arrow-left"
            onClick={()=> navigate('/Home')}
            ></i>
                <Avatar 
                src={contact.image}
                // sx={{ width: 56, height: 56 }}

                />
                <div className="name_date">
                    <h3>{contact.username}</h3>
                    <span>Last seen {lastSeen}</span>
                </div>
            </div>
            {CHAT.map((chat,index)=> {
                return (
                    <div className={chat.senderName === theUser.displayName ? "msg me" : "msg he"} key={index}>
                        <div className="text">{chat.text}</div>
                        <span>{new Date(chat.date).getHours()}:{new Date(chat.date).getMinutes()}</span>
                    
                    </div>
                )
            })}
        </div>
  )
}

export default Chat
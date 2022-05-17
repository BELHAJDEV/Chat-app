import React,{useEffect,useMemo,useState} from 'react';
import './home.css';
import Avatar from '@mui/material/Avatar';
import { useNavigate ,useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { messageActions } from '../../store/message';
import axios from 'axios';


const Home = () => {
    const [myChat,setMyChat] = useState([]);
    const [chatID,setChatId] = useState('');
    const [name,setName] = useState('');
    const [text,setText] = useState('');
    const navigate = useNavigate();
    const inbox = useSelector((state)=> state.messageReducer.inbox);
    const DATA = useSelector((state)=> state.messageReducer.data);
    const CHAT = useSelector((state)=> state.messageReducer.chat);
    let id = '';
    let n = '';
    if( DATA.length !== 0) {
        id = DATA[0].senderId;
        n = DATA[0].senderName;
        

    }
    const theUser = useSelector((state)=> state.userReducer.user);
    const model = useSelector((state)=> state.userReducer.model);
    

    useEffect(()=> {
        setChatId(id);
        setName(n);
    },[n,id])

    

    const set_chat = async()=> {
        const res = await axios.post(`${process.env.REACT_APP_URL}/api/messages/chat`,{
            idTwo : theUser.userId,
            idOne : chatID
        });
        dispatch(messageActions.SET_CHAT(res.data));
        setMyChat(res.data);
   
    }
    useEffect(()=> {
        if(chatID) {
            set_chat();
            // scroling();
        }
    },[chatID,myChat]);

    const scroling = () => {
        const myDiv = document.getElementById('chat');

        myDiv.scrollTop = myDiv.scrollHeight;
    }



    const dispatch = useDispatch();
    

    let clients = inbox.map( (e) => {
            return e.senderName}
    );

    let senders = [...new Set(clients)];
    
    let newData = [];

    const getData = ()=> {
        let messages = [];
        let senderId = '';
        let photoUrl = '';

        senders.forEach( ( s )=> {
            messages = [];
            inbox.forEach( d => {
                if(d.senderName === s) {
                    senderId = d.senderId;
                    photoUrl = d.senderImage;
                    messages.unshift(d.text);
                }
            });
            newData.push({
                photoUrl,
                senderId,
                senderName : s,
                messages,

            });
            
        })

        // console.log(newData);

        dispatch(messageActions.SETDATA(newData));
        
        

    }
    
    useEffect(()=> {
        // ? here we get the inbox in the chat-sidebar
        getData();

    },[inbox])


    const get_msgs = async() =>{
        const res = await axios.get(`${process.env.REACT_APP_URL}/api/messages`);
        // console.log(res.data);
        dispatch(messageActions.SET_MESSAGES(res.data));

    }

    const get_inbox = async() => {
        const res = await axios.post(`${process.env.REACT_APP_URL}/api/messages/inbox`,{id : theUser.userId});
        // console.log(res.data);
        dispatch(messageActions.SET_INBOX(res.data));
    }
    useEffect(()=> { 
        if(theUser.userId) {
            get_inbox();
            // console.log(Date.now().toDate().toUTCString())
        }
    } ,[inbox,theUser.userId]);

    useEffect(()=> {
        get_msgs();
    },[theUser]);

   

    const SEND = async(e) => {
        e.preventDefault();
        let msg = {
            senderImage: theUser.photoURL,
            senderId : theUser.userId,
            senderName : theUser.displayName,
            receiverId : chatID,
            receiverName : name,
            text,
            date : Date.now()
        };
        const res = await axios.post(`${process.env.REACT_APP_URL}/api/messages`,msg);
        dispatch(messageActions.ADD(res.data));
        scroling();
            
        setText('');
    }

    
    return (
    <div className= { !model ? 'home_container' : 'home_container_of'}>
        <div className="sidebar_chat web">
            <header>
                <Avatar 
                alt={theUser.displayName.toUpperCase()} 
                src={theUser && theUser.photoURL} 
                // sx={{ width: 56, height: 56 }}
                />
                <div className="srch">
                    <form action="">
                        <input type="text" placeholder='Search...'/>
                        <button type='submit'>
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </button>
                    </form>
                </div>
            </header>
            
            <div className="side_msgs">
                {DATA.length !== 0 ? (
                    <>
                

                {DATA.map((msg,i) => {
                
                    return (
                        <div className="msg" key={i} onClick={()=> {
                            scroling();
                            id = msg.senderId;
                            setChatId(id);
                            setName(msg.senderName);
                            

                            }}>
                            <Avatar src={msg.photoUrl}/>
                            <div className="name_text">
                                <div className="name">{msg.senderName}</div>
                                
                                <div className="text">
                                    {msg.messages[msg.messages.length-1]}                    
                                </div>
                            </div>

                            {/* <span>{msg.messages.length}</span> */}
                        </div>
                    )
                })}
                </>
                ):(
                    <div className='no_inbox'>No Messages</div>
                )}
                
            </div>
            
            
            

        </div>
        <div className="chat" id='chat'>
            {CHAT.length !== 0 ? (

            
            <footer>
                <div className="imojies" onClick={()=> setText(text +'😃')}>
                    <i className="fa-solid fa-face-grin-wide"></i>
                </div>
                <form action="" onSubmit={SEND}>
                    <input type="text" 
                    placeholder='Type a message...'
                    value={text} 
                    onChange={(e)=> setText(e.target.value)}
                    />
                    <button type='submit'>
                        <i className="fa-solid fa-paper-plane"></i>
                    </button>
                </form>
            </footer>
            ):null}
            {CHAT.map((chat,index)=> {
                return (
                    <div className={chat.senderName === theUser.displayName ? "msg me" : "msg he"} key={index}>
                        <div className="text">{chat.text}</div>
                    {/* <span>{new Date(chat.date).getHours()}:{new Date(chat.date).getMinutes()}</span> */}
                    <span>{new Date(chat.date).getHours()}:{new Date(chat.date).getMinutes()}</span>
                    
            </div>

                )
            })}
            
        </div>

        <div className="sidebar_chat mobile">
            <header>
                <Avatar 
                alt={theUser.displayName.toUpperCase()} 
                src={theUser && theUser.photoURL} 
                // sx={{ width: 56, height: 56 }}

                />
                
                <div className="srch">
                    <form action="">
                        <input type="text" placeholder='Search...'/>
                        <button type='submit'>
                            <i className="fa-solid fa-magnifying-glass"></i>
                        </button>
                    </form>
                </div>
            </header>
            
            <div className="side_msgs">
            {DATA.length !== 0 ? (
                <>

            {DATA.map((msg,i) => {
                    return (
                        <div className="msg" key={i} onClick={()=> navigate(`/Chat/${msg.senderId}`)}>
                            <Avatar  src={msg.photoUrl}/>
                            <div className="name_text">
                                <div className="name">{msg.senderName}</div>
                                <div className="text">
                                {msg.messages[msg.messages.length-1]}                    

                                </div>
                            </div>

                            {/* <span>2</span> */}
                        </div>
                    )
                })}


                </>
            ):(
                <div className='no_inbox'>No messages</div>
            )}
            </div>
            
            
            

        </div>
        
    </div>
  )
}

export default Home
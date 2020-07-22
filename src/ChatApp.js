import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';
import mentee from './imgs/mentee.jpg';
import mentor from './imgs/mentor.jpg';
import niyon from './imgs/niyon-black-s.png';
import Axios from "axios";


// let endPoint  = "https://niyon-be-chat.herokuapp.com/";
let socket = io.connect("/");

const ChatApp = ({ match }) => {
    const id = match.params.id // GRABBING THE USER ID FROM THE URL
    const room_name = match.params.room_name // GRABBING THE ROOM NAME FROM THE URL
    const room_id = match.params.room_id;    
    // data - IS SENT ON JOIN TO THE SERVER TO GET THE USER AND ROOM INFORMATION
    const data = {
        id: Number(id),
        room_name: room_name,
        room_id: Number(room_id)
    }
    // messages - ARE SENT AND RECEIVED AND THEN DISPLAYED WITH ALL KEYS AVAILABLE
    const [messages, setMessages] = useState([{
        first_name: 'Niyon',
        last_name: 'bot',
        user_type: 'Moderator',
        msg: 'Welcome to our Chat App',
        room_name: '',
        user_id: 0,
        timestamp: ''
    }]);
    // CHAT HISTORY GRABS AND SETS ANY SAVED MESSAGES FROM THE DB
    const [chatHistory, setChatHistory] = useState(null)
    // MESSAGE GRABS AND SETS THE CURRENT MESSAGE AND SENDS THAT TO THE SERVER
    const [message, setMessage] = useState("");
    const [room] = useState({
        room_name: room_name
    })
    // THIS useEffect GETS MESSAGES, CURRENTLY WORKING ON STORING MESSAGES IN DB TO GIVE EACH ROOM A HISTORY
    useEffect(() => {
        getMessages();
    }, [messages.length]);
    // THIS useEffect RUNS ONLY ONCE TO SEND THE CURRENT USER AND ROOM DATA
    useEffect(() => {
        sendUserData()
    }, [data])
    // API CALL TO THE SERVER TO GET THE CHAT HISTORY
    useEffect(() => {
        Axios.get('/chathistory', {
            params: {
                room_name: data.room_name
            }
        })
            .then(res => {
                console.log(res)
                setChatHistory(res.data)
                // res.data.map(arr => {
                //     if(arr.room_name === data.room_name) {
                //         setMessages([...messages, arr])
                //     }
                //     console.log(messages)
                // })
            })
            .catch(err => {
                console.log(err)
            })
    },[])
    // SOCKET.EMIT WHEN JOINING ROOM SENDS LOGGED IN USER ID AND ROOM NAME
    const sendUserData = () => {
        socket.emit('join', data);
    }
    // SOCKET.ON WHEN A MESSAGE IS SENT TO THE SERVER RETRIEVES MESSAGED PLUS USER DATA TO DISPLAY
    const getMessages = () => {
        socket.on("message", data => {
            console.log(data)
           setMessages([...messages, data])
        });
    }

    // SIMPLE CHANGE HANDLER
    const onChange = e => {
        setMessage(e.target.value);
    };
    // ONCLICK WILL SEND THE MSG WITH ROOM NAME TO SERVER TO BROADCAST BACK TO ROOM
    const onClick = () => {
        if (message !== "") {
            const myobj = {
                msg: message,
                room: room.room_name
            }
            socket.emit("message", myobj);
            setMessage("")
        } else {
            alert("Please Add A Message");
        }
    }
    // ALLOWS THE USER TO HIT ENTER TO SEND MESSAGE INSTEAD OF THE SEND BTN
    const onEnterPress = (e) => {
        if(e.keyCode === 13 && e.shiftKey === false) {
            e.preventDefault();
            onClick()
        }
    }
if (chatHistory === null) {
    return <h1>Is Loading</h1>
} else
        return (
            <div className="App">
                {/*
                    THE FIRST MESSAGE AND PLACEHOLDER KINDA HEADER
                    ENSURES EVERY ROOM HAS AT LEAST ONE MESSAGE
                    IDEA - USE THE ROOM NAME FROM THE URL TO CREATE A TITLE BAR FOR THE ROOM
                */}
                {messages.map(arr => {
                    if (arr.first_name === 'Niyon') {
                        return (
                             <div className='chatbox' key={Math.random()}>

                            <img className='pic' src={niyon} alt='profilePic' />
                            <div>
                            <p className='msg'>{arr.msg}</p>
                            <em className='byline'>{arr.first_name}{" "}{arr.last_name}</em>
                                <br/>
                            <em className='byline'>{arr.user_type}</em>
                            </div>
                        </div>
                        )
                    }})}
                    {chatHistory.map(arr => {
                           return (
                        <div className='msg-container' key={Math.random()}>
                        <div className={arr.user_id === data.id ? 'chatbox1' : 'chatbox2'} key={Math.random()}>

                            <img className='pic' src={arr.user_type === 'Mentor' ? mentor : mentee } alt='profilePic' />
                            <div className='msg-content'>
                            <p className='msg'>{arr.msg}</p>
                             <em className='byline'>{arr.first_name}{" "}{arr.last_name}{" - "}{arr.user_type}</em>
                                <br/>
                            <em className='byline'>{arr.timestamp}</em>
                            </div>
                        </div>
                        </div>
                    )
                    })}
                        {/*
                            THE ACTUAL MESSAGES FROM THE USER
                            USING THE USER_ID FROM THE MESSAGE TO CHECK AGAINST THE URL ID
                                USING CSS IN HERE TO GIVE THE CHAT A MORE AUTHENTIC LOOK
                        */}
                {messages.map(arr => {
                    if (arr.first_name !== 'Niyon') {
                        return (
                            <div className='msg-container' key={Math.random()}>
                                <div className={arr.user_id === data.id ? 'chatbox1' : 'chatbox2'} key={Math.random()}>

                                    <img className='pic' src={arr.user_type === 'Mentor' ? mentor : mentee}
                                         alt='profilePic'/>
                                    <div className='msg-content'>
                                        <p className='msg'>{arr.msg}</p>
                                        <em className='byline'>{arr.first_name}{" "}{arr.last_name}{" - "}{arr.user_type}</em>
                                        <br/>
                                        <em className='byline'>{arr.timestamp}</em>
                                    </div>
                                </div>
                            </div>
                        )
                    }})}

                <div className='msg-area'>
                <textarea className='message-txt' value={message} name="message" onKeyDown={onEnterPress} onChange={e => onChange(e)}/>
                <br/>
                <button className='msg-btn' onClick={() => onClick()}>Send Message</button>
                </div>
            </div>
        );
    }

export default ChatApp;

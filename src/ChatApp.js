import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';
import mentee from './imgs/mentee.jpg';
import mentor from './imgs/mentor.jpg';
import niyon from './imgs/niyon-black-s.png';


let endPoint  = "http://localhost:5000";
let socket = io.connect(`${endPoint}`);

const App = ({ match }) => {
    const id = match.params.id // GRABBING THE USER ID FROM THE URL
    const room_name = match.params.room_name // GRABBING THE ROOM NAME FROM THE URL
    // data - IS SENT ON JOIN TO THE SERVER TO GET THE USER AND ROOM INFORMATION
    const data = {
        id: Number(id),
        room_name: room_name
    }
    // messages - ARE SENT AND RECEIVED AND THEN DISPLAYED WITH ALL KEYS AVAILABLE
    const [messages, setMessages] = useState([{
        first_name: 'Niyon',
        last_name: 'bot',
        user_type: 'Moderator',
        msg: 'Welcome to our Chat App',
        user_id: 0,
        timestamp: ''
    }]);
    const [message, setMessage] = useState("");
    const [room, setRoom] = useState({
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
    // SOCKET.EMIT WHEN JOINING ROOM SENDS LOGGED IN USER ID AND ROOM NAME
    const sendUserData = () => {
        socket.emit('join', data)
    }
    // SOCKET.ON WHEN A MESSAGE IS SENT TO THE SERVER RETRIEVES MESSAGED PLUS USER DATA TO DISPLAY
    const getMessages = () => {
        socket.on("message", data => {
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
                    } else
                        {/*
                            THE ACTUAL MESSAGES FROM THE USER
                            USING THE USER_ID FROM THE MESSAGE TO CHECK AGAINST THE URL ID
                                USING CSS IN HERE TO GIVE THE CHAT A MORE AUTHENTIC LOOK
                        */}
                    return (
                        <div className='msg-container'>
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
                <div className='msg-area'>
                <textarea className='message-txt' value={message} name="message" onKeyDown={onEnterPress} onChange={e => onChange(e)}/>
                <br/>
                <button className='msg-btn' onClick={() => onClick()}>Send Message</button>
                </div>
                    {/*<input value={username} name="username" onChange={e => onChangeUser(e)}/>*/}
                {/*<button onClick={() => clickHandler()}>Send Username</button>*/}
            </div>
        );
    }

export default App;

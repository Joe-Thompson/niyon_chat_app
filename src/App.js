import React, { useState, useEffect } from 'react';
import './App.css';
import { Route } from 'react-router-dom';
import SignUp from './SignUp';
import ChatApp from './ChatApp';

/*
    ONLY USING CSS FOR DISPLAY PURPOSES
    I AM HORRIBLE AT STYLES SO PLEASE, PLEASE UPDATE STYLES TO LOOK BETTER
    PLEASE
*/

function App() {

    return (
        <div>
            { /*
                SIGNUP ROUTE ONLY USED TO GRAB USER ID AND ROOM NAME
                USER ID WOULD COME FROM CONTEXT AND ROOM NAME IN APP FROM DROPDOWN
             */}
            <Route exact path='/' component={SignUp} />
            { /*
                THE :id IS THE LOGGED IN USER
                THE :room_name IS THE ROOM THE USER IS JOINING
             */}
            <Route exact path='/chatapp/:id/:room_name' component={ChatApp} />
        </div>
    )
}

export default App;

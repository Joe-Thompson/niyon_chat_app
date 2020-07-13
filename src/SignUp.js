import React, { useState } from 'react';
import techs from './techs';

function SignUp({ history }) {
    const [user, setUser] = useState({
        user_id: '',
        room_name: ''
    })

    const changeHandler = (e) => {
        e.preventDefault();
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }

      const arrayHandler = (e) => {
        e.preventDefault();
        let arrID = Number(e.target.value);
            techs.map((item) => {
            if (item.id === arrID) {
                setUser({
                    ...user,
                    room_name: item.name
                })
            }
        });
    };

    const submitHandler = (e) => {
        e.preventDefault();
        setTimeout(() => {
            history.push(`/chatapp/${user.user_id}/${user.room_name}`)
        }, 2000)
    }

    return (
        <div>
            <form className='signin-form' onSubmit={submitHandler}>
                <input
                    className='input-form'
                    type= 'number'
                    value={user.user_id}
                    name='user_id'
                    onChange={changeHandler}
                    placeholder='Please enter user id'
                    />
                    <br/>
                 <label className='label'>Join a Room</label>
                <br/>
                <select className='input-form' onChange={arrayHandler} >
                    {techs.map((item, index, ) => {
                        return <option name={item.name} value={Number(item.id)}  key={index}>{item.name}</option>
                    })}
                </select>
                    <button className='btn' type='submit'>Sign In</button>
            </form>
        </div>
    )
}

export default SignUp
import React, { useState } from 'react'
import { useDispatch} from 'react-redux'
import { Button, Form } from 'semantic-ui-react'
import { loginUserToDB } from '../Redux/actions/userSession'

const LoginForm = props => {

    const dispatch = useDispatch()

    const [loginForm, setLoginForm] = useState({
        username: '',
        password: '',
        avatar: '',
        bio: ''
    })

    const handleChange = e => {
        // e.preventDefault()
        setLoginForm({
            ...loginForm,
            [e.target.name]:e.target.value
        })
    }

    const handleSubmit = e => {
        e.preventDefault()
        dispatch(loginUserToDB(loginForm))
        props.history.push('/')
    }

    const { username, password } = loginForm

    return (
        <Form onSubmit={handleSubmit} >
            <Form.Field>
                <label>Username</label>
                <input 
                    name='username'
                    placeholder='Username' 
                    value={username}
                    onChange={handleChange}
                />
            </Form.Field>
            <p style={{"font-size": "12px", "text-indent": "20px", "position": "relative", "bottom": "10px"}}>
                Minimum length: 4 characters.
            </p>
            <Form.Field>
                <label>Password</label>
                <input 
                    type='password' 
                    name='password'
                    placeholder='Password' 
                    value={password}
                    onChange={handleChange}
                />
            </Form.Field>
            <p style={{"font-size": "12px", "text-indent": "20px", "position": "relative", "bottom": "10px"}}>
                Minimum length: 4 characters.
            </p>
            <Button type='submit'>Submit</Button>
        </Form>
    )
}

export default LoginForm


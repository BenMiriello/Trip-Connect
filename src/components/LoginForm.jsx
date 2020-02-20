import React, { Component } from 'react'
import { Button, Form } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { fetchLoginUser } from '../Redux/actions/userSession'

class SignupForm extends Component {

    defaultState = {
        username: '',
        password: '',
        avatar: '',
        bio: ''
    }

    state = this.defaultState

    handleChange = e => {
        // e.preventDefault()
        this.setState({
            [e.target.name]:e.target.value
        })
    }

    handleSubmit = e => {
        e.preventDefault()
        console.log('submitted');
        this.props.fetchLoginUser(this.state)
        this.setState(this.defaultState)
    }

    render() {
        return (
            <Form onSubmit={this.handleSubmit} >
                <Form.Field>
                    <label>Username</label>
                    <input 
                        name='username'
                        placeholder='Username' 
                        value={this.state.username}
                        onChange={this.handleChange}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Password</label>
                    <input 
                        type='password' 
                        name='password'
                        placeholder='Password' 
                        value={this.state.password}
                        onChange={this.handleChange}
                    />
                </Form.Field>
                <Button type='submit'>Submit</Button>
            </Form>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    fetchLoginUser: userInfo => dispatch(fetchLoginUser(userInfo))
})

export default connect(null, mapDispatchToProps)(SignupForm)
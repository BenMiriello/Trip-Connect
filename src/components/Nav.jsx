import React, { Component } from 'react'
import { Menu, Dropdown } from 'semantic-ui-react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { getProfileFetch, logoutUser } from '../Redux/actions/userSession'
import { Route } from 'react-router-dom'

class Nav extends Component {
    state = {}

    handleItemClick = (e, { name }) => {
        switch (name) {
            case 'logout':
                localStorage.removeItem('token')
                this.props.logoutUser()
                break
            // case 'settings':
            //     break
            default:
                this.setState({ activeItem: name })
                break
        }
    }

    signupMenu = () => (
        <Menu.Menu position='right'>
            <Menu.Item 
            as={NavLink} 
            to='/signup'
            name='signup'
            active={this.state.activeItem === 'signup'}
            onClick={this.handleItemClick}
            />
            <Menu.Item 
                as={NavLink}
                to='/login'
                name="login"
                active={this.state.activeItem === 'login'}
                onClick={this.handleItemClick} 
            />
        </Menu.Menu>
    )

    userMenu = () => (
        <Menu.Menu position='right'>
            <Dropdown item text={this.props.user && this.props.user.username ? this.props.user.username : null}>
                <Dropdown.Menu>
                    <Menu.Item 
                        as={NavLink} 
                        to='/profile'
                        name='My Profile'
                        text='My Profile'
                        active={this.state.activeItem === 'myProfile'}
                        onClick={this.handleItemClick}
                    />
                    <Menu.Item
                        as={NavLink}
                        to='/settings'
                        name='settings' 
                        text='Settings'
                        active={this.state.activeItem === 'settings'}
                        // onClick={this.handleItemClick}
                    />
                    <Menu.Item
                        as={NavLink}
                        to='/'
                        name='logout' 
                        text='Logout'
                        active={this.state.activeItem === 'logout'}
                        onClick={this.handleItemClick}
                    /> 
                </Dropdown.Menu>
            </Dropdown>
        </Menu.Menu>
    )

    render() {
        // debugger
        const { activeItem } = this.state
        console.log(this.props.token)

        return (
            <Route>
                <Menu>
                    <Menu.Item as={NavLink} to='/' >
                        <img src='/planet-earth.png' alt='icon of planet earth' />
                    </Menu.Item>
                    <Menu.Item as={NavLink} to='/favorites'
                        name='favorites'
                        active={activeItem === 'favorites'}
                        onClick={this.handleItemClick}
                    />
                    <Menu.Item as={NavLink} to='/trips'
                        name='trips'
                        active={activeItem === 'trips'}
                        onClick={this.handleItemClick}
                    />
                    { localStorage.token && localStorage.token.length > 0 ? this.userMenu() : this.signupMenu() }
                </Menu>
            </Route>
        )
    }
}

const MSTP = state => (
    {
        user: state.userInfo.user,
        token: state.userInfo.token
    } 
)

const MDTP = dispatch => ({
    getProfileFetch: () => dispatch(getProfileFetch()),
    logoutUser: () => dispatch(logoutUser())
})

export default connect(MSTP, MDTP)(Nav)

// https://react.semantic-ui.com/modules/dropdown/#usage-close-on-change
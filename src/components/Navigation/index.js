import React from 'react';
import {Link} from 'react-router-dom';

import * as ROUTES from '../../constants/routes';
import {AuthUserContext} from "../Session";

import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

import '../App/App.css';

const Navigation = ({authUser}) => (
	<div>
		<AuthUserContext.Consumer>
			{authUser => authUser ? <NavigationAuth /> : <NavigationNonAuth />}
		</AuthUserContext.Consumer>
	</div>
);

class NavigationAuth extends React.Component {
	render() {
		return (
			<Navbar className="bg-dark justify-content-between">
				<Link to={ROUTES.LANDING}>
					<Navbar.Brand className="text-light">
						<img
							alt=""
							src="/images/roboLogo.png"
							width="30"
							height="30"
							className="d-inline-block align-top"
						/>{' '}
						Team 41 Scoutron
					</Navbar.Brand>
				</Link>
				{//<Link to={ROUTES.ADMIN} className="mr-3 text-muted text-decoration-none">Admin</Link>
				}
				<Link to={ROUTES.PROFILE} className="mr-3 text-muted text-decoration-none">Profile</Link>
				<Link to={ROUTES.SIGN_OUT}><Button className="bg-warning border-0">Logout</Button></Link>
			</Navbar>
		);
	}
}

class NavigationNonAuth extends React.Component {
	render() {
		return (
			<Navbar className="bg-dark justify-content-between">
				<Link to={ROUTES.LANDING}>
					<Navbar.Brand className="text-light">
						<img
							alt=""
							src="/images/roboLogo.png"
							width="30"
							height="30"
							className="d-inline-block align-top"
						/>{' '}
						Team 41 Scoutron
					</Navbar.Brand>
				</Link>
				<Link to={ROUTES.SIGN_IN}><Button className="bg-warning border-0">Log
					In</Button></Link>
			</Navbar>
		);
	}
}

export default Navigation;
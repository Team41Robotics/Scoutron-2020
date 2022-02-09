import React from 'react';
import {Link} from 'react-router-dom';

import * as ROUTES from '../../constants/routes';
import {AuthUserContext} from "../Session";

import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

import '../App/App.css';
import * as ROLES from "../../constants/roles";
import {withFirebase} from "../Firebase"

const Navigation = (props) => (
	<div>
		<AuthUserContext.Consumer>
				{authUser => authUser ? <NavigationAuth cookies={props.cookies} {...props}/> : <NavigationNonAuth cookies={props.cookies} {...props}/>}
		</AuthUserContext.Consumer>
	</div>
);

class NavigationAuth extends React.Component {
	constructor(props) {
		super(props);
		if (this.props.cookies.get('sid')) {
			this.id = this.props.cookies.get('sid').substring(0, this.props.cookies.get('sid').search('@'));
		}
	}
	componentDidMount() {
		if (this.id) {
			this.props.firebase.user(this.id).on('value', snapshot => {
				this.role = snapshot.val()['role'];
			});
		}
	}
	render() {
		if (Object.values(ROLES.admins).indexOf(this.props.cookies.get('sid')) !== -1) {
			this.role = ROLES.ADMIN;
		}
		return (
			<Navbar className="bg-dark justify-content-between">
					<Link to={ROUTES.LANDING} className="justify-content-start">
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
					<Link to={ROUTES.PROFILE} className="mr-3 text-muted text-decoration-none">Profile</Link>
					<AuthUserContext.Consumer>
						{authUser => !!authUser && (this.role === ROLES.ADMIN) ?
							<div>
								<Link to={ROUTES.USERDATA} className="mr-3 text-muted text-decoration-none">User Data</Link>
							</div>
							: null
						}
					</AuthUserContext.Consumer>
					<AuthUserContext.Consumer>
						{authUser => !!authUser && (this.role === ROLES.ADMIN) ?
							<div>
								<Link to={ROUTES.ADDITIONPAGE} className="mr-3 text-muted text-decoration-none">Add asssignments</Link>
							</div>
							: null
						}
					</AuthUserContext.Consumer>
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

export default withFirebase(Navigation);
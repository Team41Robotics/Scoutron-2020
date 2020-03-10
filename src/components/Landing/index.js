import React from 'react';
import { withFirebase } from '../Firebase';
import AuthUserContext from "../Session/context";
// Router
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';
// Bootstrap
import Jumbotron from 'react-bootstrap/Jumbotron';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

class LandingPage extends React.Component {
	constructor(props) {
		super(props);
		this.fb = this.props.firebase;
		this.cookies = this.props.cookies;
		this.role = '';
		if (this.props.cookies.get('sid')) {
			this.id = this.props.cookies.get('sid').substring(0, this.props.cookies.get('sid').search('@'));
		}
		this.state = {
			loading: false,
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
		this.props.firebase
			.doGetResults()
			.then(loggedInUser => {
				if (loggedInUser.user != null) {
					if (Object.values(ROLES.admins).indexOf(this.props.cookies.get('sid')) !== -1) {
						this.role = ROLES.ADMIN;
					}
					console.log(Object.values(ROLES.admins).indexOf(this.props.cookies.get('sid')) !== -1);
					// Create a user in your Firebase realtime database
					const email = loggedInUser.user.email.substring(0, loggedInUser.user.email.search('@'));
					this.cookies.set('uid', loggedInUser.user.uid, {path: '/'});
					this.cookies.set('sid', loggedInUser.user.email, {path: '/'});
					return this.props.firebase
						.user(email)
						.set({
							username: loggedInUser.user.displayName,
							email: loggedInUser.user.email,
							role: this.role,
						});
				}
			})
			.catch(error => {
				this.setState({ error });
			});

		if (Object.values(ROLES.admins).indexOf(this.props.cookies.get('sid')) !== -1) {
			this.role = ROLES.ADMIN;
		}

		return (
			<div className="mx-3 mx-sm-5 text-center text-sm-left">
				<Jumbotron className="rounded my-3 bg-dark text-light">
					<Row>
						<Col xs={12} sm={8}>
							<h1>Match Scouting</h1>
							<div className="text-muted">Input information about a specific match</div>
						</Col>
						<Col>
							<div className="btn-group-vertical justify-content-center">
								<Link to={ROUTES.SCOUT_MATCH}>
									<Button size="lg" className="bg-warning border-0 mt-3 mt-sm-0 mb-3">Enter Data</Button>
								</Link>
								<AuthUserContext.Consumer>
									{authUser => !!authUser && (this.role === ROLES.ADMIN) ?
										<Link to={ROUTES.ADMIN}>
											<Button size="lg" className="bg-warning border-0 mt-3 mt-sm-0">View Raw Data</Button>
										</Link>
										: null
									}
								</AuthUserContext.Consumer>
							</div>
						</Col>
					</Row>
				</Jumbotron>
				<Jumbotron className="rounded my-3 bg-dark text-light">
					<Row>
						<Col xs={12} sm={8}>
							<h1>Pit Scouting</h1>
							<div className="text-muted">Input information about a specific robot</div>
						</Col>
						<Col>
							<div className="btn-group-vertical justify-content-center">
								<Link to={ROUTES.SCOUT_PIT}>
									<Button size="lg" className="bg-warning border-0 mt-3 mt-sm-0 mb-3">Enter Data</Button>
								</Link>
								<AuthUserContext.Consumer>
									{authUser => !!authUser && (this.role === ROLES.ADMIN) ?
										<Link to={ROUTES.PITADMIN}>
											<Button size="lg" className="bg-warning border-0 mt-3 mt-sm-0">View Raw Data</Button>
										</Link>
										: null
									}
								</AuthUserContext.Consumer>
							</div>
						</Col>
					</Row>
				</Jumbotron>
			</div>
		);
	}
}

export default withFirebase(LandingPage);
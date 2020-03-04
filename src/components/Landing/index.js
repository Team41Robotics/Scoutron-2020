import React from 'react';
import { withFirebase } from '../Firebase';
// Router
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
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
	}

	render() {
		this.props.firebase
			.doGetResults()
			.then(authUser => {
				if (authUser.user != null) {
					// Create a user in your Firebase realtime database
					this.cookies.set('uid', authUser.user.uid, {path: '/'})
					return this.props.firebase
						.user(authUser.user.uid)
						.set({
							username: authUser.user.displayName,
							email: authUser.user.email,
						});
				}
			})
			.catch(error => {
				this.setState({ error });
			});
		return (
			<div className="mx-3 mx-sm-5 text-center text-sm-left">
				<Jumbotron className="rounded my-3 bg-dark text-light">
					<Row>
						<Col xs={12} sm={8}>
							<h1>Match Scouting</h1>
							<div className="text-muted">Input information about a specific match</div>
						</Col>
						<Col>
							<Link to={ROUTES.SCOUT_MATCH}>
								<Button size="lg" className="bg-warning border-0 mt-3 mt-sm-0">Enter Data</Button>
							</Link>
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
							<Link to={ROUTES.SCOUT_PIT}>
								<Button size="lg" className="bg-warning border-0 mt-3 mt-sm-0">Enter Data</Button>
							</Link>
						</Col>
					</Row>
				</Jumbotron>
			</div>
		);
	}
}

export default withFirebase(LandingPage);
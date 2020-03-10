import React from 'react';
// Bootstrap
import Jumbotron from 'react-bootstrap/Jumbotron';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from "react-bootstrap/Button";

import { withAuthentication } from '../Session';

class MatchInput extends React.Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		const sid = this.props.cookies.get('sid');
		this.state = {
			uid: this.props.cookies.get('uid'),
			successfulClimb: false,
			email: sid.substring(0, sid.search('@')),
		};
		this.test = {};
		this.cookies = this.props.cookies;
	}
	handleChange(event) {
		let index = event.target.id;
		if (event.target.type === "checkbox") {
			(event.target.checked === "on") ? this.setState({[index]: true}): this.setState({[index]: false});
		} else {
			this.setState({[index]: event.target.value});
		}
		event.preventDefault();
	}
	handleSubmit(event) {
		return this.props.firebase.scoutData(this.state.email)(this.state.matchNumber)(this.state.teamNumber).set(this.state);
	}
	render() {
		return (
			<div>
				<Jumbotron className="mx-3 mx-sm-5 my-3 py-5 bg-dark text-white">
					<h1 className="text-center">Match Scouting</h1>
					<br />

					<Form onSubmit={this.handleSubmit}>
						<Jumbotron className="py-4" style={{backgroundColor: "rgba(255,255,255,0.25)"}}>
							<h3 className="text-center">General</h3>
							<Form.Row>
								<Form.Group as={Col}>
									<Form.Label>Match Number</Form.Label>
									<Form.Control id="matchNumber" onChange={this.handleChange} type="number" pattern="[0-9]*" min={0} placeholder="Enter Match Number" />
								</Form.Group>
								<Form.Group as={Col}>
									<Form.Label>Team Number</Form.Label>
									<Form.Control id="teamNumber" onChange={this.handleChange} type="number" pattern="[0-9]*" min={0} placeholder="Enter Team Number" />
								</Form.Group>
							</Form.Row>
						</Jumbotron>
						<Jumbotron className="py-4" style={{backgroundColor: "rgba(255,255,255,0.25)"}}>
							<h3 className="text-center">Auton</h3>
							<Form.Row>
								<Form.Group as={Col}>
									<Form.Label>High Goals</Form.Label>
									<Form.Control id="autonHighGoals" onChange={this.handleChange} type="number" pattern="[0-9]*" min={0} placeholder="High Goals" />
								</Form.Group>
								<Form.Group as={Col}>
									<Form.Label>Low Goals</Form.Label>
									<Form.Control id="autonLowGoals" onChange={this.handleChange} type="number" pattern="[0-9]*" min={0} placeholder="Low Goals" />
								</Form.Group>
							</Form.Row>
							<Form.Group>
								<Form.Label>Balls Picked Up</Form.Label>
								<Form.Control id="autonBallsPickedUp"  onChange={this.handleChange} type="number" pattern="[0-9]*" min={0} placeholder="Balls Picked Up" />
							</Form.Group>
						</Jumbotron>
						<Jumbotron className="py-4" style={{ backgroundColor: "rgba(255,255,255,0.25)" }}>
							<h3 className="text-center">Teleop</h3>
							<Form.Row>
								<Form.Group as={Col}>
									<Form.Label>High Goals</Form.Label>
									<Form.Control id="teleopHighGoals" onChange={this.handleChange} type="number" pattern="[0-9]*" min={0} placeholder="High Goals" />
								</Form.Group>
								<Form.Group as={Col}>
									<Form.Label>Low Goals</Form.Label>
									<Form.Control id="teleopLowGoals" onChange={this.handleChange} type="number" pattern="[0-9]*" min={0} placeholder="Low Goals" />
								</Form.Group>
							</Form.Row>
							<Form.Group>
								<Form.Label>Balls Picked Up</Form.Label>
								<Form.Control id="teleopBallsPickedUp" onChange={this.handleChange} type="number" pattern="[0-9]*" min={0} placeholder="Balls Picked Up" />
							</Form.Group>
							<Form.Group>
								<Form.Label>Speed</Form.Label>
								<Form.Control defaultValue="Robot Speed" id="teleopRobotSpeed" onChange={this.handleChange} as="select">
									<option disabled>Robot Speed</option>
									<option value={1}>Slow</option>
									<option value={2}>Medium</option>
									<option value={3}>Fast</option>
									<option value={4}>Very Fast</option>
									<option value={5}>Ludicrous Speed</option>
								</Form.Control>
							</Form.Group>
						</Jumbotron>
						<Jumbotron className="py-4" style={{ backgroundColor: "rgba(255,255,255,0.25)" }}>
							<h3 className="text-center">Endgame</h3>
							<Form.Check
								type="switch"
								id="successfulClimb"
								label="Successful Climb"
								onChange={this.handleChange}
							/>
						</Jumbotron>
						<Button block size="lg" type="submit" className="bg-secondary border-0">Submit Scout</Button>
					</Form>
				</Jumbotron>
			</div>
		);
	}
}

export default withAuthentication(MatchInput);
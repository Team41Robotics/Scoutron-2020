import React from 'react';
// Bootstrap
import Jumbotron from 'react-bootstrap/Jumbotron';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from "react-bootstrap/Button";

import { withAuthorization } from '../Session';

class PitInput extends React.Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.state = {
			uid: this.props.cookies.get('uid'),
			HGval: "No",
		};
		this.formVals = {};
		this.test = {};
		this.cookies = this.props.cookies;
	}
	handleChange(event) {
		let index = event.target.id;
		if (event.target.type === "checkbox") {
			this.setState({[index]: event.target.checked});
		} else {
			this.setState({[index]: event.target.value});
		}
		console.log(event.target.value);
	}
	handleSubmit(event) {
		return this.props.firebase.scoutData(this.props.cookies.get('uid'))(this.state.matchNumber)(this.state.teamNumber).set(this.state);
	}
	render() {
		return (
			<div>
				<Jumbotron className="mx-3 mx-sm-5 my-3 py-5 bg-dark">
					<h1 className="text-center">Pit Scouting</h1>
					<br />

					<Form>
						<Jumbotron className="py-4" style={{ backgroundColor: "rgba(255,255,255,0.25)" }}>
							<h3 className="text-center">Robot Information</h3>

							<Form.Group>
								<Form.Label>Team Number</Form.Label>
								<Form.Control type="number" pattern="[0-9]*" min={0} placeholder="Enter Team Number" />
							</Form.Group>
							<Form.Group>
								<Form.Label>Type of Drivetrain</Form.Label>
								<Form.Control as="select">
									<option default>Tank</option>
									<option>Mecanum</option>
									<option>Swerve</option>
								</Form.Control>
							</Form.Group>
							<Form.Row>
								<Form.Group as={Col} className="text-center col-6 col-md-4">
									<Form.Check
										type="switch"
										id="highGoal"
										label="High Goal?"
										onChange={this.handleChange}
									/>
								</Form.Group>
								<Form.Group as={Col} className="text-center col-6 col-md-4">
									<Form.Check
										type="switch"
										id="low-goal"
										label="Low Goal?"
									/>
								</Form.Group>
								<Form.Group as={Col} className="text-center">
									<Form.Check
										type="switch"
										id="wheel-of-fortune"
										label="Wheel of Fortune?"
									/>
								</Form.Group>
							</Form.Row>
							{(this.state.highGoal) &&
							<Form.Row>
								<Form.Group as={Col} className="col-12 col-sm-auto">
									<Form.Label className="my-auto">Shooting Range: </Form.Label>
								</Form.Group>
								<Form.Group as={Col} className="d-flex justify-content-around col-12 col-md-auto">
									<Form.Check inline label="Short" type="checkbox"/>
									<Form.Check inline label="Medium" type="checkbox"/>
									<Form.Check inline label="Long" type="checkbox"/>
								</Form.Group>
							</Form.Row>
							}
							<Form.Group>
								<Form.Label>Climbing?</Form.Label>
								<Form.Control id="climbing" onChange={this.handleChange} as="select">
									<option default disabled>Can it climb?</option>
									<option>No Climb</option>
									<option>Stationary Climb</option>
									<option>Buddy Climb</option>
									<option>Other</option>
								</Form.Control>
							</Form.Group>
							{(this.state.climbing == "Other") &&
							<Form.Group>
								<Form.Label>Please specify:</Form.Label>
								<Form.Control type="text"/>
							</Form.Group>
							}
						</Jumbotron>
					</Form>
				</Jumbotron>
			</div>
		);
	}
}

const condition = authUser => authUser != null;
export default withAuthorization(condition)(PitInput);
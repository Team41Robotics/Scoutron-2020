import React from 'react';
// Bootstrap
import Jumbotron from 'react-bootstrap/Jumbotron';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from "react-bootstrap/Button";

import {withAuthentication} from '../Session';

class PitInput extends React.Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		const sid = this.props.cookies.get('sid');
		this.state = {
			uid: this.props.cookies.get('uid'),
			email: sid.substring(0, sid.search('@')),
			longRange: false,
			medRange: false,
			shortRange: false,
			lowGoal: false,
			highGoal: false,
			wheelOfFortune: false,
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
	}
	handleSubmit(event) {
		return this.props.firebase.pitData(this.state.email)(this.state.teamNumber).set(this.state);
	}
	render() {
		return (
			<div>
				<Jumbotron className="mx-3 mx-sm-5 my-3 py-5 bg-dark text-white">
					<h1 className="text-center">Pit Scouting</h1>
					<br />

					<Form onSubmit={this.handleSubmit}>
						<Jumbotron className="py-4" style={{ backgroundColor: "rgba(255,255,255,0.25)" }}>
							<h3 className="text-center">Robot Information</h3>

							<Form.Group>
								<Form.Label>Team Number</Form.Label>
								<Form.Control onChange={this.handleChange} id="teamNumber" type="number" pattern="[0-9]*" min={0} placeholder="Enter Team Number" />
							</Form.Group>
							<Form.Group>
								<Form.Label>Type of Drivetrain</Form.Label>
								<Form.Control onChange={this.handleChange} id="driveType" as="select">
									<option>Please select an option</option>
									<option>Tank</option>
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
										id="lowGoal"
										label="Low Goal?"
										onChange={this.handleChange}
									/>
								</Form.Group>
								<Form.Group as={Col} className="text-center">
									<Form.Check
										type="switch"
										id="wheelOfFortune"
										label="Wheel of Fortune?"
										onChange={this.handleChange}
									/>
								</Form.Group>
							</Form.Row>
							{(this.state.highGoal) &&
							<Form.Row>
								<Form.Group as={Col} className="col-12 col-sm-auto">
									<Form.Label className="my-auto">Shooting Range: </Form.Label>
								</Form.Group>
								<Form.Group as={Col} className="d-flex justify-content-around col-12 col-md-auto">
									<Form.Check inline id="shortRange" label="Short" type="checkbox" onChange={this.handleChange}/>
									<Form.Check inline id="medRange" label="Medium" type="checkbox" onChange={this.handleChange}/>
									<Form.Check inline id="longRange" label="Long" type="checkbox" onChange={this.handleChange}/>
								</Form.Group>
							</Form.Row>
							}
							<Form.Group>
								<Form.Label>Climbing?</Form.Label>
								<Form.Control id="climbing" onChange={this.handleChange} as="select">
									<option default>Can it climb?</option>
									<option>No Climb</option>
									<option>Stationary Climb</option>
									<option>Buddy Climb</option>
									<option>Other</option>
								</Form.Control>
							</Form.Group>
							{(this.state.climbing === "Other") &&
							<Form.Group>
								<Form.Label>Please specify:</Form.Label>
								<Form.Control type="text"/>
							</Form.Group>
							}
						</Jumbotron>
						<Button block size="lg" type="submit" className="bg-secondary border-0">Submit Scout</Button>
					</Form>
				</Jumbotron>
			</div>
		);
	}
}

export default withAuthentication(PitInput);
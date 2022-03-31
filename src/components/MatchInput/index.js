import React from 'react';
// Bootstrap
import Jumbotron from 'react-bootstrap/Jumbotron';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from "react-bootstrap/Button";

import { withAuthentication } from '../Session';

class MatchInput extends React.Component {
	
	constructor(props) {
		var keys = ["autonLowGoals","autonHighGoals"]

		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.getMatches = this.getMatches.bind(this);
		const sid = this.props.cookies.get('sid');
		this.state = {
			uid: this.props.cookies.get('uid'),
			matches: {},
			email: sid.substring(0, sid.search('@')),
			
		};
		this.test = {};
		this.cookies = this.props.cookies;
		if (this.props.cookies.get('sid')) {
			this.id = this.props.cookies.get('sid').substring(0, this.props.cookies.get('sid').search('@'));
		} else {
			window.history.back();
		}

	}
	
	componentDidMount() {
		this.getMatches();
		this.setState({"autonLowGoals":0})
		this.setState({"autonHighGoals":0})
		this.setState({"teleopHighGoals":0})
		this.setState({"teleopLowGoals":0})
		this.setState({"highGoalRicochets":0})
		this.setState({"lowGoalRicochets":0})
		this.setState({"autonBallsPickedUp":0})
		this.setState({"teleopBallsPickedUp":0})
	}

	handleChange(event) {
		let index = event.target.id;
		if (event.target.type === "checkbox") {
			(event.target.checked === "on") ? this.setState({[index]: true}): this.setState({[index]: false});
		} else {
			let key = event.target.value;
			if (event.target.id === "teamAndMatch") {
				this.setState({[index]: {match: key.substring(0, key.search('-')), team: key.substring(key.search('-')+1)}});
			} else {
				this.setState({[index]: key});
			}
		}
		event.preventDefault();
	}
	handleSubmit(event) {
		return this.props.firebase.scoutData(this.state.email)(this.state.teamAndMatch["match"])(this.state.teamAndMatch["team"]).set(this.state);
	}

	getMatches() {
		 this.props.firebase.table('/').on('value', snapshot => {
			const table = snapshot.val();
			let matches;
			if(table["scoutAssignments"][this.id]!= null ){
				
				matches = table["scoutAssignments"][this.id]["match"];
				
				


				console.log(matches);
			}else{
				matches = ['[empty]-[empty]']	
			}

			this.setState({
				matches
			}); 
		});
		this.props.firebase.table('/').on('value', snapshot => {
			const table = snapshot.val();
			let eventKey;
			eventKey=table["eventKey"]["EventKey"]

			this.setState({
				eventKey
			});
		});
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
							<Form.Group>
								<Form.Label>Speed</Form.Label>
								<Form.Control defaultValue="Select a Team" id="teamAndMatch" onChange={this.handleChange} as="select">
									<option disabled>Select a Team</option>
									{/* Auto options here */}
									{Object.values(this.state.matches).map((key, val) => {
										let matchNum = key.substring(0, key.search('-'));
										let teamNum = key.substring(key.search('-')+1);
										return (<option key={val} value={key}>Match {matchNum} | Team {teamNum}</option>)
									})}
								</Form.Control>
							</Form.Group>
						
    						
  							
							</Form.Row>
						</Jumbotron>
						<Jumbotron className="py-4" style={{backgroundColor: "rgba(255,255,255,0.25)"}}>
									<h3 class="text-center">Penalties</h3>
									
									<Form.Row>
											<Form.Group as={Col} className="text-center col-6 col-md-4">
											<Form.Check
												type="switch"
												id="showedUp"
												label="Didnt Show Up"
												onChange={this.handleChange}
											/>
									</Form.Group>
									<Form.Group as={Col} className="text-center col-7 col-md-4">
											<Form.Check
												type="switch"
												id="brokeDown"
												label="Broke Down?"
												onChange={this.handleChange}
											/>
									</Form.Group>
									<Form.Group as={Col} className="text-center col-7 col-md-4">
											<Form.Check
												type="switch"
												id="didntStart"
												label="Didnt Start"
												onChange={this.handleChange}
											/>
									</Form.Group>
									<Form.Group as={Col} className="text-center col-7 col-md-4">
											<Form.Check
												type="switch"
												id="bumperBroke"
												label="Bumper Fell Off"
												onChange={this.handleChange}
											/>
									</Form.Group>
									<Form.Group as={Col} className="text-center col-7 col-md-4">
											<Form.Check
												type="switch"
												id="stopMoving"
												label="Stopped Moving"
												onChange={this.handleChange}
											/>
									</Form.Group>
									<Form.Group as={Col} className="text-center col-7 col-md-4">
											<Form.Check
												type="switch"
												id="hitDuringAuton"
												label="Hit During Auton"
												onChange={this.handleChange}
											/>
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
							<Form.Row>
								<Form.Group as={Col}>
									<Form.Label>High Goal Ricochets</Form.Label>
									<Form.Control id="highGoalRicochets" onChange={this.handleChange} type="number" pattern="[0-9]*" min={0} placeholder="High Goal Ricochets" />
								</Form.Group>
								<Form.Group as={Col}>
									<Form.Label>Low Goals Ricochets</Form.Label>
									<Form.Control id="lowGoalRicochets" onChange={this.handleChange} type="number" pattern="[0-9]*" min={0} placeholder="Low Goal Ricochets" />
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
									<option value={0}>Slow</option>
									<option value={1}>Medium</option>
									<option value={2}>Fast</option>
									<option value={3}>Very Fast</option>
									<option value={4}>Ludicrous Speed</option>
								</Form.Control>
							</Form.Group>
						</Jumbotron>
						<Jumbotron className="py-4" style={{ backgroundColor: "rgba(255,255,255,0.25)" }}>
							<h3 className="text-center">Endgame</h3>
							{/* <Form.Check
								type="switch"
								id="successfulClimb"
								label="Successful Climb"
								onChange={this.handleChange}
							/> */}
							<Form.Control defaultValue="Climb Progress" id="climbProgress" onChange={this.handleChange} as="select">
									<option disabled>Climb Progress</option>
									<option value={0}>Did Not Climb</option>
									<option value={1}>1st Bar</option>
									<option value={2}>2nd Bar</option>
									<option value={3}>3rd Bar</option>
									<option value={4}>4th Bar</option>
								</Form.Control>
						</Jumbotron>
						
						<Button block size="lg" type="submit" className="bg-secondary border-0">Submit Scout</Button>
					</Form>
				</Jumbotron>
			</div>
		);
	}


}

export default withAuthentication(MatchInput);
import React, { Component } from 'react';
// Bootstrap
import { Table } from "react-bootstrap";
import Jumbotron from "react-bootstrap/Jumbotron";
// My Stuff
import { withAuthorization } from "../Session";

const speeds = [
	"Slow",
	"Medium",
	"Fast",
	"Very Fast",
	"Ludicrous"
]

const climbs = [
	"Did Not Climb",
	"1st Bar",
	"2nd Bar",
	"3rd Bar",
	"4th Bar"
]

class AdminPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			table: {scoutData: {}, pitData: {}},
		};
		if (this.props.cookies.get('sid')) {
			this.id = this.props.cookies.get('sid').substring(0, this.props.cookies.get('sid').search('@'));
		}
	}
	componentDidMount() {
		this.setState({loading: true});
		this.props.firebase.table('/').on('value', snapshot => {
			const table = snapshot.val();
			this.setState({
				table: table,
				loading: false,
			});
		});
		if (this.id) {
			this.props.firebase.user(this.id).on('value', snapshot => {
				this.setState({role: snapshot.val()['role']});
			});
		}
	}
	componentWillUnmount() {
		this.props.firebase.users().off();
	}
	render() {
		const { table, loading } = this.state;
		return (
			<div>
				{loading && <div>Loading ...</div>}
				<TablePrint table={table} />
			</div>
		);
	}
}

const TablePrint = ({ table }) => (
	<div>
	<Jumbotron className="mx-3 mx-sm-5 my-3 py-5 bg-dark text-white">
		<h1>Match Scouting</h1>
		<Table responsive striped bordered hover variant="dark" className="text-white">
			<thead>
			<tr>
				<th>Match #</th>
				<th>Team #</th>
				<th>Balls in Auton</th>
				<th>High Goals in Auton</th>
				<th>Low Goals in Auton</th>
				<th>Balls in Teleop</th>
				<th>High Goals in Teleop</th>
				<th>Low Goals in Teleop</th>
				<th>Robot Speed</th>
				<th>Climb</th>
				<th>High Goal Ricochets</th>
				<th>Low Goal Ricochets</th>

			</tr>
			</thead>
			<tbody>
			{ Object.keys(table.scoutData).map((user) => {
				return (
						Object.keys(user).map((match) => {
							let matchAndTeam = Object.keys(table.scoutData[user])[match];
							let currentObj = table.scoutData[user][matchAndTeam];
							if (matchAndTeam) {
								const matchNum = matchAndTeam.substring(0, matchAndTeam.search('-'));
								const teamNum = matchAndTeam.substring(matchAndTeam.search('-') + 1);
								return (
									<tr>
										<th>{matchNum}</th>
										<th>{teamNum}</th>
										<th>{currentObj['autonBallsPickedUp']}</th>
										<th>{currentObj['autonHighGoals']}</th>
										<th>{currentObj['autonLowGoals']}</th>
										<th>{currentObj['teleopBallsPickedUp']}</th>
										<th>{currentObj['teleopHighGoals']}</th>
										<th>{currentObj['teleopLowGoals']}</th>
										<th>{speeds[currentObj['teleopRobotSpeed']]}</th>
										<th>{climbs[currentObj['climbProgress']]}</th>
										<th>{currentObj['highGoalRicochets']}</th>
										<th>{currentObj['lowGoalRicochets']}</th>
									</tr>
								);
							} else {return null}
						})
				);
			})}
			</tbody>
		</Table>
	</Jumbotron>
	</div>
);

export default withAuthorization(AdminPage, "admin");
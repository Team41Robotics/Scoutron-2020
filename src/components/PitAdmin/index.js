import React, { Component } from 'react';
// Bootstrap
import { Table } from "react-bootstrap";
import Jumbotron from "react-bootstrap/Jumbotron";
// My Stuff
import { withAuthorization } from "../Session";

class PitAdminPage extends Component {
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
			<h1>Pit Scouting</h1>
			<Table responsive striped bordered hover variant="dark" className="text-white">
				<thead>
				<tr>
					<th>Team #</th>
					<th>Climbing</th>
					<th>Drivetrain Type</th>
					<th>High Goal?</th>
					<th>Low Goal?</th>
					<th>Long Range?</th>
					<th>Medium Range?</th>
					<th>Short Range?</th>
					<th>Wheel of Fortune?</th>
				</tr>
				</thead>
				<tbody>
				{ Object.keys(table.pitData).map((user) => {
					return (
						Object.keys(user).map((match) => {
							let teamNum = Object.keys(table.pitData[user])[match];
							if (teamNum) {
								let currentObj = table.pitData[user][teamNum];
								return (
									<tr>
										<th>{String(currentObj['teamNumber'])}</th>
										<th>{String(currentObj['climbing'])}</th>
										<th>{String(currentObj['driveType'])}</th>
										<th>{String(currentObj['highGoal'])}</th>
										<th>{String(currentObj['lowGoal'])}</th>
										<th>{String(currentObj['longRange'])}</th>
										<th>{String(currentObj['medRange'])}</th>
										<th>{String(currentObj['shortRange'])}</th>
										<th>{String(currentObj['wheelOfFortune'])}</th>
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

export default withAuthorization(PitAdminPage, "admin");
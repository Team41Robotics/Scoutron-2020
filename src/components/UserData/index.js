import React from "react";
// My stuff
import withAuthorization from "../Session/withAuthorization";
// Bootstrap
import { Table } from "react-bootstrap";
import Jumbotron from "react-bootstrap/Jumbotron";

class UserData extends React.Component {
	constructor(props) {
		super(props);
		this.fb = this.props.firebase;
		if (this.props.cookies.get('sid')) {
			this.id = this.props.cookies.get('sid').substring(0, this.props.cookies.get('sid').search('@'));
		}
		this.state = {
			scoutMatches: {},
			currentAssign: {},
		};
	}
	componentDidMount() {
		this.fb.db.ref(`/scoutData/`).on('value', snapshot => {
			this.setState({scoutMatches: snapshot.val()});
		});
		this.fb.db.ref(`/scoutAssignments/`).on('value', snapshot => {
			this.setState({currentAssign: snapshot.val()});
		});
	}

	render() {
		const { scoutMatches, currentAssign } = this.state;
		return (
			<div>
				<Jumbotron className="mx-3 mx-sm-5 my-3 py-5 bg-dark text-white">
					<Table responsive bordered hover className="text-white">
						<thead>
							<tr>
								<th>ID #</th>
								<th>Match Number</th>
								<th>Turned In?</th>
							</tr>
						</thead>
						<tbody>
							{Object.keys(currentAssign).map((user) => {
								return (
									Object.keys(currentAssign[user].match).map((match) => {
										const currentMatch = currentAssign[user].match[match];
										const color = (!!scoutMatches[user][currentMatch]) ? "bg-success" : "bg-danger";
										console.log(currentMatch);
										return (
											<tr>
												<th>{user}</th>
												<th>{currentMatch.substring(0, currentMatch.search('-'))}</th>
												<th className={color}/>
											</tr>
										);
									})
								);
							})}
						</tbody>
					</Table>
				</Jumbotron>
			</div>
		);
	}
}

export default withAuthorization(UserData);
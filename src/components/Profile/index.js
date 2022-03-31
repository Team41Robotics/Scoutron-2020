import React from 'react';
// Bootstrap
import Jumbotron from 'react-bootstrap/Jumbotron';
import Table from 'react-bootstrap/Table';
// My Stuff
import {withAuthentication} from '../Session/';

class Profile extends React.Component {
	constructor(props) {
		super(props);
		this.sid = this.props.cookies.get('sid');
		this.user= "";
		this.id = this.sid.substring(0, this.sid.search('@'));
		this.matches = {};
		this.pits = {};
		this.intermediatePit=[];
		this.intermediateScout=[];
		this.completedScout={};
		this.completedPit={}
		this.isReady =false;
		this.state = {
			matches: {
				match:"",
			},
			loading: false,
		};

		this.componentDidMountDos = this.componentDidMountDos.bind(this)
	}
	componentDidMount() {
		this.setState({ loading: true });
		let pitInfo = []
		let matchInfo = []
		this.props.firebase.table('/').on('value',snapshot=>{
			if(!!snapshot.val()['pitData'][this.id]){
				pitInfo = Object.keys(snapshot.val()['pitData'][this.id]);
			}else{
				pitInfo = ['[empty]']
			}
			if(!!snapshot.val()['scoutData'][this.id]){
				matchInfo = Object.keys(snapshot.val()['scoutData'][this.id]);
			}else{
				matchInfo = ["[empty]-[empty]"]
			}
		
			this.intermediatePit=(pitInfo)
			this.intermediateMatch=(matchInfo)
			this.isReady = true;
			console.log('read')
			this.componentDidMountDos()
		})
		
		
		
		
		
	}
	componentDidMountDos(){
		this.props.firebase.matchInfo(this.id).on('value', snapshot => {
			
			if (!!snapshot.val()) {
				this.matches = snapshot.val()['match'];
				this.pits = snapshot.val()['pit'];
				
			}else{
				this.matches = ['[empty]-[empty]'];
				this.pits = ['[empty]'];
			}
			
			this.completedScout = []
			this.completedPit=[]
			this.matches.forEach(element =>	{
				this.completedScout.push(this.intermediateMatch.includes(element))		
			}
			);

			this.pits.forEach(element=>
				this.completedPit.push(this.intermediatePit.includes(element))
			);
			
			this.setState({
				loading: false,
			});
		})
	}
	componentWillUnmount() {
		this.props.firebase.matchInfo(this.uid).off();
		this.props.firebase.user(this.uid).off();
	}

	render() {
		return (
			<div>
				{this.state.loading && <div>Loading ...</div>}
				<Jumbotron className="mx-3 mx-sm-5 my-3 text-center text-sm-left bg-dark text-light">
					<div className="h3">My Pit Scouting Assignments:</div>
					<Table hover repsonsive="true" variant="dark">
						<thead>
							<tr>
								<th>Team #</th>
							</tr>
						</thead>
						<tbody>
						{!!this.pits ? 
							Object.keys(this.pits).map((pit, index) => {
								if (this.matches[index]) {
									this.currentBoi = this.pits[index];
								} else {
									this.currentBoi = "";
								}
								this.teamNum = this.currentBoi;
								return (
									<tr>
										<th>{this.teamNum}</th>
									</tr>
								);})
							: null
						}
						</tbody>
					</Table>
				</Jumbotron>
				<Jumbotron className="mx-3 mx-sm-5 my-3 text-center text-sm-left bg-dark text-light">
					<div className="h3">My Match Scouting Assignments:</div>
					<br />
					<Table hover responsive variant="dark">
						<thead>
							<tr>
								<th>Match #</th>
								<th>Team #</th>
							</tr>
						</thead>
						<tbody>
						{Object.keys(this.matches).map((match, index) => {
							
							if (this.matches[index]) {
								this.currentBoi = this.matches[index];
							} else {
								this.currentBoi = "";
							}
							this.matchNum = this.currentBoi.substring(0, this.currentBoi.search('-'));
							this.teamNum = this.currentBoi.substring(this.currentBoi.search('-')+1)
							console.log(this.completedScout[index])
							return (
								<tr key={index}>
									<th>{this.matchNum}</th>
									<th>{this.teamNum}</th>
									<th>{(this.completedScout[index]).toString()}</th>
									
								</tr>
							);})}
						</tbody>
					</Table>
				</Jumbotron>
			</div>
		);
	}
}

export default withAuthentication(Profile);
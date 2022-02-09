import React, { Component } from 'react';
// Bootstrap
import { Form, FormControl, FormLabel, Button } from "react-bootstrap";
import Jumbotron from "react-bootstrap/Jumbotron";
import { withAuthorization } from '../Session';

// My Stuff

class Additions extends Component{
    constructor(props){
        super(props);
        this.state = {
            assignments: [],
            users: [],
            matches: null,
            currentUser: "",
            ready: false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getUsers = this.getUsers.bind(this);
        this.selectUser = this.selectUser.bind(this);
        this.removeMatch = this.removeMatch.bind(this);
        this.addMatch = this.addMatch.bind(this);
        this.addPit = this.addPit.bind(this);
        this.removePit = this.removePit.bind(this);
        this.handlePitSubmit = this.handlePitSubmit.bind(this);
    }

    componentDidMount() {
        this.getUsers();
    }
    
    handleChange(event) {
        console.log(event.target.value);
    }
    handleSubmit() {
        this.props.firebase.addMatch(this.state.currentUser).set(this.state.matches);
    }

    handlePitSubmit() {
        this.props.firebase.addPit(this.state.currentUser).set(this.state.pits);
    }

    getUsers() {
		this.props.firebase.table('/').on('value', snapshot => {
			const table = snapshot.val();
			let assignments;
            let users;
			if(table["scoutAssignments"] != null ) {
				assignments = table["scoutAssignments"];
                users = table["users"];
			}else {
				assignments = {}
                users = {};
			}

			this.setState({
				assignments,
                users,
                ready: true,
			});
		});
	}

    selectUser(e) {
        if (this.state.ready) {
            this.setState({
                currentUser: e.target.value,
            });
            
            let matches = null;
            let pits = null;
            let exists = !!this.state.assignments[e.target.value] && !!this.state.assignments[e.target.value]["match"];
            if (exists) {
                matches = Object.values(this.state.assignments[e.target.value]["match"]);
            }
            exists = !!this.state.assignments[e.target.value] && !!this.state.assignments[e.target.value]["pit"];       
            if (exists) {
                pits = Object.values(this.state.assignments[e.target.value]["pit"]);
            }
            this.setState({
                matches,
                pits
            })
        }
    }

    removeMatch(e) {
        let match = this.state.matches;
        let index = this.state.matches.indexOf(e.target.value);
        match.splice(index, 1)
        this.setState({
            matches: match
        });
    }

    removePit(e) {
        let pit = this.state.pits;
        let index = this.state.pits.indexOf(e.target.value);
        pit.splice(index, 1)
        this.setState({
            pits: pit
        });
    }

    addMatch(e) {
        console.log(this.state);
        let matches = this.state.matches;
        if (!!matches) {
            matches.push(`${this.state.tempMatch}-${this.state.tempTeam}`);
        } else {
            matches = [`${this.state.tempMatch}-${this.state.tempTeam}`]
        }
        this.setState({
            matches
        });
    }

    addPit(e) {
        console.log(this.state);
        let pits = this.state.pits;
        if (!!pits) {
            pits.push(`${this.state.tempPit}`);
        } else {
            pits = [`${this.state.tempPit}`]
        }
        this.setState({
            pits
        }); 
    }

    render() {
        if (this.state.ready) {
            return ( 
                <div>
                    <Jumbotron className="mx-3 mx-sm-5 my-3 py-5 bg-dark text-white">
                        <Jumbotron className="py-4" style={{backgroundColor: "rgba(255,255,255,0.25)"}}>
                            <h1>Scout Assigner</h1>
                            <form>
                                <FormLabel> 
                                    Select user to modify
                                </FormLabel>
                                <FormControl as ="select" placeholder ="person" defaultValue="Select a User" onChange={this.selectUser}>
                                    <option disabled>Select a User</option>
                                    {Object.keys(this.state.users).map((key , val) => {
                                        return (<option key={val} value={key}>{key}</option>)
                                    })}
                                </FormControl>
                            </form>
                        </Jumbotron>
                        {!!this.state.currentUser ? 
                            <div>
                            <Jumbotron className="py-4" style={{backgroundColor: "rgba(255,255,255,0.25)"}}>
                                <h1>Match Assignments</h1>
                                {!!this.state.matches ? 
                                    <form>
                                        {this.state.matches.map((key, val) => {
                                            return (
                                                <div key={val} className="mb-2">
                                                    <Form.Label className="mr-2">{key}</Form.Label>
                                                    <Button value={key} variant="dark" onClick={this.removeMatch}>Remove</Button>
                                                </div>
                                            );
                                        })}
                                    </form>
                                : <span></span>
                                }
                                <Form.Group>
                                    <FormControl onChange={(e) => {this.setState({tempMatch: e.target.value})}} placeholder="Match Number" type="number" required></FormControl>
                                    <FormControl onChange={(e) => {this.setState({tempTeam: e.target.value})}} placeholder="Team Number" type="number" required></FormControl>
                                    <Button type="submit" onClick={this.addMatch}>Add</Button>
                                </Form.Group>
                                <Button onClick={this.handleSubmit}>Submit</Button>
                            </Jumbotron>
                            {/* Pits */}
                            <Jumbotron className="py-4" style={{backgroundColor: "rgba(255,255,255,0.25)"}}>
                                <h1>Pit Assignments</h1>
                                {!!this.state.pits ? 
                                    <form>
                                        {this.state.pits.map((key, val) => {
                                            return (
                                                <div key={val} className="mb-2">
                                                    <Form.Label className="mr-2">{key}</Form.Label>
                                                    <Button value={key} variant="dark" onClick={this.removePit}>Remove</Button>
                                                </div>
                                            );
                                        })}
                                    </form>
                                : <span></span>
                                }
                                <Form.Group>
                                    <FormControl onChange={(e) => {this.setState({tempPit: e.target.value})}} placeholder="Team Number" type="number" required></FormControl>
                                    <Button type="submit" onClick={this.addPit}>Add</Button>
                                </Form.Group>
                                <Button onClick={this.handlePitSubmit}>Submit</Button>
                            </Jumbotron>
                            </div>
                         : <span></span>}
                    </Jumbotron>
                </div> 
            );      
        } else {
            return (
                <h1>Loading...</h1>
            );
        }
    }
}
export default withAuthorization(Additions, "admin");
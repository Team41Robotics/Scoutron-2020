import React, { Component } from 'react';
// Bootstrap
import Col from 'react-bootstrap/Col';

import { Form, FormControl, FormLabel, Button } from "react-bootstrap";
import Jumbotron from "react-bootstrap/Jumbotron";
import { withAuthorization } from '../Session';

class Roster extends Component{
    constructor(props){
        super(props);
        this.state = {
            ready: false,
            ids:[]            
        }
        this.handleChange = this.handleChange.bind(this);
        this.getUsers = this.getUsers.bind(this);

    }
    getUsers(){
        this.props.firebase.table('/').on('value', snapshot => {
			const table = snapshot.val();
            let ids = table["users"]
            this.setState({
                ids,
                ready: true   

            });

		});
    }
    componentDidMount(){
        this.getUsers();
        
    }
    handleChange(event){
        let value = "";
        (this.props.firebase.alternateRole(event.target.id).once('value',snapshot =>{
            value = snapshot.val();
        }));
        console.log(value)
        this.props.firebase.alternateRole(event.target.id).set(value=="scout" ? "admin":"scout");
        console.log("handle changed");
    }
    render(){
        
        if(this.state.ready){
            return(
                <Jumbotron className="mx-3 mx-sm-5 my-3 py-5 bg-dark text-white">
                    <h1> Roster</h1>
                    <br/>
                    
                    <Form.Row>
                        {Object.keys(this.state.ids).map((person,index)=>{
                            let usName = this.state.ids[person];
                          
                            return(
                                
                                <Form.Group as={Col} className="text-center col-6 col-md-4">
                                <Form.Check
                                    type="switch" 
                                    id= {Object.keys(this.state.ids)[index]}
                                    label= {usName["username"]}
                                    checked = {usName["role"]=="scout"}
                                    onChange={this.handleChange}
                                />
                                </Form.Group>
                            )
                        })}
                    </Form.Row>
                   
                </Jumbotron>

            )
        }else{
            return <h1>loading</h1>
        }
    }
}
export default withAuthorization(Roster,"admin");
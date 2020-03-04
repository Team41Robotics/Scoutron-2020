import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import 'firebase/auth';
import * as ROUTES from '../../constants/routes';
class SignInPage extends React.Component {
	render() {
		return (
			<div>
				<h1>SignIn</h1>
				<SignInForm/>
			</div>
		);
	}
}
const INITIAL_STATE = {
	email: '',
	password: '',
	error: null,
};
class SignInFormBase extends Component {
	constructor(props) {
		super(props);
		this.state = { ...INITIAL_STATE }
		this.user = null;
		this.fb = this.props.firebase;
	};

	render() {
		this.fb.doSignInWithRedirect().then(() => {
			console.log("Going");
		});
		this.setState({ ...INITIAL_STATE });
		this.props.history.push(ROUTES.LANDING);

		return <h2>Loading Login...</h2>;
	}
}
const SignInForm = compose(
	withRouter,
	withFirebase,
)(SignInFormBase);
export default SignInPage;
export { SignInForm };
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
const SignOutPage = () => (
	<div>
		<h1>SignIn</h1>
		<SignOutForm />
	</div>
);
class SignOutFormBase extends Component {
	render() {
		//const { email, password } = this.state;
		this.props.firebase
			//.doSignInWithEmailAndPassword(email, password)
			.doSignOut()
			.then(() => {
				this.props.history.push(ROUTES.LANDING);
			});
		return <h2>Loading Login...</h2>;
	}
}
const SignOutForm = compose(
	withRouter,
	withFirebase,
)(SignOutFormBase);
export default SignOutPage;
export { SignOutForm };
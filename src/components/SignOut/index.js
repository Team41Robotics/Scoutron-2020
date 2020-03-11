import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import { withCookies } from "react-cookie";
import * as ROUTES from '../../constants/routes';
const SignOutPage = () => (
	<div>
		<h1>SignOut</h1>
		<SignOutForm />
	</div>
);
class SignOutFormBase extends Component {
	constructor(props) {
		super(props);
		this.cookies = this.props.cookies;
	}
	render() {
		// this.props.cookies.remove('uid', { path: '/' });
		// this.props.cookies.remove('sid', { path: '/' });
		this.props.firebase
			.doSignOut()
			.then(() => {
				this.cookies.remove('sid');
				this.cookies.remove('uid');
				this.props.history.push(ROUTES.LANDING);
			});
		return <h2>Loading Logout...</h2>;
	}
}
const SignOutForm = compose(
	withRouter,
	withFirebase,
	withCookies,
)(SignOutFormBase);
export default SignOutPage;
export { SignOutForm };
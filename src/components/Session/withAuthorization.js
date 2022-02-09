import React from 'react';
import AuthUserContext from "./context";
import { withFirebase } from '../Firebase';
import {compose} from "recompose";


const withAuthorization = (Component, role) => {
	class WithAuthorization extends React.Component {
		constructor(props) {
			super(props);
			if (this.props.cookies.get('sid')) {
				this.id = this.props.cookies.get('sid').substring(0, this.props.cookies.get('sid').search('@'));
			}
			this.state = {
				role: '',
			}
		}

		componentDidMount() {
			if (this.id) {
				this.props.firebase.user(this.id).on('value', snapshot => {
					if (snapshot.val()) {
						this.setState({
							role: snapshot.val()['role'],
						});
					}
				});
			}
			this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
				if ((this.state.role !== role)) {
					this.setState( {role:"reg"} );
				}
				},
			);
		}

		componentWillUnmount() {
			this.listener();
		}

		render() {
			return (
				<AuthUserContext.Provider value={this.state.authUser}>
					{(this.state.role === role) ? <Component {...this.props} /> : null}
				</AuthUserContext.Provider>
			);
		}
	}
	return (
		compose(
			withFirebase,
		)(WithAuthorization)
	);
};

export default withAuthorization;
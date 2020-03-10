import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
//Router
import * as ROUTES from '../../constants/routes';
// User stuff
import {withAuthentication} from "../Session";
import {withCookies} from "react-cookie";
import {AuthUserContext} from "../Session/";
// My stuff
import MatchInput from "../MatchInput";
import PitInput from "../PitInput";
import Profile from "../Profile";
import Navigation from '../Navigation';
import LandingPage from '../Landing';
import AdminPage from '../Admin';
import PitAdminPage from "../PitAdmin";
import UserData from "../UserData";
import SignInPage from "../SignIn";
import SignOutPage from "../SignOut";
import { withFirebase } from '../Firebase';
import '../App/App.css';
//Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import * as ROLES from "../../constants/roles";


class App extends React.Component {
	constructor(props) {
		super(props);
		// User ID
		this.uid = null;
		this.state = {
			authUser: null,
			role: '',
		};
		if (this.props.cookies.get('sid')) {
			this.id = this.props.cookies.get('sid').substring(0, this.props.cookies.get('sid').search('@'));
		}
		this.condition = authUser => authUser && (this.state.role === ROLES.ADMIN);
	}
	componentDidMount() {
		this.listener = this.props.firebase.auth.onAuthStateChanged(
			authUser => {
				authUser
					? this.setState({ authUser })
					: this.setState({ authUser: null });
		});
		if (this.id) {
			this.props.firebase.user(this.id).on('value', snapshot => {
				this.setState({role: snapshot.val()['role']});
			});
		}
	}
	componentWillUnmount() {
			this.listener();
	}
	render() {
		if (this.props.cookies.get('sid')) {
			this.id = this.props.cookies.get('sid').substring(0, this.props.cookies.get('sid').search('@'));
			this.condition = authUser => (authUser && (this.state.role === ROLES.ADMIN))
		}
		return (
			<AuthUserContext.Provider value={this.state.authUser}>
				<Router>
					<div>
						<Navigation cookies={this.props.cookies} props={this.props}/>

						<hr />

						<Route exact path={ROUTES.LANDING} render={ () => (<LandingPage cookies={this.props.cookies}/>) } />
						<Route path={ROUTES.SIGN_OUT} render={ () => (<SignOutPage cookies={this.props.cookies}/>) } />
						<Route path={ROUTES.SIGN_IN} component={SignInPage} />
						<Route path={ROUTES.ADMIN} render={ () => (<AdminPage cookies={this.props.cookies}/>) } />
						<Route path={ROUTES.PITADMIN} render={ () => (<PitAdminPage cookies={this.props.cookies}/>) } />
						<Route path={ROUTES.USERDATA} render={ () => (<UserData cookies={this.props.cookies}/>) } />
						<Route path={ROUTES.SCOUT_MATCH} render={ () => (<MatchInput cookies={this.props.cookies}/>) } />
						<Route path={ROUTES.SCOUT_PIT} render={ () => (<PitInput cookies={this.props.cookies} />) } />
						<Route path={ROUTES.PROFILE} render={ () => (<Profile cookies={this.props.cookies} />) } />
					</div>
				</Router>
			</AuthUserContext.Provider>
		);
	}
}

export default withFirebase(withCookies(withAuthentication(App)));
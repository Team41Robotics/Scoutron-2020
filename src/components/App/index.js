import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
//Router
import * as ROUTES from '../../constants/routes';
// User stuff
import {withAuthentication} from "../Session";
import {withCookies} from "react-cookie";
// My stuff
import MatchInput from "../MatchInput";
import PitInput from "../PitInput";
import Profile from "../Profile";
import Navigation from '../Navigation';
import LandingPage from '../Landing';
import AdminPage from '../Admin';
import SignInPage from "../SignIn";
import SignOutPage from "../SignOut";
import '../App/App.css';
//Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';


class App extends React.Component {
	constructor(props) {
		super(props);
		// User ID
		this.uid = null;
	}
	render() {
	return (
	<Router>
		<div>
			<Navigation />

			<hr />

			<Route exact path={ROUTES.LANDING} render={ () => (<LandingPage cookies={this.props.cookies}/>) } />
			<Route path={ROUTES.SIGN_OUT} component={SignOutPage} />
			<Route path={ROUTES.SIGN_IN} component={SignInPage} />
			<Route path={ROUTES.ADMIN} component={AdminPage} />
			<Route path={ROUTES.SCOUT_MATCH} render={ () => (<MatchInput cookies={this.props.cookies}/>) } />
			<Route path={ROUTES.SCOUT_PIT} render={ () => (<PitInput cookies={this.props.cookies} />) } />
			<Route path={ROUTES.PROFILE} render={ () => (<Profile cookies={this.props.cookies} />) } />
		</div>
	</Router>
);}
}

export default withCookies(withAuthentication(App));
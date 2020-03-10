import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
	apiKey: "AIzaSyDLet6tdw7P8hBW1vm4YlaD0dCYY_XoRTA",
	authDomain: "scoutron-16785.firebaseapp.com",
	databaseURL: "https://scoutron-16785.firebaseio.com",
	projectId: "scoutron-16785",
	storageBucket: "scoutron-16785.appspot.com",
	messagingSenderId: "301242342099",
	appId: "1:301242342099:web:9c4d5f0849fb4f07ab9226",
	measurementId: "G-ZS8G44NK01"
};

class Firebase {
	constructor() {
		app.initializeApp(config);
		this.auth = app.auth();
		this.db = app.database();
		this.provider = new app.auth.GoogleAuthProvider();
		this.currentUserID = null;
		this.currentMatch = null;
	};

	// AUTH API
	doSignInWithRedirect = () =>
		this.auth.signInWithRedirect(this.provider);

	doGetResults = () =>
		this.auth.getRedirectResult();

	doSignInWithPopup = () =>
		this.auth.signInWithPopup(this.provider);

	doSignOut = () =>
		this.auth.signOut();


	// USER API
	table = place => this.db.ref(`${place}`);
	user = uid => this.db.ref(`/users/${uid}`);
	users = () => this.db.ref('/users');
	scoutData = uid => matchNum => teamNum => this.db.ref(`/scoutData/${uid}/${matchNum}-${teamNum}`);
	otherScoutData = uid => matchTeam => this.db.ref(`/scoutData/${uid}/${matchTeam}`);
	pitData = uid => teamNum => this.db.ref(`/pitData/${uid}/${teamNum}`);
	matchInfo = uid => this.db.ref(`/scoutAssignments/${uid}/`);

	matchIsDone = uid => matchTeam => {
		this.otherScoutData(uid)(matchTeam).on('value', snapshot => {
			return snapshot.val();
		});
		console.log(this.currentMatch);
		return !!this.currentMatch;
	}
}


export default Firebase;
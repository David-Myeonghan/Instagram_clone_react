import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import firebase from "firebase/app";
import "firebase/firestore";
import { db, auth } from "./firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button, Input } from "@material-ui/core";

function getModalStyle() {
	const top = 50;
	const left = 50;

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`,
	};
}

const useStyles = makeStyles((theme) => ({
	paper: {
		position: "absolute",
		width: 400,
		backgroundColor: theme.palette.background.paper,
		border: "2px solid #000",
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	},
}));

function App() {
	const classes = useStyles();
	const [modalStyle] = useState(getModalStyle);

	const [posts, setPosts] = useState([]);
	const [open, setOpen] = useState(false);
	const [openSignIn, setOpenSignIn] = useState(false);

	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [user, setUser] = useState(null);

	useEffect(() => {
		auth.onAuthStateChanged((authUser) => {
			if (authUser) {
				// ..user has logged in...
				console.log(authUser);
				setUser(authUser);
			} else {
				// user has logged out.
				setUser(null);
			}
		});
	}, [user, username]);

	useEffect(() => {
		db.collection("posts").onSnapshot((snapshot) => {
			//every time a new post is added, this code fires.
			setPosts(
				snapshot.docs.map((doc) => ({
					id: doc.id,
					post: doc.data(),
				}))
			);
		});
	}, []);

	const signUp = (event) => {
		event.preventDefault();
		auth
			.createUserWithEmailAndPassword(email, password)
			.then((authUser) => {
				return authUser.user.updateProfile({
					displayName: username,
				});
			})
			.catch((error) => alert(error.message));

		setOpen(false);
	};

	const signIn = (event) => {
		event.preventDefault();

		auth.signInWithEmailAndPassword(email, password).catch((error) => alert(error.message));
		setOpenSignIn(false);
	};

	return (
		<div className="app">
			<Modal open={open} onClose={() => setOpen(false)}>
				<div style={modalStyle} className={classes.paper}>
					<form className="app__signup">
						<center>
							<img
								className="app__headerImage"
								src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
								alt=""
							/>
						</center>
						<Input placeholder="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
						<Input placeholder="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
						<Input
							placeholder="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<Button type="submit" onClick={signUp}>
							Sign Up
						</Button>
					</form>
				</div>
			</Modal>

			<Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
				<div style={modalStyle} className={classes.paper}>
					<form className="app__signup">
						<center>
							<img
								className="app__headerImage"
								src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
								alt=""
							/>
						</center>
						<Input placeholder="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
						<Input
							placeholder="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<Button type="submit" onClick={signIn}>
							Sign In
						</Button>
					</form>
				</div>
			</Modal>

			<div className="app__header">
				<img
					className="app__headerImage"
					src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
					alt=""
				></img>
			</div>

			{user ? (
				<Button onClick={() => auth.signOut()}>Logout</Button>
			) : (
				<div className="app__loginContainer">
					<Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
					<Button onClick={() => setOpen(true)}>Sign Up</Button>
				</div>
			)}

			<h1>Instagram clone</h1>

			{posts.map(({ id, post }) => (
				<Post key={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
			))}

			{/* <Post
				username="myDav12"
				caption="ReactJS"
				imageUrl="https://images.unsplash.com/photo-1593642533144-3d62aa4783ec?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"
			/>
			<Post
				username="Ryu"
				caption="So lit!"
				imageUrl="https://images.unsplash.com/photo-1604987293212-5aea39d94ccb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80"
			/>
			<Post
				username="David"
				caption="DOPE"
				imageUrl="https://images.unsplash.com/photo-1605041176777-23275b7a1410?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=954&q=80"
			/> */}
		</div>
	);
}

export default App;

import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
// import firebase from "firebase/app";
import { db, auth } from "./firebase";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { Button, Input } from "@material-ui/core";
import ImageUpload from "./ImageUpload";
import InstagramEmbed from "react-instagram-embed";
import axios from "./axios";
import Pusher from "pusher-js";

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

	const fetchPosts = async () =>
		await axios.get("/sync").then((response) => {
			console.log(response);
			setPosts(response.data);
		});

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
		const pusher = new Pusher("631fb65b0dc2df2b3196", {
			cluster: "ap4",
		});

		const channel = pusher.subscribe("posts");
		channel.bind("inserted", (data) => {
			console.log("data recieved", data);
			fetchPosts();
		});
	}, []);

	useEffect(() => {
		// db.collection("posts")
		// 	.orderBy("timestamp", "desc")
		// 	.onSnapshot((snapshot) => {
		// 		//every time a new post is added, this code fires.
		// 		setPosts(
		// 			snapshot.docs.map((doc) => ({
		// 				id: doc.id,
		// 				post: doc.data(),
		// 			}))
		// 		);
		// 	});

		fetchPosts(); // when using async function.
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
		setEmail("");
		setPassword("");
	};

	const signIn = (event) => {
		event.preventDefault();

		auth.signInWithEmailAndPassword(email, password).catch((error) => alert(error.message));
		setOpenSignIn(false);

		setEmail("");
		setPassword("");
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
				<a className="app__top" href="#top">
					<img
						className="app__headerImage"
						src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
						alt=""
					></img>
				</a>
				{user ? (
					<Button onClick={() => auth.signOut()}>Logout</Button>
				) : (
					<div className="app__loginContainer">
						<Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
						<Button onClick={() => setOpen(true)}>Sign Up</Button>
					</div>
				)}
			</div>

			<div className="app__posts">
				<div className="app__postLeft">
					{posts.map((post) => (
						<Post
							key={post._id}
							postId={post._id}
							user={user}
							username={post.user}
							caption={post.caption}
							imageUrl={post.image}
						/>
					))}
				</div>
				<div className="app__postRight">
					<InstagramEmbed
						url="https://www.instagram.com/p/B_uf9dmAGPw/"
						clientAccessToken="208671947296469|7ca2a580366a759d09ee1097773c39ba"
						maxWidth={320}
						hideCaption={false}
						containerTagName="div"
						protocol=""
						injectScript
						onLoading={() => {}}
						onSuccess={() => {}}
						onAfterRender={() => {}}
						onFailure={() => {}}
					/>
				</div>
			</div>

			{user?.displayName ? <ImageUpload username={user.displayName} /> : <h3>You need to login to upload</h3>}
		</div>
	);
}

export default App;

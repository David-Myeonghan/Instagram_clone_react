import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import { db } from "./firebase";

function App() {
	const [posts, setPosts] = useState([
		{
			username: "JS",
			caption: "cloning",
			imageUrl:
				"https://images.unsplash.com/photo-1605041176777-23275b7a1410?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=954&q=80",
		},
		{
			username: "Insta",
			caption: "1 gram",
			imageUrl:
				"https://images.unsplash.com/photo-1605033224723-0277b1e7b995?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=675&q=80",
		},
	]);

	useEffect(() => {
		db.collection("posts");
	}, []);

	return (
		<div className="app">
			<div className="app__header">
				<img
					className="app__headerImage"
					src="https://instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
					alt=""
				></img>
			</div>
			<h1>Instagram clone</h1>

			{posts.map((post) => (
				<Post username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
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

import React, { useState } from "react";
import { Button } from "@material-ui/core";

function ImageUpload() {
	const [progress, setProgress] = useState(0);
	const [image, setImage] = useState(null);
	const [caption, setCaption] = useState("");

	// to pick just one file.
	const handleChange = (e) => {
		if (e.target.files[0]) {
			setImage(e.target.files[0]);
		}
	};

	const handleUpload = () => {};

	return (
		<div>
			{/* // caption input */}
			{/* // file picker */}
			{/* // post button */}

			<input type="text" placeholder="Enter a caption..." onChange={(event) => setCaption(event.target.value)} />
			<input type="file" onChange={handleChange} />
			<Button className="imageupload__button" onClick={handleUpload}>
				Upload
			</Button>
		</div>
	);
}

export default ImageUpload;

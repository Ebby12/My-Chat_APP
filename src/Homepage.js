import * as React from "react";
// import { styled } from '@mui/material/styles';//library design for text area
import Box from "@mui/material/Box"; // library -box/container grid view
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import SendIcon from "@mui/icons-material/Send";
import CloudQueueTwoToneIcon from '@mui/icons-material/CloudQueueTwoTone';


import {
	Card,
	IconButton,
	List,
	ListItem,
	ListItemText,
	TextField,
	Typography,
} from "@mui/material";
// import { withTheme } from "@emotion/react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

let stompClient = null;
export default function Homepage() {
	const [userData, setUserData] = React.useState({
		text: "",
		connected: false,
		date:
			new Date().getHours() +
			":" +
			new Date().getMinutes() +
			":" +
			new Date().getSeconds(),
	});
	const [getText, setText] = React.useState("");
	const [getChats, setChats] = React.useState([]);

	React.useEffect(() => {}, [userData]);

	const connectUser = () => {
		let socket = new SockJS("http://localhost:8080/ws"); //this is called for the first time only whenever the app starts
		stompClient = Stomp.over(socket); //connecting the application with the socket(websocket)
		stompClient.connect({}, onConnected, onError);
	};

	const onConnected = () => {
		setUserData({
			...userData,
			connected: true,
			date:
				new Date().getHours() +
				":" +
				new Date().getMinutes() +
				":" +
				new Date().getSeconds(),
		});
		console.log("onConnected");
		stompClient.subscribe("/chatroom", onTextRecieved); //it subscribes to recieve a msg whenever a message is sent by a client
		// stompClient.subscribe('/user/', onTextRecieved);
	};

	const onTextRecieved = (serverPayload) => {
		let jsonPayload = JSON.parse(serverPayload.body);

		switch (jsonPayload.status) {
			case "MESSAGE":
				getChats.push(jsonPayload);
				setChats([...getChats]);
				console.log("chats state: ", getChats);
				break;
		}
	};

	const onError = (e) => {
		console.log("An Error occured while connecting with the socket", e);
	};

	const onButtonClick = () => {
		console.log("buttonclick", getText);
	};

	const onValueChange = (e) => {
		const userText = e.target.value; //will fetch the text that we have entered in the input text-area
		setUserData({
			...userData,
			text: userText,
			date:
				new Date().getHours() +
				":" +
				new Date().getMinutes() +
				":" +
				new Date().getSeconds(),
		}); //updated input fetched from the input field
	};

	const sendMessage = () => {
		if (stompClient) {
			let message = {
				text: userData.text,
				status: "MESSAGE",
				date:
					new Date().getHours() +
					":" +
					new Date().getMinutes() +
					":" +
					new Date().getSeconds(),
			};
			let messageString = JSON.stringify(message);
			stompClient.send("/chatapp/message", {}, messageString); //sending the message to the controller class
			setUserData({ ...userData, text: "" }); //erases all the text after clicking the send button
		}
	};

	return (
		<Box sx={{ flexGrow: 1 }} width={600}>
			<Paper elevation={10}>
				<Typography
					align="center"
					variant="h4"
					gutterBottom
					color={"black"}
					fontWeight={"bold"}
				>
					<Paper elevation={3}>My Chat App</Paper>
					<div style={{ color: "blue", fontSize: "10px", paddingTop: "10px" }}>
						Press to connect{" "}
					</div>

					<IconButton>
						<CloudQueueTwoToneIcon fontSize="large" onClick={connectUser}> 
							{" "}
							Connect
						</CloudQueueTwoToneIcon>
						{/* MAKES CONNECTION WITH THE SOCKET (WS CONNECTION)*/}
					</IconButton>
				</Typography>
				<hr className="project-horizontal-line"/>
				<Grid item xs={8}>
					<Box
						style={{ minHeight: "70vh", maxHeight: "70vh", overflow: "auto" }}
					>
						{getChats.map((textchat, index) => (
							<Card className="project-card-view" > 

							
							<List>
								<ListItem>
									<Grid container>
										<Grid item xs={12}>
											<ListItemText
												align="center" 
												secondary={textchat.date}
								
											    primary={textchat.text}
											></ListItemText>
										</Grid>
									</Grid>
								</ListItem>
							</List>
							</Card>
						))}
					</Box>
				</Grid>

				{userData.connected ? (
					<Grid container spacing={2}>
						<Grid item xs={11}>
							<TextField
								id="outlined-basic-email"
								label="Type Something"
								fullWidth
								onChange={onValueChange}
								value={userData.text}
							/>
						</Grid>
						<Grid item xs={1}>
							<IconButton>
								<SendIcon onClick={sendMessage}></SendIcon>
							</IconButton>
						</Grid>
					</Grid>
				) : null}
			</Paper>
		</Box>
	);
}

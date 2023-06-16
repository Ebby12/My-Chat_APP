import * as React from "react";
// import { styled } from '@mui/material/styles';//library design for text area
import Box from "@mui/material/Box"; // library -box/container grid view
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import SendIcon from "@mui/icons-material/Send";

import TextareaAutosize from "@mui/base/TextareaAutosize";
import {
	List,
	ListItem,
	ListItemText,
	TextField,
	Typography,
} from "@mui/material";
import { withTheme } from "@emotion/react";
import SockJS from "sockjs-client";
import { Stomp } from '@stomp/stompjs';

export default function Homepage() {
	let stompClient = null;
  const [userData, setUserData] = React.useState({text:""});
	const [getText, setText] = React.useState("");
  const [getChats,setChats] = React.useState([]);


  React.useEffect(()=>{
	connectUser();
  })


	const connectUser = () => {
		let socket = new SockJS("http://localhost:8080/websocket"); //this is called for the first time only whenever the app starts
		stompClient = Stomp.over(socket); //connecting the application with the socket(websocket)
		stompClient.connect({},onConnected,onError)
	};



  const onConnected = ()=>{
//  setUserData({...text,"connected":true})
		stompClient.subscribe('/chatroom',onTextRecieved);
  }


  const onTextRecieved =(serverPayload)=>{
  	let jsonPayload = JSON.parse(serverPayload.body);

		getChats.push(jsonPayload);
		setChats([...getChats]);
		console.log("chats state: ", getChats)
  }

  const onError = (e)=>{
  console.log("An Error occured while connecting with the socket",e);
  }

  const onButtonClick = ()=>{
    console.log("buttonclick",getText);
  }
  
  const onValueChange=(e)=>{
	const userText= e.target.value; //will fetch the text that we have entered in the input text-area
	setUserData({...userData,"text":userText}) //prevents overriding of text 

  }

  const sendMessage=()=>{
	if(stompClient){
		let message = {text:userData.text}
		let messageString= JSON.stringify(message);
		stompClient.send('/chatapp/message',{},messageString);
	}
  }
  
	return (
		<Box sx={{ flexGrow: 1 }}
		
		width={600}><Paper elevation={10}> 
			<Typography
				align="center"
				variant="h4"
				gutterBottom
				color={"black"}
				fontWeight={"bold"}
			>
				<Paper elevation={3} >My Chat App</Paper>
			</Typography>
			<Grid item xs={8}>
				<Box style={{ minHeight: "70vh", maxHeight: "70vh", overflow: "auto" }}>
          {getChats.map((textchat,index)=>(


            <List>
            <ListItem>
              <Grid container>
                <Grid item xs={12}>
                  <ListItemText
                    align="left"
                    primary = {textchat.text}
                  ></ListItemText>
                </Grid>
              </Grid>
            </ListItem>
            </List>
          ))}
				</Box>
			</Grid>

			<Grid container spacing={2}>
				<Grid item xs={11}>
					<TextField
						id="outlined-basic-email"
						label="Type Something"
						fullWidth
						onChange= {onValueChange
							
						}
					/>
				</Grid>
				<Grid item xs={1}>
					<SendIcon onClick={sendMessage}></SendIcon>
				</Grid>
			</Grid>
			</Paper>
		</Box>
	);
}

import React, {Component} from 'react'
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import { ListItem, Icon } from 'react-native-elements';
import { RFValue } from 'react-native-responsive-fontsize';
import firebase from '../config'

export default class ChatRoom extends Component {
  constructor(props) {
      super(props);
      this.state = {
        isEnabled: false,
        light_theme: true,
        isDataFetched: false,
        list: [], // To store the list of chat rooms
        message:'',
        name:'',
        chat:false
      };
  }
  
  async componentDidMount() {
  try {
    this.fetchUser();

    // Fetch chat room information and populate roomInfo
    await this.fetchChatRoomInfo();

    // Call checkRoom only after roomInfo is populated
    this.checkRoom();

    // Set up a real-time listener
    const userIDs = [firebase.auth().currentUser.uid, this.props.route.params.user_id];
    userIDs.sort();
    const chatRoomID = userIDs.join('_');
    this.dataRef = firebase.database().ref('/chatList/' + chatRoomID);
    this.dataRef.on('value', this.handleDataChange);

    // Set up the theme listener
    this.themeRef = firebase.database().ref('/users/' + firebase.auth().currentUser.uid);
    this.themeRef.on('value', this.handleThemeChange);

    // Add the name to the chat (you might want to call this function conditionally)
    this.addName();
  } catch (error) {
    console.error('Error in componentDidMount:', error);
  }
}
  
  componentWillUnmount() {
    // Remove the listener when the component is unmounted
    this.dataRef.off('value', this.handleDataChange);
    this.themeRef.off('value', this.handleThemeChange);
  }

  handleThemeChange = (snapshot) => {
    const data = snapshot.val().current_theme;
    if (data) {
      this.setState({
        light_theme: data == 'light' ? true : false,
        isEnabled: data == 'light' ? false : true,
      });
    }
  };

  handleDataChange = (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const main = Object.values(data);
      this.setState({
        list: main,
        isDataFetched: true,
      });
    }
  };

  async fetchUser() {
    let name;
    await firebase
      .database()
      .ref('/users/' + firebase.auth().currentUser.uid)
      .on('value', function (snapshot) {
        name = `${snapshot.val().first_name}`;
      });
    this.setState({
      name: name,
    });
  }

  async sendMessage() {
    await this.checkRoom()
    if (this.state.message !== '') {
      const senderID = firebase.auth().currentUser.uid;
      const receiverID = this.props.route.params.user_id;
  
      // Call the checkRoom function to determine the room ID
      const roomID = this.checkRoom(senderID, receiverID);
  
      if (roomID) {
        // Room already exists, send the message to the existing room
        const date = new Date();
        const messageDetails = {
          date: date.toString(),
          sender_id: senderID,
          receiver_id: receiverID,
          message: this.state.message,
          receiver_name: this.props.route.params.name,
          sender_name: this.state.name,
        };
  
        // Use the roomID to set the message in the appropriate room
        await firebase
          .database()
          .ref('/chatList/' + roomID + '/' + date.toString().slice(16, 24))
          .set(messageDetails);
      } else {
        // Room doesn't exist, you can handle this case as needed
        console.log('Room does not exist. You can handle this case here.');
      }
  
      this.setState({ message: '' });
    } else {
      return;
    }
  }
  

  async fetchChatRoomInfo() {
    const chatRoomsRef = firebase.database().ref('/chatList');
  
    chatRoomsRef.once('value', (snapshot) => {
      const chatRooms = snapshot.val();
      if (chatRooms) {
        const roomInfo = [];
        Object.keys(chatRooms).forEach((roomID) => {
          const [user1_id, user2_id] = roomID.split('_');
          roomInfo.push({
            roomID,
            user1_id,
            user2_id,
          });
        });
  
        // Set roomInfo as a component state
        this.setState({ roomInfo });
      }
    });
  }

  async checkRoom() {
    await this.fetchChatRoomInfo();

    const senderID = firebase.auth().currentUser.uid;
    const receiverID = this.props.route.params.user_id;
  
    // Initialize roomInfo with an empty array
    this.setState({ roomInfo: [] });
  
    // Fetch chat room information and populate roomInfo
    
  
    // Access roomInfo from the component's state
    const roomInfo = this.state.roomInfo;
  
    console.log('senderID:', senderID);
    console.log('receiverID:', receiverID);
    console.log('roomInfo:', roomInfo);
  
    const existingRoom = roomInfo.find((room) => {
      console.log('Checking room:', room);
      return (room.user1_id === senderID && room.user2_id === receiverID) ||
            (room.user1_id === receiverID && room.user2_id === senderID);
    });
  
    if (existingRoom) {
      // Use the existing room
      console.log('Using existing room:', existingRoom.roomID);
      this.dataRef = firebase.database().ref('/chatList/' + existingRoom.roomID);
    } else {
      // Create a new room
      console.log('Creating a new room');
      const userIDs = [senderID, receiverID];
      userIDs.sort(); // Sort to ensure consistency
      const chatRoomID = userIDs.join('_');
      this.dataRef = firebase.database().ref('/chatList/' + chatRoomID);
    }
  }

  async addName(){
    if (this.state.chat == true){
      let name={
        reciever_name: this.props.route.params.name,
        sender_name: this.state.name
      }
      await firebase
      .database()
      .ref('/chatList/' + `${details.sender_id}_${details.reciever_id}/`)
      .set(name);
    }else{return}
  }

  renderItem = ({ item }) => {
    return (
      <View style={{ backgroundColor:this.state.light_theme?'#2f4f4f':'#87cefa',margin:5}}>
        <ListItem
          key={item}
          bottomDivider
          containerStyle={
            this.state.light_theme ? styles.list : styles.listLight
          }>
          <Icon
            type={'ionicon'}
            name={'car'}
            size={25}
            color={this.state.light_theme?'black':'black'}
          />
          <ListItem.Content>
            
            <ListItem.Title
              style={{
                padding:5,
                margin:5,
                color:this.state.light_theme?'#00008b':'#e6e6fa',
                fontSize:RFValue(20)
              }}
            >
              <Text>
              <Text style={{color:this.state.light_theme? '#000000':'#e0ffff' }}> {`${item.message}`} </Text>
              </Text>
            </ListItem.Title>

            <ListItem.Subtitle 
              style={{
                padding:5,
                margin:5,
                color:this.state.light_theme?'#483d8b':'#fff0f5',
                fontSize:RFValue(20)
              }}
            >
              <Text >
              <Text style={{color:this.state.light_theme? '#000000':'#e0ffff'}}> 
                    {/*`${item.date.slice(16,24)}`*/} 
                  </Text>
              </Text>

            </ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      </View>
    );
  };

  render(){
    return(
      <View>
        <Text>{this.props.route.params.name}</Text>
        <View
          style={{flex:1}}>
          <FlatList
            data={this.state.list}
            renderItem={this.renderItem}
            //keyExtractor={(item, index) => item} // Use the actual key of each message
            style={{ backgroundColor: this.state.light_theme ? '#2f4f4f' : '#87cefa' }}
          />
        </View>
        <TextInput
            onChangeText={(text)=>this.setState({message:text})}
            placeholder={this.state.message}
            placeholderTextColor={'#FFFFFF'}
            autoFocus
            style={{}}
          />
        <TouchableOpacity onPress={()=>this.sendMessage()}>
          <Text>
            Send
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#2f4f4f'
  },
  appContainerLight: {
    flex: 1,
    backgroundColor: '#87cefa'
  },
  listItem: {
    flex: 1,
    backgroundColor: '#808080',
    
  },
  listItemLight: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    
  },
});
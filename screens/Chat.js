import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { ListItem, Icon } from 'react-native-elements';
import { RFValue } from 'react-native-responsive-fontsize';
import firebase from '../config';

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEnabled: false,
      light_theme: true,
      isDataFetched: false,
      chatList: [], // To store the list of chat rooms
    };
  }

  componentDidMount() {
    // Set up a real-time listener
    this.fetchChatRoomInfo();
    this.fetchUser()
    this.dataRef = firebase.database().ref('/users/' + firebase.auth().currentUser.uid);
    this.dataRef.on('value', this.handleThemeChange);
  }

  componentWillUnmount() {
    // Remove the listener when the component is unmounted
    this.dataRef.off('value', this.handleThemeChange);
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

  async fetchChatRoomInfo() {
    try {
      const currentUserID = firebase.auth().currentUser.uid;
      const chatRoomsRef = firebase.database().ref('/chatList');
      const snapshot = await chatRoomsRef.once('value');
      const chatRooms = snapshot.val();
      if (chatRooms) {
        const roomInfo = [];
        Object.keys(chatRooms).forEach((roomID) => {
          if (roomID !== "null") { // Check if the roomID is not "null"
            const [user1_id, user2_id] = roomID.split('_');
            console.log(user1_id)
            roomInfo.push({
              roomID,
              user1_id,
              user2_id,
            });
          }
        });
        //console.log(roomInfo)

        // Check each room for user id matching the current user id
        const matchingRooms = roomInfo.filter((room) => {
          return room.user1_id === currentUserID || room.user2_id === currentUserID;
        });
        this.setState({ chatList: matchingRooms });
        
      }
    } catch (error) {
      console.error('Error fetching chat room info:', error);
    }
  }

  async fetchUser() {
    try {
      const snapshot = await firebase.database().ref('/users').once('value');
      const data = snapshot.val();
      let detail = [];
  
      if (data) {
        // Extract user IDs and details from data object
        detail = Object.entries(data).map(([userID, userDetails]) => ({
          userID,
          ...userDetails
        }));
      }
  
      this.setState({
        isDataFetched: true, // Update the flag
        detail: detail,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  


  renderItem = ({ item }) => {
    const currentUserID = firebase.auth().currentUser.uid;
  
    let otherUserID;
    if (item.user1_id === currentUserID) {
      otherUserID = item.user2_id;
    } else {
      otherUserID = item.user1_id;
    }

    let names;
    for (let i = 0; i < this.state.detail.length; i++) {
      if (this.state.detail[i].userID === otherUserID) {

        first_name=this.state.detail[i].first_name
        last_name=this.state.detail[i].last_name
        const first_last = [first_name, last_name]
        names= first_last.join(' ')

        break; // Stop iterating once the other user is found
      }
    }
  
    return (
      <TouchableOpacity onPress={() => this.props.navigation.navigate("ChatRoom", { chat: item })}>
        <View style={this.state.light_theme ? styles.list : styles.listLight}>
          <ListItem bottomDivider containerStyle={this.state.light_theme ? styles.listItemLight : styles.listItem}>
            <Icon
              type="ionicon"
              name="person-circle-outline"
              size={25}
              color={this.state.light_theme ? 'black' : 'white'}
            />
            <ListItem.Content>
              <ListItem.Title style={styles.listTitle}>
                <Text>{names}</Text>
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </View>
      </TouchableOpacity>
    );
  }
  
  

  render() {
    return (
      <View style={this.state.light_theme ? styles.appContainerLight :styles.appContainer}>
        <View style={{ flex: 1 }}>
          {this.state.isDataFetched ? (
            <FlatList
            data={this.state.chatList}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => item} // Use the actual key of each message
            style={{ backgroundColor: this.state.light_theme ? '#2f4f4f' : '#87cefa' }}
          />
          ) : (
            <Text>Loading...</Text>
          )}
        </View>
      </View>
    );
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
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
    this.fetchChatList();
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

  fetchChatList = async () => {
    try {
      const snapshot = await firebase.database().ref('/chatList/').once('value');
      const data = snapshot.val();
      console.log(data)
      if (data) {
        const main = Object.values(data);
        console.log(main)
        this.setState({
          chatList: main,
          isDataFetched: true,
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  renderItem =({item})=>{
    console.log(item)
    return(
      <TouchableOpacity onPress={()=>this.props.navigation.navigate("ChatRoom")}>
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
                <Text>
                <Text style={styles.listTitle}>{item.message}</Text>
                </Text>
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </View>
      </TouchableOpacity>
    )
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
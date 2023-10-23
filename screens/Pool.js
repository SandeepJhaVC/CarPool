//rider.js

import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { ListItem, Icon } from 'react-native-elements';
import { RFValue } from 'react-native-responsive-fontsize';
import firebase from '../config'

export default class Rider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: [],
      isDataFetched: false, // Add a flag to track data fetching status
      light_theme: true,
      isEnabled: false,
    };
  }

  componentDidMount() {
    this.fetchUser();

    // Set up a real-time listener
    this.dataRef = firebase.database().ref('/details/');
    this.dataRef.on('value', this.handleDataChange);

    this.themeRef = firebase
      .database()
      .ref('/users/' + firebase.auth().currentUser.uid);
    this.themeRef.on('value', this.handleThemeChange);
  }

  componentWillUnmount() {
    // Remove the listener when the component is unmounted
    this.dataRef.off('value', this.handleDataChange);
    this.themeRef.off('value', this.handleThemeChange);
  }

  handleDataChange = (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const main = Object.values(data);
      this.setState({
        detail: main,
        isDataFetched: true,
      });
    }
  };

  handleThemeChange = (snapshot) => {
    const data = snapshot.val().current_theme;
    if (data) {
      this.setState({
        light_theme: data == 'light' ? false : true,
        isEnabled: data == 'light' ? true : false,
      });
    }
  };

  async fetchUser() {
    
    try {
      const snapshot = await firebase.database().ref('/details/').once('value');
      const data = snapshot.val();
      let main;

      if (data) {
        main = Object.values(data); // Extract values from data object
      }

      this.setState({
        isDataFetched: true, // Update the flag
        detail: main,
      });

      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity 
        onPress={()=>
          this.props.navigation.navigate("Details",{details:item})
          }>
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
            color={this.state.light_theme?'black':'white'}
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
              From: <Text style={{color:this.state.light_theme? '#000000':'#e0ffff' }}> {`${item.from_where}`} </Text>
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
              To: <Text style={{color:this.state.light_theme? '#000000':'#e0ffff'}}> 
                    {`${item.to_where}`} 
                  </Text>
              </Text>

            </ListItem.Subtitle>
            
            <View>

              <Text 
                style={{
                  padding:5, 
                  margin:5, 
                  color:this.state.light_theme?'#a9a9a9':'#fffacd',
                  fontSize:RFValue(15) 
                }}
              >
                Time: <Text style={{color:this.state.light_theme? '#000000':'#e0ffff'}}> {item.time} </Text>
              </Text>

            </View>
          </ListItem.Content>
        </ListItem>
      </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { isDataFetched } = this.state;

    if (!this.state.isDataFetched) {
      return (
        <View
          style={
            this.state.light_theme
              ? styles.textContainer
              : styles.textContainerLight
          }>
          <Text>Loading...</Text>
        </View>
      );
    } else if (this.state.isDataFetched) {
      if (!this.state.detail) {
        return (
          <View>
            <Text>No Poolers available</Text>
          </View>
        );
      }
    }

    return (
      <View style={{flex:1}}>
        <View
          style={{flex:1}}>
          <FlatList
            data={this.state.detail}
            renderItem={this.renderItem}
            style={{backgroundColor: this.state.light_theme ? '#2f4f4f':'#87cefa'}}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  list:{
    backgroundColor:"#696969",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    margin:5
  },
  listLight:{
    backgroundColor:"#48d1cc",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    margin:5
  }
});

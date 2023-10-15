//Car.js

import React, { Component, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Button,
} from 'react-native';

import firebase from '../config';

export default class Car extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: '',
      destination: '',
      to:'',
      from:'',
      no_plate: '',
      car: '',
      isEnabled: false,
      light_theme: true,
      name: '',
      contact: '',
    };
  }

  
  componentDidMount() {
    
    this.fetchUser();

    // Set up a real-time listener
    this.dataRef = firebase
      .database()
      .ref('/users/' + firebase.auth().currentUser.uid);
    this.dataRef.on('value', this.handleDataChange);
  }

  componentWillUnmount() {
    // Remove the listener when the component is unmounted
    this.dataRef.off('value', this.handleDataChange);
  }

  handleDataChange = (snapshot) => {
    const data = snapshot.val().current_theme;
    if (data) {
      this.setState({
        light_theme: data == 'light' ? true : false,
        isEnabled: data == 'light' ? false : true,
      });
    }
  };

  async fetchUser() {
    let name;
    await firebase
      .database()
      .ref('/users/' + firebase.auth().currentUser.uid)
      .on('value', function (snapshot) {
        name = `${snapshot.val().first_name} ${snapshot.val().last_name}`;
      });
    this.setState({
      name: name,
    });
  }

  async addDetails() {
    if (this.state.to && this.state.from) {
      var date = new Date();
      let details = {
        to_where:this.state.to,
        from_where:this.state.from,
        time: this.state.time,
        no_plate: this.state.no_plate,
        car: this.state.car,
        date: date.toString(),
        user_uid: firebase.auth().currentUser.uid,
        name: this.state.name,
        contact: this.state.contact,
      };
      await firebase
        .database()
        .ref('/details/' + Math.random().toString(36).slice(2))
        .set(details);
      alert('Submitted');
    } else {
      alert(
        'Error',
        'All fields are required!',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false }
      );
    }
  }
  render() {
    const { time, destination, no_plate, car } = this.state;
    return (
      <View
        style={
          this.state.light_theme
            ? styles.appContainerLight
            : styles.appContainer
        }>
        <View
          style={
            this.state.light_theme ? styles.containerLight : styles.container
          }>
          <View
            style={
              this.state.light_theme
                ? styles.textContainerLight
                : styles.textContainer
            }>
            <TextInput
              style={[
                {
                  borderWidth: 1,
                  padding: 5,
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  backgroundColor: '#2f4f4f',
                  color:this.state.light_theme
                  ? '#6495ed'
                  : '#f5f5f5',
                },
                {
                  backgroundColor: this.state.light_theme
                    ? '#b0e0e6'
                    : '#2f4f4f',
                },
              ]}
              placeholderTextColor={'#778899'}
              placeholder={'to'}
              onChangeText={(text) => this.setState({ to: text })}
            />

            <TextInput
              style={[
                {
                  borderWidth: 1,
                  padding: 5,
                  marginTop: 5,
                  backgroundColor: '#2f4f4f',
                  color:this.state.light_theme
                  ? '#6495ed'
                  : '#f5f5f5',
                },
                {
                  backgroundColor: this.state.light_theme
                    ? '#b0e0e6'
                    : '#2f4f4f',
                },
              ]}
              placeholderTextColor={'#778899'}
              placeholder={'from'}
              onChangeText={(text) => this.setState({ from: text })}
            />
            <TextInput
              style={[
                {
                  borderWidth: 1,
                  padding: 5,
                  marginTop: 5,
                  color:this.state.light_theme
                  ? '#6495ed'
                  : '#f5f5f5',
                },
                {
                  backgroundColor: this.state.light_theme
                    ? '#b0e0e6'
                    : '#2f4f4f',
                },
              ]}
              placeholderTextColor={'#778899'}
              placeholder={'Time'}
              onChangeText={(text) => this.setState({ time: text })}
            />

            <TextInput
              style={[
                {
                  borderWidth: 1,
                  padding: 5,
                  marginTop: 5,
                  color:this.state.light_theme
                  ? '#6495ed'
                  : '#f5f5f5',
                },
                {
                  backgroundColor: this.state.light_theme
                    ? '#b0e0e6'
                    : '#2f4f4f',
                },
              ]}
              placeholderTextColor={'#778899'}
              placeholder={'car model and color'}
              onChangeText={(text) => this.setState({ car: text })}
            />

            <TextInput
              style={[
                {
                  borderWidth: 1,
                  padding: 5,
                  marginTop: 5,
                  color:this.state.light_theme
                  ? '#6495ed'
                  : '#f5f5f5',
                },
                {
                  backgroundColor: this.state.light_theme
                    ? '#b0e0e6'
                    : '#2f4f4f',
                },
              ]}
              placeholderTextColor={'#778899'}
              placeholder={'no plate'}
              onChangeText={(text) => this.setState({ no_plate: text })}
            />

            <TextInput
              style={[
                {
                  borderWidth: 1,
                  padding: 5,
                  marginTop: 5,
                  borderBottomLeftRadius: 5,
                  borderBottomRightRadius: 5,
                  color:this.state.light_theme
                  ? '#6495ed'
                  : '#f5f5f5',
                },
                {
                  backgroundColor: this.state.light_theme
                    ? '#b0e0e6'
                    : '#2f4f4f',
                },
              ]}
              placeholderTextColor={'#778899'}
              placeholder={'Contact'}
              onChangeText={(text) => this.setState({ contact: text })}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              color={this.state.light_theme ? '#5f9ea0' : '#696969'}
              onPress={() => this.addDetails()}
              title="Submit"
            />
          </View>

          {this.isEnabled}
        </View>
      </View>
    
    
    );
  }
  
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#808080',
  },
  appContainerLight: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#808080',
    padding: 5,
    margin: 5,
  },
  containerLight: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#f0f8ff',
    padding: 5,
    margin: 5,
  },
  textContainer: {
    flex: 0.5,
    backgroundColor: '#808080',
    justifyContent: 'space-between',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    padding: 0,
    marginBottom: 100,
  },
  textContainerLight: {
    flex: 0.5,
    backgroundColor: '#f0f8ff',
    justifyContent: 'space-between',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    padding: 0,
    marginBottom: 100,
  },
  buttonContainer: {
    marginTop: 100,
  },
});

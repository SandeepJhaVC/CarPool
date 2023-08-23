import React, { Component, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Button,
} from 'react-native';

import firebase from 'firebase';

export default class Car extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: '',
      destination: '',
      no_plate: '',
      car: '',
      isEnabled: false,
      light_theme: true,
      name:"",
    };
  }

  componentDidMount(){
    this.fetchUser()
  }

  async fetchUser() {
    let theme,name;
    await firebase
      .database()
      .ref('/users/' + firebase.auth().currentUser.uid)
      .on('value', function (snapshot) {
        theme = snapshot.val().current_theme;
        name = `${snapshot.val().first_name} ${snapshot.val().last_name}`;
      });
    this.setState({
      light_theme: theme === 'light' ? true : false,
      isEnabled: theme === 'light' ? false : true,
      name: name,
    });
  }

  async addDetails() {
    if (this.state.destination) {
      date = new Date();
      let details = {
        location: this.state.destination,
        time: this.state.time,
        no_plate: this.state.no_plate,
        car: this.state.car,
        date: date.toString(),
        user_uid: firebase.auth().currentUser.uid,
        name: this.state.name,
      };
      await firebase
        .database()
        .ref('/details/' + Math.random().toString(36).slice(2))
        .set(details)
        .then(function (snapshot) {});

      this.props.setUpdateToTrue();
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
      <View style={this.state.light_theme ? styles.containerLight : styles.container}>
        <View style={this.state.light_theme ? styles.textContainerLight : styles.textContainer}>
        <TextInput
        styl={styles.textInput}
          placeholder={'destination'}
          onChangeText={(text) => this.setState({ destination: text })}
        />
        <TextInput
        styl={styles.textInput}
          placeholder={'Time'}
          onChangeText={(text) => this.setState({ time: text })}
        />

        <TextInput
        styl={styles.textInput}
          placeholder={'car model and color'}
          onChangeText={(text) => this.setState({ car: text })}
        />

        <TextInput
        styl={styles.textInput}
          placeholder={'no plate'}
          onChangeText={(text) => this.setState({ no_plate: text })}
        />
        
        </View>

        <Button color={this.state.light_theme ? "lightgrey" : "darkgrey"} onPress={() => this.addDetails()} title="Submit" />
        {this.isEnabled}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  containerLight: {
    flex: 1,
    backgroundColor: 'white',
  },
  textContainer: {
    backgroundColor: 'grey',
  },
  textContainerLight: {
    backgroundColor: 'white',
  },
})

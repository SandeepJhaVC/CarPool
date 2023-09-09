import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import firebase from 'firebase';

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      fontsLoaded: false,
      userSignedIn: false,
    };
  }

  signIn = async (email, password) => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      this.props.navigation.replace('Home');
    } catch (error) {
      alert(error.message);
    }
  };
  

  render() {
    const { email, password } = this.state;
    return (
      <View style={styles.loginContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/download.png')}
            style={styles.logo}></Image>
        </View>

        <View style={styles.textContainer}>
          <TextInput
            onChangeText={(text) => this.setState({ email: text })}
            placeholder={'Enter Email'}
            placeholderTextColor={'#FFFFFF'}
            autoFocus
            style={styles.textInput}
          />
          <TextInput
            onChangeText={(text) => this.setState({ password: text })}
            placeholder={'Enter Password'}
            placeholderTextColor={'#FFFFFF'}
            secureTextEntry
            style={styles.textInput}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.signIn(email, password)}>
            <Text style={styles.text}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.navigation.navigate('Register')}>
            <Text style={styles.text}>New User ?</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
  },

  buttonContainer: {
    flex: 0.2,
    justifyContent: 'space-between',
    padding: 10,
    margin: 10,
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginRight: 100,
    marginLeft: 100,
    marginTop: 20,
  },

  logoContainer: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
    marginTop: 20,
  },
  logo: {
    width: RFValue(140),
    height: RFValue(140),
    borderRadius: RFValue(70),
  },

  textContainer: {
    flex: 0.2,
    justifyContent: 'space-between',
    marginTop: 20,
    padding: 10,
  },
  textInput: {
    backgroundColor: '#DDDDDD',
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: 5,
  },
  text: {
    fontSize: 20,
  },
});

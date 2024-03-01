import React, { Component } from 'react';
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  StyleSheet
} from 'react-native';

import firebase from '../config';
import { RFValue } from 'react-native-responsive-fontsize';

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirmPassword: '',
      fontsLoaded: false,
    };
  }

  registerUser = (email, password, confirmPassword, first_name, last_name) => {
    if (password == confirmPassword) {
      firebase.auth()
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          alert('User registered!!');
          this.props.navigation.replace('Login');
          firebase
            .database()
            .ref('/users/' + userCredential.user.uid)
            .set({
              email: userCredential.user.email,
              first_name: first_name,
              last_name: last_name,
            });
        })

        .catch((error) => {
          alert(error.message);
        });
    } else {
      alert("Passwords don't match!");
    }
  };

  render() {
    const { email, password, confirmPassword, first_name, last_name } =
      this.state;

    return (
      <View style={styles.appContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/download.png')}
            style={styles.logo}></Image>
        </View>
        <View style={styles.container}>
          <View style={styles.textContainer}>
            <TextInput
              onChangeText={(text) => this.setState({ first_name: text })}
              placeholder={'First name'}
              placeholderTextColor={'#FFFFFF'}
            />
            <TextInput
              onChangeText={(text) => this.setState({ last_name: text })}
              placeholder={'Last name'}
              placeholderTextColor={'#FFFFFF'}
            />
            <TextInput
              onChangeText={(text) => this.setState({ email: text })}
              placeholder={'Enter Email'}
              placeholderTextColor={'#FFFFFF'}
            />
            <TextInput
              onChangeText={(text) => this.setState({ password: text })}
              placeholder={'Enter Password'}
              placeholderTextColor={'#FFFFFF'}
              secureTextEntry
            />
            <TextInput
              onChangeText={(text) => this.setState({ confirmPassword: text })}
              placeholder={'Re-enter Password'}
              placeholderTextColor={'#FFFFFF'}
              secureTextEntry
            />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() =>
                  this.registerUser(
                    email,
                    password,
                    confirmPassword,
                    first_name,
                    last_name
                  )
                }
                //style={styles.buttonContainer}
                >

                <Text>Register</Text>
              </TouchableOpacity>
            
          

            <TouchableOpacity
              onPress={() => this.props.navigation.replace('Login')}
              //style={styles.buttonContainer}
              >

              <Text>Login ?</Text>

            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 2,
    backgroundColor: '#2f4f4f',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#2f4f4f',
    padding: 5,
    margin: 5,
  },
  textContainer: {
    flex: 0.5,
    backgroundColor: '#2f4f4f',
    justifyContent: 'space-between',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    padding: 0,
    marginBottom: 100,
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
  buttonContainer: {
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginRight: 100,
    marginLeft: 100,
    marginTop: 20,
  }
});
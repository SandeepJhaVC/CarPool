import React, { Component } from 'react';
import { Text, TextInput, View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import firebase from "firebase";

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name:"",
      last_name:"",
      email: "",
      password: "",
      confirmPassword: "",
      fontsLoaded: false
    };
  }

  registerUser = (email, password,confirmPassword,first_name,last_name) => {
  if(password==confirmPassword){
    
    firebase
      .auth()
      
      .createUserWithEmailAndPassword(email, password)
      
      .then((userCredential) => {
        alert("User registered!!");
        console.log(userCredential.user.uid)
        this.props.navigation.replace("Login");
        firebase.database().ref("/users/" + userCredential.user.uid)
                .set({
                  email: userCredential.user.email,
                  first_name: first_name,
                  last_name: last_name,
                })
      })
      
      
      .catch(error => {
        alert(error.message);
      });
    console.log("4")
    }else{
      alert("Passwords don't match!");
    }
  };
  
  render() {
    const { email, password, confirmPassword, first_name, last_name } = this.state;

    return (
      <View>

        <View>
          <Image source={require('../assets/download.png')}>
          </Image>
        </View>

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
        <TouchableOpacity
          
          onPress={() =>
            this.registerUser(
              email, password, confirmPassword, first_name, last_name 
            )
          }>
          <Text >Register</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => this.props.navigation.replace('Login')}>
          <Text >Login ?</Text>
        </TouchableOpacity>

      </View>
    );
  }
}
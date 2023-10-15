import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import firebase from '../config';

export default class Logout extends Component {
  componentDidMount() {
    firebase.auth().signOut();
    this.props.navigation.replace('Login');
  }
  render() {
    return;
  }
}

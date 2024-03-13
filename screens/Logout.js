import { Component } from 'react';
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

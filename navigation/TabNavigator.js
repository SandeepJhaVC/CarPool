import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { RFValue } from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firebase from 'firebase';
import Car from '../screens/Car';

const Tab = createMaterialBottomTabNavigator();

export default class BottomTabNavigator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEnabled: false,
      light_theme: true,
    };
  }

  componentDidMount() {
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

  render() {
    return (
      <Tab.Navigator
        backBehavior="history"
        shifting={true}
        tabBarHideOnKeyboard={true}
        activeColor={this.state.light_theme ? '#4169e1' : '#b0c4de'}
        inactiveColor={this.state.light_theme ? '#4682b4' : '#e0ffff'}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Pool') {
              iconName = focused ? 'man' : 'man-outline';
            } else if (route.name === 'Pooler') {
              iconName = focused ? 'car' : 'car-outline';
            }
            return (
              <Ionicons name={iconName} size={RFValue(25)} color={color} style={{padong:20}} />
            );
          },
        })}
        barStyle={this.state.light_theme ? styles.tabBarLight : styles.tabBar}>
        <Tab.Screen name="Pool" component={Rider} />
        <Tab.Screen name="Pooler" component={Car} />
      </Tab.Navigator>
    );
  }
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#708090',
    padding:RFValue(10)
  },
  tabBarLight: {
    backgroundColor: '#afeeee',
    padding:RFValue(10)
  },
});

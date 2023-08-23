import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { RFValue } from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firebase from 'firebase';
import Rider from '../screens/Rider';
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
    this.fetchUser();
  }

  async fetchUser() {
    let theme;
    await firebase
      .database()
      .ref('/users/' + firebase.auth().currentUser.uid)
      .on('value', function (snapshot) {
        theme = snapshot.val().current_theme;
      });
    this.setState({
      light_theme: theme === 'light' ? true : false,
      isEnabled: theme === 'light' ? false : true,
    });
  }

  render() {
    return (
      <Tab.Navigator
        labeled={false}
        tabBarHideOnKeyboard={true}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Rider') {
              iconName = focused ? 'man' : 'man-outline';
            } else if (route.name === 'car') {
              iconName = focused ? 'car' : 'car-outline';
            }
            return (
              <Ionicons name={iconName} size={RFValue(25)} color={color} />
            );
          },
        })}
        tabBarOptions={{
          activeTintColor: '#FFFFFF',
          inactiveTintColor: 'green',
          style: {
            height: 130,
            borderTopWidth: 0,
            backgroundColor: this.state.light_theme ? 'black' : 'black',
          },
          labelStyle: {
            fontSize: 20,
            fontFamily: 'Rajdhani_600SemiBold',
          },
          labelPosition: 'beside-icon',
          tabStyle: {
            marginTop: 25,
            marginLeft: 10,
            marginRight: 10,
            borderRadius: 30,
            borderWidth: 2,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#5653d4',
          },
        }}>
        <Tab.Screen name="Rider" component={Rider} />
        <Tab.Screen name="car" component={Car} />
        
      </Tab.Navigator>
    );
  }
}

const styles = StyleSheet.create({});

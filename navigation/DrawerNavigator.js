import React, {Component} from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import StackNavigator from "./StackNavigator";
import Profile from "../screens/Profile";
import Logout from "../screens/Logout";
import firebase from "../config";

const Drawer = createDrawerNavigator();

class DrawerNavigator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      light_theme: true,
      isEnabled: false
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
    //this.dataRef.off('value', this.handleDataChange);
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
      <Drawer.Navigator
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: this.state.light_theme?'#afeeee':'#708090',
          },
          headerTintColor: this.state.light_theme?'#008b8b':'#a9a9a9',
        }}
      >
        <Drawer.Screen name="Dashboard" component={StackNavigator} />
        <Drawer.Screen name="Profile" component={Profile} />
        <Drawer.Screen name="Logout" component={Logout} />
      </Drawer.Navigator>
    );
  }
}

export default DrawerNavigator;

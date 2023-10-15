import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  Switch,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

import firebase from '../config';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEnabled: false,
      light_theme: true,
      name: '',
    };
  }

  toggleSwitch() {
    const previous_state = this.state.isEnabled;
    const theme = !this.state.isEnabled ? 'dark' : 'light';
    var updates = {};
    updates['/users/' + firebase.auth().currentUser.uid + '/current_theme'] =
      theme;
    firebase.database().ref().update(updates);
    this.setState({ isEnabled: !previous_state, light_theme: previous_state });
  }

  componentDidMount() {
    this.fetchUser();
  }

  async fetchUser() {
    let theme, name;
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

  render() {
    return (
      <View
        style={
          this.state.light_theme ? styles.containerLight : styles.container
        }>
        <SafeAreaView style={styles.droidSafeArea} />

        <View style={styles.titleContainer}>
          <Text
            style={
              this.state.light_theme
                ? styles.appTitleTextLight
                : styles.appTitleText
            }>
            Car-Pool
          </Text>
        </View>

        <View style={styles.appIcon}>
          <Image
            source={require('../assets/download.png')}
            style={styles.iconImage}></Image>
        </View>

        <View style={styles.screenContainer}>
          <Text
            style={
              this.state.light_theme ? styles.nameTextLight : styles.nameText
            }>
            {this.state.name}
          </Text>

          <View style={styles.themeContainer}>
            <Text
              style={
                this.state.light_theme
                  ? styles.themeTextLight
                  : styles.themeText
              }>
              Dark Theme
            </Text>

            <Switch
              style={{ transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] }}
              trackColor={{
                false: '#767577',
                true: this.state.light_theme ? '#eee' : 'white',
              }}
              thumbColor={this.state.isEnabled ? '#ee8249' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => this.toggleSwitch()}
              value={this.state.isEnabled}
            />
          </View>

          <View style={{ flex: 0.3 }} />
        </View>

        <View style={{ flex: 0.08 }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2f4f4f',
  },
  containerLight: {
    flex: 1,
    backgroundColor: '#87cefa',
  },

  droidSafeArea: {
    marginTop:
      Platform.OS === 'android' ? StatusBar.currentHeight : RFValue(35),
  },

  appIcon: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  iconImage: {
    padding: 10,
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },

  titleContainer: {
    flex: 0.1,
    justifyContent: 'center',
    allignitems: 'center',
  },

  appTitleText: {
    margin: 100,
    padding: 10,
    color: 'white',
    fontSize: RFValue(28),
  },
  appTitleTextLight: {
    margin: 100,
    padding: 10,
    color: 'black',
    fontSize: RFValue(28),
  },

  screenContainer: {
    flex: 0.85,
    padding: 50,
    margin: 5,
  },

  nameText: {
    color: 'white',
    fontSize: RFValue(40),
    marginTop: RFValue(10),
  },
  nameTextLight: {
    color: 'black',
    fontSize: RFValue(40),
    marginTop: RFValue(10),
  },

  themeContainer: {
    flex: 0.2,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: RFValue(20),
  },
  themeText: {
    color: 'white',
    fontSize: RFValue(20),
    marginRight: RFValue(15),
  },
  themeTextLight: {
    color: 'black',
    fontSize: RFValue(20),
    marginRight: RFValue(15),
  },
});

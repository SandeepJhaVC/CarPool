import React, { Component} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Button,
  TouchableOpacity,
  Text
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { ListItem, Icon } from 'react-native-elements';
import { RFValue } from 'react-native-responsive-fontsize';
import firebase from '../config';

export default class Car extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: '',
      destination: '',
      to:'',
      from:'',
      no_plate: '',
      car: '',
      isEnabled: false,
      light_theme: true,
      name: '',
      contact: '',
    };
  }

  
  componentDidMount() {
    
    this.fetchUser();
    this.fetchUserDetail();

    // Set up a real-time listener
    this.dataRef = firebase
      .database()
      .ref('/users/' + firebase.auth().currentUser.uid);
    this.dataRef.on('value', this.handleDataChange);
    this.dataRef.on('value', this.handleThemeChange);

    this.dataRef = firebase.database().ref('/details/');
    this.dataRef.on('value', this.handleDataChange);
    this.dataRef.on('value', this.handleThemeChange);
  }

  componentWillUnmount() {
    // Remove the listener when the component is unmounted
    this.dataRef.off('value', this.handleDataChange);
    this.dataRef.off('value', this.handleThemeChange);
  }

  handleThemeChange = (snapshot) => {
    const data = snapshot.val().current_theme;
    if (data) {
      this.setState({
        light_theme: data == 'light' ? true : false,
        isEnabled: data == 'light' ? false : true,
      });
    }
  };

  handleDataChange = (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const main = Object.values(data);
      this.setState({
        detail: main,
        isDataFetched: true,
      });
    }
  };

  async fetchUser() {
    let name;
    await firebase
      .database()
      .ref('/users/' + firebase.auth().currentUser.uid)
      .on('value', function (snapshot) {
        name = `${snapshot.val().first_name} ${snapshot.val().last_name}`;
      });
    this.setState({
      name: name,
    });
  }

  async fetchUserDetail() {
    try {
      const snapshot = await firebase.database().ref('/details/').once('value');
      const data = snapshot.val();
      let main;

      if (data) {
        main = Object.values(data); // Extract values from data object
      }

      this.setState({
        isDataFetched: true, // Update the flag
        detail: main,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  

  async addDetails() {
    if (this.state.to && this.state.from) {
      var date = new Date();
      let details = {
        to_where:this.state.to,
        from_where:this.state.from,
        time: this.state.time,
        no_plate: this.state.no_plate,
        car: this.state.car,
        date: date.toString(),
        user_id: firebase.auth().currentUser.uid,
        name: this.state.name,
        contact: this.state.contact,
        detail_id: Math.random().toString(36).slice(2)
      };
      await firebase
        .database()
        .ref('/details/' + details.detail_id)
        .set(details);
      alert('Submitted');
    } else {
      alert(
        'Error',
        'All fields are required!',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false }
      );
    }
  }

  async deleteDetail(detailKey) {
    try {
      await firebase.database().ref('/details/' + detailKey).remove();
      console.log(detailKey)
      alert('Detail deleted successfully');
    } catch (error) {
      console.error('Error deleting detail:', error);
      alert('Error deleting detail');
    }
  }

  renderItem = ({ item }) => {
    if (item.user_id === firebase.auth().currentUser.uid) {
      return (
        <TouchableOpacity>
          <View style={{ backgroundColor: this.state.light_theme ? '#48d1cc' : '#696969', margin: 1, padding:1 }}>
            <ListItem
              key={item}
              bottomDivider
              containerStyle={this.state.light_theme ? styles.listLight : styles.list}>
              
              <TouchableOpacity onPress={() => this.deleteDetail(item.detail_id)}>
                <Icon
                  type={'ionicon'}
                  name={'close'}
                  size={RFValue(30)}
                  color={this.state.light_theme ? 'black' : 'white'}
                />
              </TouchableOpacity>
              <ListItem.Content>
                <ListItem.Title
                  style={{
                    padding: 5,
                    margin: 5,
                    color: this.state.light_theme ? '#00008b' : '#e6e6fa',
                    fontSize: RFValue(20),
                  }}
                >
                  <Text>
                    From: <Text style={{ color: this.state.light_theme ? '#000000' : '#e0ffff' }}> {`${item.from_where}`} </Text>
                  </Text>
                </ListItem.Title>
  
                <ListItem.Subtitle
                  style={{
                    padding: 5,
                    margin: 5,
                    color: this.state.light_theme ? '#483d8b' : '#fff0f5',
                    fontSize: RFValue(20),
                  }}
                >
                  <Text>
                    To: <Text style={{ color: this.state.light_theme ? '#000000' : '#e0ffff' }}>
                      {`${item.to_where}`}
                    </Text>
                  </Text>
                </ListItem.Subtitle>
  
                <View>
                  <Text
                    style={{
                      padding: 5,
                      margin: 5,
                      color: this.state.light_theme ? '#a9a9a9' : '#fffacd',
                      fontSize: RFValue(15),
                    }}
                  >
                    Time: <Text style={{ color: this.state.light_theme ? '#000000' : '#e0ffff' }}> {item.time} </Text>
                  </Text>
                </View>
              </ListItem.Content>
            </ListItem>
          </View>
        </TouchableOpacity>
      );
    } else {
      return null; // Don't render details that don't belong to the current user
    }
  };
  

  render() {
    const { time, destination, no_plate, car, isDataFetched } = this.state;
    return (
      <View
        style={
          this.state.light_theme
            ? styles.appContainerLight
            : styles.appContainer
        }>
        <View
          style={
            this.state.light_theme ? styles.containerLight : styles.container
          }>
          <View
            style={
              this.state.light_theme
                ? styles.textContainerLight
                : styles.textContainer
            }>
            <TextInput
              style={[
                {
                  borderWidth: 1,
                  padding: 5,
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                },
                {
                  backgroundColor: this.state.light_theme
                    ? '#b0e0e6'
                    : '#2f4f4f',
                },
              ]}
              placeholderTextColor={'#778899'}
              placeholder={'to'}
              onChangeText={(text) => this.setState({ to: text })}
            />

            <TextInput
              style={[
                {
                  borderWidth: 1,
                  padding: 5,
                  marginTop: 5,
                },
                {
                  backgroundColor: this.state.light_theme
                    ? '#b0e0e6'
                    : '#2f4f4f',
                },
              ]}
              placeholderTextColor={'#778899'}
              placeholder={'from'}
              onChangeText={(text) => this.setState({ from: text })}
            />
            <TextInput
              style={[
                {
                  borderWidth: 1,
                  padding: 5,
                  marginTop: 5,
                },
                {
                  backgroundColor: this.state.light_theme
                    ? '#b0e0e6'
                    : '#2f4f4f',
                },
              ]}
              placeholderTextColor={'#778899'}
              placeholder={'Time'}
              onChangeText={(text) => this.setState({ time: text })}
            />

            <TextInput
              style={[
                {
                  borderWidth: 1,
                  padding: 5,
                  marginTop: 5,
                },
                {
                  backgroundColor: this.state.light_theme
                    ? '#b0e0e6'
                    : '#2f4f4f',
                },
              ]}
              placeholderTextColor={'#778899'}
              placeholder={'car model and color'}
              onChangeText={(text) => this.setState({ car: text })}
            />

            <TextInput
              style={[
                {
                  borderWidth: 1,
                  padding: 5,
                  marginTop: 5,
                },
                {
                  backgroundColor: this.state.light_theme
                    ? '#b0e0e6'
                    : '#2f4f4f',
                },
              ]}
              placeholderTextColor={'#778899'}
              placeholder={'no plate'}
              onChangeText={(text) => this.setState({ no_plate: text })}
            />

            <TextInput
              style={[
                {
                  borderWidth: 1,
                  padding: 5,
                  marginTop: 5,
                  borderBottomLeftRadius: 5,
                  borderBottomRightRadius: 5,
                },
                {
                  backgroundColor: this.state.light_theme
                    ? '#b0e0e6'
                    : '#2f4f4f',
                },
              ]}
              placeholderTextColor={'#778899'}
              placeholder={'Contact'}
              onChangeText={(text) => this.setState({ contact: text })}
            />
          </View>

          <View style={[styles.buttonContainer,{backgroundColor:this.state.light_theme ? '#b0e0e6' : '#2f4f4f'}]}>
            <Button
              color='#778899'
              onPress={() => this.addDetails()}
              title="Submit"
            />
          </View>

          {this.isEnabled}
        </View>
        
        <View style={{flex:0.5}}>
          <View>
            <FlatList
              data={this.state.detail}
              renderItem={this.renderItem}
            />
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
  appContainerLight: {
    flex: 2,
    backgroundColor: '#87cefa',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#2f4f4f',
    padding: 5,
    margin: 5,
  },
  containerLight: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#87cefa',
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
  textContainerLight: {
    flex: 0.5,
    backgroundColor: '#87cefa',
    justifyContent: 'space-between',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    padding: 0,
    marginBottom: 100,
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
  },
  list:{
    backgroundColor:"#696969",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    margin:5
  },
  listLight:{
    backgroundColor:"#48d1cc",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    margin:5
  }
});

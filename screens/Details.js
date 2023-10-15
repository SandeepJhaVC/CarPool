import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import firebase from '../config';


import {Icon} from 'react-native-elements'


export default class Details extends Component {
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
      if (!this.props.route.params || !this.props.route.params.details) {
        // Render some placeholder or loading content
        return (
          <View style={styles.appContainer}>
            <Text>Loading...</Text>
          </View>
        );
      } else {
            return (
                <View style={
                    this.state.light_theme?styles.appContainerLight:styles.appContainer
                }>

                    <View style={
                        this.state.light_theme?styles.containerLight:styles.container
                    }>

                        <Icon type={'ionicon'}
                            name={'car'}
                            color={this.state.light_theme?'white':'black'}
                            size={
                                RFValue(80)
                            }
                            style={
                                {
                                    marginBottom: 20,
                                    padding: 10
                                }
                            }/>

                        <Text style={
                            {
                                fontSize: RFValue(30),
                                padding: 5,
                                margin: 5,
                                 
                                color:this.state.light_theme?'#e6e6fa':'#00008b'
                            }
                        }>

                            From: <Text 
                                    style={{color:this.state.light_theme? '#e0ffff':'#000000'}}
                                  >
                                
                                    {this.props.route.params.details.from_where}
                            
                                  </Text>

                        </Text>

                        <Text style={
                            {
                                fontSize: RFValue(30),
                                padding: 5,
                                margin: 5,
                                 
                                color:this.state.light_theme?'#fff0f5':'#483d8b'
                            }
                        }>
                            To: <Text 
                                    style={{color:this.state.light_theme? '#e0ffff':'#000000'}}
                                  >
                                
                                    {this.props.route.params.details.to_where}
                            
                                  </Text>
                        </Text>

                        <Text style={
                            {
                                fontSize: RFValue(20),
                                padding: 5,
                                marginLeft: 5,
                                color:this.state.light_theme?'#fffacd':'#a9a9a9'
                            }
                        }>
                            Time: <Text style={{color:this.state.light_theme? '#e0ffff':'#000000'}}>
                                
                                    {this.props.route.params.details.time}
                            
                                  </Text>
                        </Text>

                        <Text style={
                            {
                              fontSize: RFValue(20),
                              padding: 5,
                              marginLeft: 5,
                              color:this.state.light_theme?'#fffacd':'#a9a9a9'
                            }
                        }>
                            Contact: <Text style={{color:this.state.light_theme? '#e0ffff':'#000000'}}
                                        >
                                
                                          {this.props.route.params.details.contact}
                            
                                        </Text>
                        </Text>

                        <Text style={
                            {
                              fontSize: RFValue(20),
                              padding: 5,
                              marginLeft: 5,
                              color:this.state.light_theme?'#fffacd':'#a9a9a9'
                            }
                        }>
                            No. Plate: <Text  style={{color:this.state.light_theme? '#e0ffff':'#000000'}}
                                        >
                                
                                          {this.props.route.params.details.no_plate}
                            
                                        </Text>
                        </Text>

                        <Text style={
                            {
                                fontSize: RFValue(10),
                                paddingTop: 50,
                                marginRight: 5,
                                fontStyle: 'italic',
                                 
                                color:this.state.light_theme?'white':'black'
                            }
                        }>
                            Updated on: <Text  style={{color:this.state.light_theme? 'white':'black',margin:RFValue(1)}}>
                                
                                {this.props.route.params.details.date}
                            
                            </Text>
                        </Text>
                    </View>

                </View>

            );

        }
    }
}

const styles = StyleSheet.create({
    appContainer: {
        flex: 1,
        backgroundColor: '#2f4f4f'
    },
    appContainerLight: {
      flex: 1,
      backgroundColor: '#87cefa'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#696969',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        padding: RFValue(10),
        margin: RFValue(10)
    },
    containerLight: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: '#48d1cc',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
      padding: RFValue(10),
      margin: RFValue(10)
  }
});

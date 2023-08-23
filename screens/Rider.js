import React, { Component, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import firebase from 'firebase';

import { FlatList } from 'react-native-gesture-handler';

import { Avatar, ListItem, Icon } from 'react-native-elements';

export default class Rider extends Component {
  constructor() {
    super();
    this.state = {
      detail: [],
    };
  }

  componentDidMount() {
    this.fetchUser();
  }

  async fetchUser() {
    var main = [];
    await firebase
      .database()
      .ref('/details/')
      .on('value', function (snapshot) {
        var data = snapshot.val();
        console.log(data);
        Object.keys(snapshot.val()).forEach(function (key) {
          main.push({
            key: key.val,
            value: snapshot.val,
          });
        });
        for (var item in data) {
          main.push(data[item]);
        }
      });
    this.setState({
      detail: main,
    });
    console.log(this.state.detail);
  }

  renderItem = ({ item }) => {
    return (
      <View>
        <ListItem key={item} bottomDivider>
          <Icon type={'ionicon'} name={'car'} size={40} />

          <ListItem.Content>
            <ListItem.Title style={styles.title}>
              {`${item.location}`}
            </ListItem.Title>

            <View style={styles.lowerLeftContaiiner}>
              <View style={styles.transactionContainer}>
                <Text style={{ color: '#0364F4' }}>{item.no_plate}</Text>
              </View>

              <Text style={styles.date}>{item.time}</Text>
            </View>
          </ListItem.Content>
        </ListItem>
      </View>
    );
  };

  render() {
    return (
      <View>
        <FlatList data={this.state.detail} renderItem={this.renderItem} />
      </View>
    );
  }
}

const styles = StyleSheet.create({});

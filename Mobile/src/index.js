import { StatusBar } from 'expo-status-bar';
import React, { useReducer, useState, Component } from 'react';
import { StyleSheet, Text, View, Button, Image, TextInput, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import api from './services/api'
import img_Logo from '../src/logo_case.png'

function clickou() {
  console.log("CLickou no botao")
}

const params ={
   "email": "renanguides@hotmail.com",
    "password": "123456"
}

var error = "";

export default class App extends Component {
  state = {
    error: '',
    //errorMessage: '',
  }

  
  
  signIn = async () => {

    try {
      const response = await api.post('/api/authenticate', 
      params);
      console.log("Clickou no botao");

      const { token, user } = response.data;
      
      

      await AsyncStorage.multiSet([
        ['@CodeApi:token', token],
        ['@CodeApi:token', JSON.stringify(user)]
      ]);
    } catch (response) {
      this.setState({ error:response.data});
      
      error = JSON.stringify(this.state.error);
    
      console.log(typeof( error));
    };


  };

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.logo}
          source={img_Logo}
        />
        <TextInput
          style={{ height: 40, width: 220, borderColor: 'white', borderWidth: 1, color: 'white' }}
          placeholder="                     Usuário"
          placeholderTextColor="#FFFFFF"

        />

        <TextInput
          style={{ height: 40, width: 220, borderColor: 'white', borderWidth: 1, color: 'white', margin: 25 }}
          placeholder="                       Senha"
          placeholderTextColor="#FFFFFF"
        />

        <Button onPress={this.signIn} title="Entrar"></Button>

        {!!this.state.error && <Text style={styles.White}>{ JSON.stringify(this.state.error)}</Text> }

        
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  White: {

    // Define your HEX color code here.
    color: '#FFFFFF',

  },
  logo: {
    alignItems: 'center',
    width: 300,
    height: 300,
  },
});




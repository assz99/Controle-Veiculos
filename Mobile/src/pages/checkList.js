import React, { useReducer, useState, Component } from 'react';
import { View, Button, Text,StyleSheet } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Checkbox } from 'react-native-paper';

export default class checklist extends Component {
state = {
        checked:false,
        
        }

render(){ 
return(
  <View style={styles.container}>
    <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike"/>
    <Button 
      title="Ir para Login"
      onPress={() => navigation.navigate('Login') }
    />
  </View>
);

}}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  White: {

    // Define your HEX color code here.
    color: '#FFFFFF',

  },
});
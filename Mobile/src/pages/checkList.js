import React, { useReducer, useState, Component } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { withNavigation } from 'react-navigation';
import CheckBox from 'react-native-check-box'
import { TextInput } from 'react-native-gesture-handler';
export default class checklist extends Component {
  state = {
    isChecked: false,
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{flex:1, flexDirection:'row',justifyContent:'center',height: 100,
          paddingTop: 00}}>
          <TextInput
            style={{ height: 40, width: 220, borderColor: 'white', borderWidth: 1, color: 'white', }}
            placeholder="                     KM Inicial"
            placeholderTextColor="#FFFFFF"
            
          />
          <Text style={styles.kmText}>KM</Text>
        </View>
        <View style={{flex:1, flexDirection:'row',justifyContent:'center',height: 10,
          padding: 20}}>
        <TextInput
          style={{ height: 40, width: 220, borderColor: 'white', borderWidth: 1, color: 'white' }}
          placeholder="                     KM Final"
          placeholderTextColor="#FFFFFF"
        />
        <Text style={styles.kmText}>KM</Text>
        </View>
        <CheckBox style={{ flex: 1, padding: 10 }} onClick={() => {
          this.setState({
            isChecked: !this.state.isChecked
          })
        }}
          checkBoxColor={'#FF0000'} isChecked={this.state.isChecked} leftText={"Teste"} />
          
        <Button
          title="Ir para Login"
          onPress={() => navigation.navigate('Login')}
        />
      </View>
    );

  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    //alignItems: 'center',
    //justifyContent: 'center',
  },
  White: {
    color: '#FFFFFF',

  },
  kmText:{
    paddingTop:10,
    paddingLeft:20,
    color: '#FFFFFF',
  }
});
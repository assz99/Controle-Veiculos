import React, { useReducer, useState, Component } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { withNavigation } from 'react-navigation';
import CheckBox from 'react-native-check-box'
import { TextInput } from 'react-native-gesture-handler';
import RNPickerSelect from 'react-native-picker-select';

const motos = [
  {
    label: 'moto1',
    value: 'moto1',
  },
  {
    label: 'moto2',
    value: 'moto2',
  },
  {
    label: 'moto3',
    value: 'moto3',
  },
];

export default class checklist extends Component {
  state = {
    isChecked: false,
    favSport0:'',
  }

  render() {
    const placeholder = {
      label: 'Selecione a moto',
      value: null,
      color: '#FFFFFF',
    };
    return (
      <View style={styles.container}>
        
        <RNPickerSelect
            placeholder={placeholder}
            items={motos}
            onValueChange={value => {
              this.setState({
                favSport0: value,
              });
            }}
            onUpArrow={() => {
              this.inputRefs.firstTextInput.focus();
            }}
            onDownArrow={() => {
              this.inputRefs.favSport1.togglePicker();
            }}
            style={pickerSelectStyles}
            value={this.state.favSport0}
            
          />
        
        
          <TextInput
            style={{ height: 40, width: 220, borderColor: 'white', borderWidth: 1, color: 'white', }}
            placeholder="                     KM Inicial"
            placeholderTextColor="#FFFFFF"

          />
          <Text style={styles.kmText}>KM</Text>
        
          <TextInput
            style={{ height: 40, width: 220, borderColor: 'white', borderWidth: 1, color: 'white' }}
            placeholder="                     KM Final"
            placeholderTextColor="#FFFFFF"
          />
          <Text style={styles.kmText}>KM</Text>
        
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  White: {
    color: '#FFFFFF',

  },
  kmText: {
    paddingTop: 10,
    paddingLeft: 20,
    color: '#FFFFFF',
  }
});

const pickerSelectStyles = StyleSheet.create({ 
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'white',
    textAlignVertical:'center',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
import React, { useReducer, useState, Component } from 'react';
import { View, Button, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';
import CheckBox from 'react-native-check-box'
import { TextInput } from 'react-native-gesture-handler';
import RNPickerSelect from 'react-native-picker-select';
import api from '../services/api'
import AsyncStorage from '@react-native-async-storage/async-storage';

var motos = [];

//const getMoto;


export default class checklist extends Component {
  state = {
    user: {},
    motos: [],
    motoSelected: "",
    kmInicial:0,
    kmFinal:0,
    isCheckedPiscaDiantero: false,
    isCheckedPiscaTraseiro: false,
    isCheckedFarol: false,
    isCheckedRetrovisor: false,
    isCheckedSusDianteira: false,
    isCheckedLuzFreio: false,
    isCheckedParalama: false,
    isCheckedTanqueCombustivel: false,
    isCheckedDiscoFreio: false,
    isCheckedPneuTraseiro: false,
    isCheckedAroTraseiro: false,
    isCheckedResOleoMotor: false,
    isCheckedPneuDianteiro: false,
    isCheckedAroDianteiro: false,
    isCheckedMotor: false,
    isCheckedCaixaPlastica: false,
    isCheckedEscapamento: false,
    isCheckedRelacao: false,
    isCheckedNapaBanco: false,
    annotation: "",
    
  }

  handleKmInicial = (kmInicial) => {
    kmInicial = kmInicial.toString();
    this.setState({ kmInicial: kmInicial })
  }

  handleKmFinal = (kmFinal) => {
    kmFinal = kmFinal.toString();
    this.setState({ kmFinal: kmFinal })
  }

   handleGravar = async () => {
     try{
      console.log("Gravando");
    const checklist = JSON.stringify(this.state);
    console.log(checklist);
    await AsyncStorage.setItem('@CodeApi:checkList', checklist);
    console.log("Gravado");
   
  }catch(e){
    console.log("error:"+ e);
  }
  }

  handleAnnotationChange = (annotation) => {
    annotation = annotation.toString();
    this.setState({ annotation: annotation })
 }

  async componentDidMount() {
    try {
      const test = await AsyncStorage.getItem('@CodeApi:checkList');
      if(test !== null){
        const newState = JSON.parse(test);
        console.log("TEM ALGO AKI"); 
        this.setState(newState);
        console.log(newState);
      }else{
      const user = this.props.navigation.getParam('user');
      const response = await api.get('api/motos');
      this.setState({ user: user });
      const rMoto = response.data.moto;
      this.setState({ motos: rMoto });}
    } catch (response) {
      console.log(response);
    }
  }

  render() {
    const placeholder = {
      label: 'Selecione a moto',
      value: null,
      color: '#FFFFFF',
    };
    return (
      <ScrollView style={styles.container}>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <RNPickerSelect
            placeholder={placeholder}
            items={this.state.motos}
            onValueChange={value => {
              this.setState({
                motoSelected: value,
              });
              //console.log("Moto selecionada: "+ value)
            }}
            value={this.state.motoSelected}
            style={pickerSelectStyles}
          />

          <View style={{ flex: 1, flexDirection: 'row', }}>
            <TextInput
              style={{ height: 40, width: 220, borderColor: 'white', borderWidth: 1, color: 'white', }}
              placeholder="                     KM Inicial"
              placeholderTextColor="#FFFFFF"
              keyboardType="number-pad"
              onChangeText={this.handleKmFinal}
              value = {this.state.kmInicial.toString()}
            />
            <Text style={styles.kmText}>KM</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <TextInput
              style={{ height: 40, width: 220, borderColor: 'white', borderWidth: 1, color: 'white' }}
              placeholder="                     KM Final"
              placeholderTextColor="#FFFFFF"
              keyboardType="number-pad"
              onChangeText={this.handleKmInicial}
              value = {this.state.kmFinal.toString()}
            />
            <Text style={styles.kmText}>KM</Text>
          </View>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <CheckBox style={{ flex: 1, padding: 10 }} onClick={() => {
            this.setState({
              isCheckedPiscaDiantero: !this.state.isCheckedPiscaDiantero
            })
          }}
            checkBoxColor={'#FF0000'} isChecked={this.state.isCheckedPiscaDiantero}
            rightText={'Pisca Dianteiro'} rightTextStyle={styles.whiteCheckbox}
          />
          <CheckBox style={{ flex: 1, padding: 10 }} onClick={() => {
            this.setState({
              isCheckedPiscaTraseiro: !this.state.isCheckedPiscaTraseiro
            })
          }}
            checkBoxColor={'#FF0000'} isChecked={this.state.isCheckedPiscaTraseiro}
            rightText={'Pisca Traseiro'} rightTextStyle={styles.White}
          />
          <CheckBox style={{ flex: 1, padding: 10 }} onClick={() => {
            this.setState({
              isCheckedFarol: !this.state.isCheckedFarol
            })
          }}
            checkBoxColor={'#FF0000'} isChecked={this.state.isCheckedFarol}
            rightText={'Farol'} rightTextStyle={styles.White}
          />
        </View>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <CheckBox style={{ flex: 1, padding: 10 }} onClick={() => {
            this.setState({
              isCheckedRetrovisor: !this.state.isCheckedRetrovisor
            })
          }}
            checkBoxColor={'#FF0000'} isChecked={this.state.isCheckedRetrovisor}
            rightText={'Retrovisor'} rightTextStyle={styles.White}
          />
          <CheckBox style={{ flex: 1, padding: 10 }} onClick={() => {
            this.setState({
              isCheckedSusDianteira: !this.state.isCheckedSusDianteira
            })
          }}
            checkBoxColor={'#FF0000'} isChecked={this.state.isCheckedSusDianteira}
            rightText={'Sus. Dianteira'} rightTextStyle={styles.White}
          />
          <CheckBox style={{ flex: 1, padding: 10 }} onClick={() => {
            this.setState({
              isCheckedLuzFreio: !this.state.isCheckedLuzFreio
            })
          }}
            checkBoxColor={'#FF0000'} isChecked={this.state.isCheckedLuzFreio}
            rightText={'Luz freio'} rightTextStyle={styles.White}
          />
        </View>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <CheckBox style={{ flex: 1, padding: 10 }} onClick={() => {
            this.setState({
              isCheckedParalama: !this.state.isCheckedParalama
            })
          }}
            checkBoxColor={'#FF0000'} isChecked={this.state.isCheckedParalama}
            rightText={'Paralama'} rightTextStyle={styles.White}
          />
          <CheckBox style={{ flex: 1, padding: 10 }} onClick={() => {
            this.setState({
              isCheckedTanqueCombustivel: !this.state.isCheckedTanqueCombustivel
            })
          }}
            checkBoxColor={'#FF0000'} isChecked={this.state.isCheckedTanqueCombustivel}
            rightText={'Tanque Combustivel'} rightTextStyle={styles.White}
          />
          <CheckBox style={{ flex: 1, padding: 10 }} onClick={() => {
            this.setState({
              isCheckedDiscoFreio: !this.state.isCheckedDiscoFreio
            })
          }}
            checkBoxColor={'#FF0000'} isChecked={this.state.isCheckedDiscoFreio}
            rightText={'Disco Freio'} rightTextStyle={styles.White}
          />
        </View>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <CheckBox style={{ flex: 1, padding: 10 }} onClick={() => {
            this.setState({
              isCheckedPneuTraseiro: !this.state.isCheckedPneuTraseiro
            })
          }}
            checkBoxColor={'#FF0000'} isChecked={this.state.isCheckedPneuTraseiro}
            rightText={'Pneu Traseiro'} rightTextStyle={styles.White}
          />
          <CheckBox style={{ flex: 1, padding: 10 }} onClick={() => {
            this.setState({
              isCheckedAroTraseiro: !this.state.isCheckedAroTraseiro
            })
          }}
            checkBoxColor={'#FF0000'} isChecked={this.state.isCheckedAroTraseiro}
            rightText={'Aro Traseiro'} rightTextStyle={styles.White}
          />
          <CheckBox style={{ flex: 1, padding: 10 }} onClick={() => {
            this.setState({
              isCheckedResOleoMotor: !this.state.isCheckedResOleoMotor
            })
          }}
            checkBoxColor={'#FF0000'} isChecked={this.state.isCheckedResOleoMotor}
            rightText={'Res. Oleo Motor'} rightTextStyle={styles.White}
          />
        </View>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <CheckBox style={{ flex: 1, padding: 10 }} onClick={() => {
            this.setState({
              isCheckedPneuDianteiro: !this.state.isCheckedPneuDianteiro
            })
          }}
            checkBoxColor={'#FF0000'} isChecked={this.state.isCheckedPneuDianteiro}
            rightText={'Pneu Dianteiro'} rightTextStyle={styles.White}
          />
          <CheckBox style={{ flex: 1, padding: 10 }} onClick={() => {
            this.setState({
              isCheckedAroDianteiro: !this.state.isCheckedAroDianteiro
            })
          }}
            checkBoxColor={'#FF0000'} isChecked={this.state.isCheckedAroDianteiro}
            rightText={'Aro Dianteiro'} rightTextStyle={styles.White}
          />
          <CheckBox style={{ flex: 1, padding: 10 }} onClick={() => {
            this.setState({
              isCheckedMotor: !this.state.isCheckedMotor
            })
          }}
            checkBoxColor={'#FF0000'} isChecked={this.state.isCheckedMotor}
            rightText={'Motor'} rightTextStyle={styles.White}
          />
        </View>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <CheckBox style={{ flex: 1, padding: 10 }} onClick={() => {
            this.setState({
              isCheckedCaixaPlastica: !this.state.isCheckedCaixaPlastica
            })
          }}
            checkBoxColor={'#FF0000'} isChecked={this.state.isCheckedCaixaPlastica}
            rightText={'Caixa Plastica'} rightTextStyle={styles.White}
          />
          <CheckBox style={{ flex: 1, padding: 10 }} onClick={() => {
            this.setState({
              isCheckedEscapamento: !this.state.isCheckedEscapamento
            })
          }}
            checkBoxColor={'#FF0000'} isChecked={this.state.isCheckedEscapamento}
            rightText={'Escapamento'} rightTextStyle={styles.White}
          />
          <CheckBox style={{ flex: 1, padding: 10 }} onClick={() => {
            this.setState({
              isCheckedRelacao: !this.state.isCheckedRelacao
            })
          }}
            checkBoxColor={'#FF0000'} isChecked={this.state.isCheckedRelacao}
            rightText={'Relação'} rightTextStyle={styles.White}
          />
        </View>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <CheckBox style={{ flex: 1, padding: 10 }} onClick={() => {
            this.setState({
              isCheckedNapaBanco: !this.state.isCheckedNapaBanco
            })
          }}
            checkBoxColor={'#FF0000'} isChecked={this.state.isCheckedNapaBanco}
            rightText={'Napa Banco'} rightTextStyle={styles.White}
          />
        </View>
        <TextInput placeholder="Anotações" placeholderTextColor='#FFFFFF' value={this.state.annotation} onChangeText={this.handleAnnotationChange} style={{ height: 100, width: "100%", borderColor: 'white', borderWidth: 1, color: 'white' }} >
        </TextInput>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
          <TouchableOpacity style={{ height: 40, width: '50%', backgroundColor: 'blue', alignItems: 'center', borderColor: 'black', borderWidth: 1, }} onPress={this.handleGravar}>
            <Text style={styles.White}>Salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ height: 40, width: '50%', backgroundColor: 'blue', alignItems: 'center', borderColor: 'black', borderWidth: 1, }}>
            <Text style={styles.White}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  kmText: {
    paddingTop: 10,
    paddingLeft: 20,
    color: '#FFFFFF',
  },
  whiteCheckbox: {
    flex: 1,
    flexShrink: 1,
    color: '#FFFFFF',
  },
  botao: {
    width: '80%'
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
    justifyContent:'center',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
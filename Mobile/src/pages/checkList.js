import React, { useReducer, useState, Component } from 'react';
import { View, Button, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Modal, Image, ImageBackground } from 'react-native';
import { withNavigation } from 'react-navigation';
import CheckBox from 'react-native-check-box'
import { TextInput } from 'react-native-gesture-handler';
import RNPickerSelect from 'react-native-picker-select';
import api from '../services/api'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import axios from 'axios'


import { Camera } from 'expo-camera'
import img_Camera from '../img_Camera.png';
let camera = Camera;

export default class checklist extends Component {
  state = {
    horarioInicial: "",
    user: {},
    motos: [],
    motoSelected: "",
    kmInicial: '',
    kmFinal: '',
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
    modalVisible: false,
    previewVisible: false,
    capturedImage: null,
    problems: "",
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
    try {
      let d = new Date();
      const data = d.toISOString();
      console.log(data);
      this.state.horarioInicial = data;
      const checklist = JSON.stringify(this.state);
      console.log(checklist);
      await AsyncStorage.setItem('@CodeApi:checkList', checklist);
      console.log("Gravado");
      Alert.alert('Gravado com Sucesso!');
    } catch (e) {
      console.log("error:" + e);
    }
  }

  clean(obj) {
    for (var propName in obj) {
      if (obj[propName] === null || obj[propName] === false) {
        delete obj[propName];
      }
    }
    return obj
  }

  isTrue(obj) {
    var keys = Object.keys(obj);
    var filtered = keys.filter(function (key) { 
      return obj[key] == true;
    });
    //console.log(filtered);
    const x = filtered.toString();
    return x;
  }

  handleEnviar = async () => {
    try {
      if (this.state.capturedImage !== null) {
        console.log("Entrou");
        const img64 = this.state.capturedImage;
        const imagesData = new FormData();
        const imageName = `${this.state.user.name}_${this.state.motoSelected}_${Date.now()}.jpg`;
        imagesData.append('image', {
          name: imageName,
          uri: img64.uri,
          type: 'image/jpg',

        })
        const headers = {
          'Content-Type': 'multipart/form-data'
        }
        this.setState({imageName:imageName})
        const erro = await api.post('/upload', imagesData, { headers });
      }
      var cleanState = this.state;

      this.clean(cleanState);
      var problems = this.isTrue(cleanState);
      cleanState.problems = problems;
      delete cleanState.motos;
      delete cleanState.previewVisible;
      delete cleanState.password;
      console.log(cleanState)
      const response = await api.post('/api/checklist', cleanState);



      this.setState({
        horarioInicial: "",
        user: {},
        motos: {},
        motoSelected: "",
        kmInicial: 0,
        kmFinal: 0,
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
        modalVisible: false,
        previewVisible: false,
        capturedImage: null,
        imageName:"",
      })
      Alert.alert('CheckList Enviado');
      await AsyncStorage.removeItem('@CodeApi:checkList')
      this.props.navigation.navigate('login');
    } catch (response) {
      console.log("error: ");
      console.log(response);
    }
  }

  handleAnnotationChange = (annotation) => {
    annotation = annotation.toString();
    this.setState({ annotation: annotation })
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }



  takePicture = async () => {
    const options = { quality: 0.5, base64: true };
    const data = await camera.takePictureAsync();
    console.log("Foto: ");
    console.log(data);
    this.setState({
      capturedImage: data,
      previewVisible: true
    })
  };

  __startCamera = async () => {
    const { status } = await Camera.requestPermissionsAsync()
    console.log(status)
    if (status === 'granted') {
      Alert.alert('Access granted')
      this.setState({ modalVisible: true });
    } else {
      Alert.alert('Access denied')
    }
  }

  __retakePicture = () => {
    //console.log("Teste");
    this.setState({
      previewVisible: false,
      capturedImage: null
    });
    console.log("Teste");
    this.__startCamera();
  }

  __savePhoto = () => {
    this.setState({ modalVisible: false });
    Alert.alert("Imagem Salva");
  }

  async componentDidMount() {
    try {
      const test = await AsyncStorage.getItem('@CodeApi:checkList');
      if (test !== null) {
        const newState = JSON.parse(test);
        console.log("TEM ALGO AKI");
        this.setState(newState);

      } else {
        const user = this.props.navigation.getParam('user');
        const response = await api.get('api/motos');
        this.setState({ user: user });
        const rMoto = response.data.moto;
        this.setState({ motos: rMoto });
      }
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
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
          >
            {this.state.previewVisible && this.state.capturedImage ? (
              <View
                style={{
                  backgroundColor: 'transparent',
                  flex: 1,
                  width: '100%',
                  height: '100%'
                }}
              >
                <ImageBackground
                  source={{ uri: this.state.capturedImage && this.state.capturedImage.uri }}
                  style={{
                    flex: 1
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'column',
                      padding: 15,
                      justifyContent: 'flex-end'
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                      }}
                    >
                      <TouchableOpacity
                        onPress={this.__retakePicture}
                        style={{
                          width: 130,
                          height: 40,

                          alignItems: 'center',
                          borderRadius: 4
                        }}
                      >
                        <Text
                          style={{
                            color: '#fff',
                            fontSize: 20
                          }}
                        >
                          Re-take
                      </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={this.__savePhoto}
                        style={{
                          width: 130,
                          height: 40,

                          alignItems: 'center',
                          borderRadius: 4
                        }}
                      >
                        <Text
                          style={{
                            color: '#fff',
                            fontSize: 20
                          }}
                        >
                          save photo
                      </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ImageBackground>
              </View>
            ) : (
                <Camera
                  type={Camera.Constants.Type.back}
                  flashMode={'off'}
                  style={{ flex: 1 }}
                  ref={(r) => {
                    camera = r
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      width: '100%',
                      backgroundColor: 'transparent',
                      flexDirection: 'row'
                    }}
                  >
                    <View
                      style={{
                        position: 'absolute',
                        left: '5%',
                        top: '10%',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                    </View>
                    <View
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        flexDirection: 'row',
                        flex: 1,
                        width: '100%',
                        padding: 20,
                        justifyContent: 'space-between'
                      }}
                    >
                      <View
                        style={{
                          alignSelf: 'center',
                          flex: 1,
                          alignItems: 'center'
                        }}
                      >
                        <TouchableOpacity
                          onPress={this.takePicture}
                          style={{
                            width: 70,
                            height: 70,
                            bottom: 0,
                            borderRadius: 50,
                            backgroundColor: '#fff'
                          }}
                        />
                      </View>
                    </View>
                  </View>
                </Camera>
              )}
          </Modal>
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
              onChangeText={this.handleKmInicial}
              value={this.state.kmInicial.toString()}
            />
            <Text style={styles.kmText}>KM</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <TextInput
              style={{ height: 40, width: 220, borderColor: 'white', borderWidth: 1, color: 'white' }}
              placeholder="                     KM Final"
              placeholderTextColor="#FFFFFF"
              keyboardType="number-pad"
              onChangeText={this.handleKmFinal}
              value={this.state.kmFinal.toString()}
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
          <TouchableOpacity onPress={() => {
            this.__startCamera();
          }}>
            <Image style={styles.logo}
              source={img_Camera}
            />
          </TouchableOpacity>
        </View>
        <TextInput placeholder="Anotações" placeholderTextColor='#FFFFFF' value={this.state.annotation} onChangeText={this.handleAnnotationChange} style={{ height: 100, width: "100%", borderColor: 'white', borderWidth: 1, color: 'white' }} >
        </TextInput>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
          <TouchableOpacity style={{ height: 40, width: '50%', backgroundColor: 'blue', alignItems: 'center', borderColor: 'black', borderWidth: 1, }} onPress={this.handleGravar}>
            <Text style={styles.White}>Salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ height: 40, width: '50%', backgroundColor: 'blue', alignItems: 'center', borderColor: 'black', borderWidth: 1, }} onPress={this.handleEnviar}>
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
  },
  buttonText: {
    fontSize: 14
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
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});


import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Modal, Image, ImageBackground, Pressable } from 'react-native';
import { withNavigation } from 'react-navigation';
import CheckBox from 'react-native-check-box'
import { TextInput } from 'react-native-gesture-handler';
import RNPickerSelect from 'react-native-picker-select';
import api from '../services/api'
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Camera } from 'expo-camera'
import img_Camera from '../img_Camera.png';
let camera = Camera;

export default class checklist extends Component {
  //Variavel de estado para controle da pagina
  state = {
    horarioInicial: '',
    user: {},
    motos: [],
    motoSelected: '',
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
    isCheckedOleo: false,
    annotation: "",
    modalVisible: false,
    previewVisible: false,
    capturedImage: null,
    problems: "",
    modalAlert:false,
  }
  //Função para setar o estado quando o input kmInicial for alterado
  handleKmInicial = (kmInicial) => {
    kmInicial = kmInicial.toString();
    this.setState({ kmInicial: kmInicial })
  }
  //Função para setar o estado quando o input kmFinal for alterado
  handleKmFinal = (kmFinal) => {
    kmFinal = kmFinal.toString();
    this.setState({ kmFinal: kmFinal })
  }
  //Função para o botão de gravar
  handleGravar = async () => {
    try {
      //Primeiro alerta o usuario caso ele não tenha selecionado a moto ou não tenha colocado o kmInicial
      if (this.state.motoSelected == null) {
        Alert.alert("Selecione um Moto");
        return;
      }
      if (this.state.kmInicial == null) {
        Alert.alert("Preencha o KmInicial");
        return;
      }
      var msgGravar = "Gravado com Sucesso!"
      const response = await api.post('/api/oil', { motoSelected: this.state.motoSelected, kmInicial: this.state.kmInicial });
      console.log(response.data.message);
      
      //Pegar a data do dispositivo
      let d = new Date();
      const data = d.toString();
      //console.log(data);
      await this.setState({ horarioInicial: data });
      const checklist = JSON.stringify(this.state);
      //console.log(checklist);
      //Salvar o estado atual no armazenamento do dispositivo para quando voltar o app vai estar igual
      await AsyncStorage.setItem('@CodeApi:checkList', checklist);
      console.log("Gravado");
      if (response.data.message == "oil") {
        console.log("Entrou");
        //msgGravar = msgGravar + "TROCAR O OLEO DA MOTO!!";
        this.handleAlertModal();
      }
      Alert.alert(msgGravar);
    } catch (e) {
      console.log("error:" + e);
    }
  }
  //Função para limpar todo atributo  que é falso ou nulo no objeto
  clean(obj) {
    for (var propName in obj) {
      if (obj[propName] === null || obj[propName] === false) {
        delete obj[propName];
      }
    }
    return obj
  }
  //Função para filtar apenas quais atributos estão true
  isTrue(obj) {
    var keys = Object.keys(obj);
    var filtered = keys.filter(function (key) {
      return obj[key] == true;
    });
    const x = filtered.toString();
    return x;
  }
  //Função para o botão enviar
  handleEnviar = async () => {
    try {
      //Alertar o usuario
      if (this.state.kmInicial > this.state.kmFinal) {
        Alert.alert('KM inicial esta maior que a Final');
        return;
      }
      if (this.state.motoSelected == null) {
        Alert.alert("Selecione um Moto");
        return;
      }
      if (this.state.horarioInicial == null) {
        Alert.alert("Voce não salvou");
        return;
      }
      //Checar se existe imagem caso tenha faz o "post" da imagem 
      if (this.state.capturedImage != null) {
        console.log("enviando imagem");
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
        this.setState({ imageName: imageName })
        const erro = await api.post('/upload', imagesData, { headers });
      }
      //Aki se limpa o estado para envialo tirando tudo oque e falso e nulo
      var cleanState = this.state;
      this.clean(cleanState);
      delete cleanState.motos;
      delete cleanState.previewVisible;
      delete cleanState.password;
      //Aki se filtra apenas os estados dos checkbox e pega apenas oque estão "true"
      var problems = this.isTrue(cleanState);
      cleanState.problems = problems;
      console.log(cleanState)
      const response = await api.post('/api/checklist', cleanState);
      //Apos enviado checklist se apaga todos os dados do armazenamento do dispositivo e retorna para a tela de login
      await AsyncStorage.removeItem('@CodeApi:checkList')
      Alert.alert('CheckList Enviado');

      this.props.navigation.navigate('Login');
    } catch (response) {
      console.log("error: ");
      console.log(response);
    }
  }
  //Função para setar o estado quando o input anotação for alterado
  handleAnnotationChange = (annotation) => {
    annotation = annotation.toString();
    this.setState({ annotation: annotation })
  }
  handleAlertModal = () => {
    this.setState({ modalAlert: !this.state.modalAlert })
  }
  // Abrir o modal para a camera que abre a tela da camera no dispositivo
  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }
  // Função para tirar a foto
  takePicture = async () => {
    const data = await camera.takePictureAsync();
    //Aki se salva a imagem.
    this.setState({
      capturedImage: data,
      previewVisible: true
    })
  };
  //Função para ligar a camera
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
  // Função para re-tirar a foto, apagando a foto tirada
  __retakePicture = () => {
    this.setState({
      previewVisible: false,
      capturedImage: null
    });
    this.__startCamera();
  }
  // Função apenas para fechar a camera caso queria salvar a imagem
  __savePhoto = () => {
    this.setState({ modalVisible: false });
    Alert.alert("Imagem Salva");
  }
  //Esta função faz tudo o que estiver nela quando a tela for inicializada
  async componentDidMount() {
    try {
      //Primeiro lê o armazenamento do dispositivo para checar caso a algo para utilizar
      const test = await AsyncStorage.getItem('@CodeApi:checkList');
      if (test !== null) {
        //caso tenha ele pega tudo e passa para o estado
        const newState = JSON.parse(test);
        this.setState(newState);
        const response = await api.get('api/motos');
        const rMoto = response.data.moto;
        this.setState({ motos: rMoto });
      } else {
        //caso não tenha apenas pega o usuario que foi passado na tela de login e faz a requisição para saber as motos cadastradas
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
  // aki começa a montagem da tela
  render() {
    //Objeto para controle do listPicker das motos
    const placeholder = {
      label: 'Selecione a moto',
      value: null,
      color: '#FFFFFF',
    };
    return (
      //Primeiro se cria o scrollview que permite a movimentação da tela e depois a view da tela
      <ScrollView style={styles.container}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalAlert}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
              <Text style={styles.modalText}>Trocar o Oleo Da Moto!!!</Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={this.handleAlertModal}
              >
                <Text style={styles.textStyle}>Ok!!</Text>
              </Pressable>
              </View>
            </View>
          </Modal>
          {/* aki se monta o modal da camera que so surge quando solicitado e caso haja alguma imagem ele monta a imagem com as perguntas*/}
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
                          Tirar outra
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
                          Salvar foto
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
            }}
            value={this.state.motoSelected}
            style={pickerSelectStyles}
          >{/*Aki se monta a tela do checklist*/
            /*Aki se monta o listPicker das motos*/}
          </RNPickerSelect>

          <View style={{ flex: 1, flexDirection: 'row', }}>
            {/*Aki se monta os inputs do kmInicial e final*/}
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
          {/*Aki se monta os checkBox*/}
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
          <CheckBox style={{ flex: 1, padding: 10 }} onClick={() => {
            this.setState({
              isCheckedOleo: !this.state.isCheckedOleo
            })
          }}
            checkBoxColor={'#FF0000'} isChecked={this.state.isCheckedOleo}
            rightText={'Troca Oleo'} rightTextStyle={styles.White}
          />

          <TouchableOpacity onPress={() => {
            this.__startCamera();
          }}>
            {/*Aki se cria o botao para abertura da camera*/}
            <Image style={styles.logo}
              source={img_Camera}
            />
          </TouchableOpacity>
        </View>

        <TextInput placeholder="Anotações" placeholderTextColor='#FFFFFF' value={this.state.annotation} onChangeText={this.handleAnnotationChange} style={{ height: 100, width: "100%", borderColor: 'white', borderWidth: 1, color: 'white' }} >
          {/*Aki se cria o bloco de anotação*/}
        </TextInput>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
          {/*Aki se cria os botões de gravar e salvar*/}
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

//Codigo de estilização
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
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
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "red",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight:"bold",
    fontSize:20,

  },
  

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
    paddingRight: 30,
  },
});


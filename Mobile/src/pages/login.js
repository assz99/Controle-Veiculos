import React, {Component} from 'react';
import { StyleSheet, Text, View, Button, Image, TextInput, Alert, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { withNavigation } from 'react-navigation';
import api from '../services/api'
import img_Logo from '../logo_case.png'

//objeto para controle de user e senha
const params = {
  "username": "",
  "password": ""
}

var error = "";

export default class Login extends Component {
  state = {
    error: '',
    loggedInUser: null,
  }
//Função para alterar o user quando alterado no input
handleUserChange = (username) => {
    username = username.toString();
    params.username = username;
  }
//Função para alterar a senha quando alterado no input
handlePasswordChange = (password) => {
     password = password.toString();
     params.password = password;
  }
  // Função para fazer a requisição no servidor para autenticar o usuario
  signIn = async () => {
    try {
      //console.log("Clickou no botao");
      const response = await api.post('/api/authenticate',
        params);
      
      
      const { user, token } = response.data;
      // Armazena no dispositivo o usuario e o token de autentificação
      await AsyncStorage.multiSet([
        ['@CodeApi:token', token],
        ['@CodeApi:token', JSON.stringify(user)]
      ]);

      this.setState({ loggedInUser: user.name });

      //Passa para a tela de Checklist
      this.props.navigation.navigate('CheckList',{user});
      
    } catch (response) {
      this.setState({ error: response.data.error });

      error = JSON.stringify(this.state.error);
      console.log(error);

      
    };
  };
  //Função que ocorre quando a tela inicializa para checar se alguem foi logado anteriormente
  async componentDidMount() {
    
    const token = await AsyncStorage.getItem('@CodeApi:token');
    const user = JSON.parse(await AsyncStorage.getItem('@CodeApi:user'))

    if (token && user)
      this.setState({ loggedInUser: user });
  }


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
        onChangeText={this.handleUserChange}
      />

      <TextInput
        style={{ height: 40, width: 220, borderColor: 'white', borderWidth: 1, color: 'white', margin: 25 }}
        placeholder="                       Senha"
        placeholderTextColor="#FFFFFF"
        onChangeText={this.handlePasswordChange}
      />

      <Button onPress={this.signIn} title="Entrar"></Button>

      {!!this.state.loggedInUser && <Text style={styles.White}>{this.state.loggedInUser}</Text>}
      {!!this.state.error && <Text style={styles.White}>{this.state.error}</Text>}

      

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



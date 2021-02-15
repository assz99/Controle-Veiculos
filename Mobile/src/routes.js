import Login from './pages/login';
import checklist from './pages/checkList';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const Routes = createAppContainer(
  createStackNavigator({
    Login: Login,
    CheckList: checklist,
  })
);

export default Routes;

//Aki fica as rotas do app onde fica o local das telas de login e checklist 
//Caso tenha atualizado ou adicionado alguma lib alterar no node-modules/expo/AppEntry.json
//e apontar para esta rota

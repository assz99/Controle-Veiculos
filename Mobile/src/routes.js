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
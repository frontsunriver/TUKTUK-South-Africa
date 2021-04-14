import { createSwitchNavigator,createAppContainer } from 'react-navigation';
import { AuthStack, RiderRootNavigator, DriverRootNavigator, AdminRootNavigator } from './MainNavigator';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';

const AppNavigator= createSwitchNavigator({
        AuthLoading: AuthLoadingScreen,
        Auth: AuthStack,
        RiderRoot: RiderRootNavigator,
        DriverRoot: DriverRootNavigator,
        AdminRoot: AdminRootNavigator,
        },
        {
            initialRouteName: 'AuthLoading'
        }
    );
    const AppContainer = createAppContainer(AppNavigator);
    export default AppContainer;
  
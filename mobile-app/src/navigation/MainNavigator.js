import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import {
    DriverRating,
    ProfileScreen,
    PaymentDetails,
    RideListPage,
    MapScreen,
    BookedCabScreen,
    RegistrationPage,
    FareScreen,
    RideDetails,
    SearchScreen,
    EditProfilePage,
    AboutPage,
    OnlineChat,
    WalletDetails,
    AddMoneyScreen,
    SelectGatewayPage,
    LoginScreen,
    IntroScreen,
    DriverTrips,
    WithdrawMoneyScreen,
    DriverIncomeScreen
} from '../screens';
import SideMenu from '../components/SideMenu';

//app stack for user end
export const AppStack = {
    DriverRating: {
        screen: DriverRating,
        navigationOptions: {
            headerShown: false
        }
    },
    RideList: {
        screen: RideListPage,
        navigationOptions: {
            headerShown: false,
        }
    },
    DriverTrips: {
        screen: DriverTrips,
        navigationOptions: {
            headerShown: false
        }     
    },
    Profile: {
        screen: ProfileScreen,
        navigationOptions: {
            headerShown: false
        }
    },
    PaymentDetails: {
        screen: PaymentDetails,
        navigationOptions: {
            headerShown: false
        }
    },
    About: {
        screen: AboutPage,
        navigationOptions: {
            headerShown: false
        }
    },
    Map: {
        screen: MapScreen,
        navigationOptions: {
            headerShown: false
        }
    },
    onlineChat: {
        screen: OnlineChat,
        navigationOptions: {
            headerShown: false
        }
    },
    BookedCab: {
        screen: BookedCabScreen,
        navigationOptions: {
            headerShown: false
        }
    },
    MyEarning:{
        screen: DriverIncomeScreen,
        navigationOptions: {
            headerShown: false
        }
    },
    FareDetails: {
        screen: FareScreen,
        navigationOptions: {
            headerShown: false,
        }
    },
    RideDetails: {
        screen: RideDetails,
        navigationOptions: {
            headerShown: false
        }
    },

    Search: {
        screen: SearchScreen,
        navigationOptions: {
            headerShown: false
        }
    },
    editUser: {
        screen: EditProfilePage,
        navigationOptions: {
            headerShown: false
        }

    },
    wallet: {
        screen: WalletDetails,
        navigationOptions: {
            headerShown: false
        }

    },
    addMoney: {
        screen: AddMoneyScreen,
        navigationOptions: {
            headerShown: false
        }
    },
    withdrawMoney: {
        screen: WithdrawMoneyScreen,
        navigationOptions: {
            headerShown: false
        }
    },
    paymentMethod: {
        screen: SelectGatewayPage,
        navigationOptions: {
            headerShown: false
        }
    }
}

//authentication stack for user before login
export const AuthStack = createStackNavigator({

    Reg: {
        screen: RegistrationPage,
        navigationOptions: {
            headerShown: false,
        }
    },
    Intro: {
        screen: IntroScreen,
        navigationOptions: {
            headerShown: false,
        }
    },
    Login: {
        screen: LoginScreen,
        navigationOptions: {
            headerShown: false,
        }
    }
}, {
    initialRouteName: 'Intro',
});

//drawer routes, you can add routes here for drawer or sidemenu
const DrawerRoutes = {

    'Map': {
        name: 'Map',
        screen: createStackNavigator(AppStack, {
            initialRouteName: 'Map',
            navigationOptions: {
                headerShown: false
            }
        })
    },
    'RideList': {
        name: 'RideList',
        screen: createStackNavigator(AppStack, { initialRouteName: 'RideList', headerMode: 'none' })
    },
    'DriverTrips': {
        name: 'DriverTrips',
        screen: createStackNavigator(AppStack, { initialRouteName: 'DriverTrips', headerMode: 'none' })
    },
    'Profile': {
        name: 'Profile',
        screen: createStackNavigator(AppStack, { initialRouteName: 'Profile', headerMode: 'none' })
    },
    'About': {
        name: 'About',
        screen: createStackNavigator(AppStack, { initialRouteName: 'About', headerMode: 'none' })
    },
    'wallet': {
        name: 'wallet',
        screen: createStackNavigator(AppStack, { initialRouteName: 'wallet', headerMode: 'none' })
    },
    'MyEarning': {
        name: 'MyEarning',
        screen: createStackNavigator(AppStack, { initialRouteName: 'MyEarning', headerMode: 'none' })
    },
};

//main navigator for user end
export const RiderRootNavigator = createDrawerNavigator(
    DrawerRoutes,
    {
        drawerWidth: 180,
        initialRouteName: 'Map',
        contentComponent: SideMenu,
    });


export const DriverRootNavigator = createDrawerNavigator(
    DrawerRoutes,
    {
        drawerWidth: 180,
        initialRouteName: 'DriverTrips',
        contentComponent: SideMenu,
    });

export const AdminRootNavigator = createDrawerNavigator(
    DrawerRoutes,
    {
        drawerWidth: 180,
        initialRouteName: 'About',
        contentComponent: SideMenu,
    });
    
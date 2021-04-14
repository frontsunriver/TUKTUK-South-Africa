
import React from 'react';
import { WTransactionHistory } from '../components';
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  Dimensions,
  Alert
} from 'react-native';
import { Header, Icon } from 'react-native-elements';
import { colors } from '../common/theme';
var { height } = Dimensions.get('window');
import { language } from 'config';
import { useSelector } from 'react-redux';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function WalletDetails(props) {

  const auth = useSelector(state => state.auth);
  const settings = useSelector(state => state.settingsdata.settings);
  const providers = useSelector(state => state.paymentmethods.providers);

  const doReacharge = () => {
    if (providers) {
      props.navigation.push('addMoney', { userdata: auth.info.profile, providers: providers });
    } else {
      Alert.alert(language.alert,language.provider_not_found)
    }
  }

  const doWithdraw = () => {
    if (auth.info.profile.walletBalance>0) {
      props.navigation.push('withdrawMoney', { userdata: auth.info.profile });
    } else {
      Alert.alert(language.alert,language.wallet_zero)
    }
  }

  const walletBar = height / 4;
  return (
    <View style={styles.mainView}>
      <Header
        backgroundColor={colors.GREY.default}
        leftComponent={{ icon: 'md-menu', type: 'ionicon', color: colors.WHITE, size: 30, component: TouchableWithoutFeedback, onPress: () => { props.navigation.toggleDrawer(); } }}
        rightComponent={ auth.info && auth.info.profile && auth.info.profile.usertype =='driver'?<TouchableOpacity onPress={doWithdraw}><Text style={{color:colors.WHITE}}>{language.withdraw}</Text></TouchableOpacity>:null}
        centerComponent={<Text style={styles.headerTitleStyle}>{language.my_wallet_tile}</Text>}
        containerStyle={styles.headerStyle}
        innerContainerStyles={{ marginLeft: 10, marginRight: 10 }}
      />

      <View style={{ flex: 1, flexDirection: 'column' }}>
        <View style={{ height: walletBar, marginBottom: 12 }}>
          <View >
            <View style={{ flexDirection: 'row', justifyContent: "space-around", marginTop: 8 }}>
              <View style={{ height: walletBar - 50, width: '48%', backgroundColor: colors.GREY.Smoke_Grey, borderRadius: 8, justifyContent: 'center', flexDirection: 'column' }}>
                <Text style={{ textAlign: 'center', fontSize: 18 }}>{language.wallet_ballance}</Text>
                <Text style={{ textAlign: 'center', fontSize: 25, fontWeight: '500', color: colors.GREEN.medium }}>{settings.symbol}{auth.info && auth.info.profile ? parseFloat(auth.info.profile.walletBalance).toFixed(2) : ''}</Text>
              </View>
              <TouchableWithoutFeedback onPress={doReacharge}>
                <View style={{ height: walletBar - 50, width: '48%', backgroundColor: colors.GREEN.medium , borderRadius: 8, justifyContent: 'center', flexDirection: 'column' }}>
                  <Icon
                    name='add-circle'
                    type='MaterialIcons'
                    color={colors.WHITE}
                    size={45}
                    iconStyle={{ lineHeight: 48 }}
                  />
                  <Text style={{ textAlign: 'center', fontSize: 18, color: colors.WHITE }}>{language.add_money}</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
          <View style={{ marginVertical: 10 }}>
            <Text style={{ paddingHorizontal: 10, fontSize: 18, fontWeight: '500', marginTop: 8 }}>{language.transaction_history_title}</Text>
          </View>
        </View>

        <View style={{}}>
          <View style={{ height: (height - walletBar) - 110 }}>
            <WTransactionHistory walletHistory={auth.info.profile.walletHistory}/>
          </View>
        </View>
      </View>

    </View>
  );

}

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: colors.GREY.default,
    borderBottomWidth: 0
  },
  headerTitleStyle: {
    color: colors.WHITE,
    fontFamily: 'Roboto-Bold',
    fontSize: 20
  },

  textContainer: {
    textAlign: "center"
  },
  mainView: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },

});

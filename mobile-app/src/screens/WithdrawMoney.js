import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  TextInput,
  Alert
} from 'react-native';
import { Header } from 'react-native-elements';
import { colors } from '../common/theme';
import { language } from 'config';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector,useDispatch } from 'react-redux';
import { FirebaseContext } from 'common/src';

export default function WithdrawMoneyScreen(props) {
  const { api } = useContext(FirebaseContext);
  const {
    updateWalletBalance
  } = api;
  const dispatch = useDispatch();
  const settings = useSelector(state => state.settingsdata.settings);
  const [state, setState] = useState({
    userdata: props.navigation.getParam('userdata'),
    amount: null
  });

  const withdrawNow = () => {
    if(state.userdata.walletBalance>0 && parseFloat(state.amount)> 0 && parseFloat(state.amount)<=state.userdata.walletBalance){
      let walletBalance = state.userdata.walletBalance - parseFloat(state.amount);
      let tDate = new Date();
      let details = {
        type: 'Withdraw',
        amount: parseFloat(state.amount),
        date: tDate.toString(),
        txRef: tDate.getTime().toString(),
        transaction_id: tDate.getTime().toString()
      }
      dispatch(updateWalletBalance(walletBalance,details));
      setTimeout(() => {
        props.navigation.navigate('wallet')
      }, 3000);
    }else{
      if(parseFloat(state.amount)> state.userdata.walletBalance){
        Alert.alert(language.alert,language.withdraw_more);
      }
      else if(parseFloat(state.amount)<=0){
        Alert.alert(language.alert,language.withdraw_below_zero);
      }else{
        Alert.alert(language.alert,language.valid_amount);
      }
    }
  }

  const newData = ({ item, index }) => {
    return (
      <TouchableOpacity 
        style={[styles.boxView, { backgroundColor: item.selected ? colors.GREY.default : colors.GREY.Smoke_Grey }]} 
        onPress={() => { 
          quckAdd(index); 
        }}>
        <Text style={styles.quckMoneyText, { color: item.selected ? colors.WHITE : colors.BLACK }} >
          {settings.symbol}{item.amount}
        </Text>
      </TouchableOpacity>
    )
  }


  //go back
  const goBack = () => {
    props.navigation.goBack();
  }

  return (
    <View style={styles.mainView}>
      <Header
        backgroundColor={colors.GREY.default}
        leftComponent={{ icon: 'ios-arrow-back', type: 'ionicon', color: colors.WHITE, size: 30, component: TouchableWithoutFeedback, onPress: () => { goBack() } }}
        centerComponent={<Text style={styles.headerTitleStyle}>{language.withdraw_money}</Text>}
        containerStyle={styles.headerStyle}
        innerContainerStyles={{ marginLeft: 10, marginRight: 10 }}
      />

      <View style={styles.bodyContainer}>
        <Text style={styles.walletbalText}>{language.Balance} - <Text style={styles.ballance}>{settings.symbol}{state.userdata ? parseFloat(state.userdata.walletBalance).toFixed(2) : ''}</Text></Text>

        <TextInput
          style={styles.inputTextStyle}
          placeholder={language.amount + " (" + settings.symbol + ")"}
          keyboardType={'number-pad'}
          onChangeText={(text) => setState({ ...state,amount: text })}
          value={state.amount}
        />
        <TouchableOpacity
          style={styles.buttonWrapper2}
          onPress={withdrawNow}>
          <Text style={styles.buttonTitle}>{language.withdraw}</Text>
        </TouchableOpacity>
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

  mainView: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  bodyContainer: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 10,
    paddingHorizontal: 12
  },
  walletbalText: {
    fontSize: 17
  },
  ballance: {
    fontWeight: 'bold'
  },
  inputTextStyle: {
    marginTop: 10,
    height: 50,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    fontSize: 30
  },
  buttonWrapper2: {
    marginBottom: 10,
    marginTop: 18,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.GREY.default,
    borderRadius: 8,
  },
  buttonTitle: {
    color: colors.WHITE,
    fontSize: 18,
  },
  quickMoneyContainer: {
    marginTop: 18,
    flexDirection: 'row',
    paddingVertical: 4,
    paddingLeft: 4,
  },
  boxView: {
    height: 40,
    width: 60,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8
  },
  quckMoneyText: {
    fontSize: 16,
  }

});


import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  TextInput,
  FlatList
} from 'react-native';
import { Header } from 'react-native-elements';
import { colors } from '../common/theme';

import { language } from 'config';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';

export default function AddMoneyScreen(props) {

  const settings = useSelector(state => state.settingsdata.settings);

  const [state, setState] = useState({
    userdata: props.navigation.getParam('userdata'),
    providers: props.navigation.getParam('providers'),
    amount: '5',
    qickMoney: [{ amount: '5', selected: false }, { amount: '10', selected: false }, { amount: '20', selected: false }, { amount: '50', selected: false }, { amount: '100', selected: false }],
  });

  const quckAdd = (index) => {
    let quickM = state.qickMoney;
    for (let i = 0; i < quickM.length; i++) {
      quickM[i].selected = false;
      if (i == index) {
        quickM[i].selected = true;
      }
    }
    setState({
      ...state,
      amount: quickM[index].amount,
      qickMoney: quickM
    })
  }

  const payNow = () => {
    var d = new Date();
    var time = d.getTime();
    let payData = {
      email: state.userdata.email,
      amount: state.amount,
      order_id: time.toString(),
      name: language.add_money,
      description: language.wallet_ballance,
      currency: settings.code,
      quantity: 1,
      paymentType: 'walletCredit'
    }
    if (payData) {
      props.navigation.navigate("paymentMethod", {
        payData: payData,
        userdata: state.userdata,
        settings: state.settings,
        providers: state.providers
      });
    }
  }

  const newData = ({ item, index }) => {
    return (
      <TouchableOpacity style={[styles.boxView, { backgroundColor: item.selected ? colors.GREY.default : colors.GREY.primary }]} onPress={() => { quckAdd(index); }}><Text style={styles.quckMoneyText, { color: item.selected ? colors.WHITE : colors.BLACK }} >{settings.symbol}{item.amount}</Text></TouchableOpacity>
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
        centerComponent={<Text style={styles.headerTitleStyle}>{language.add_money_tile}</Text>}
        containerStyle={styles.headerStyle}
        innerContainerStyles={{ marginLeft: 10, marginRight: 10 }}
      />

      <View style={styles.bodyContainer}>
        <Text style={styles.walletbalText}>{language.Balance} - <Text style={styles.ballance}>{settings.symbol}{state.userdata ? parseFloat(state.userdata.walletBalance).toFixed(2) : ''}</Text></Text>

        <TextInput
          style={styles.inputTextStyle}
          placeholder={language.addMoneyTextInputPlaceholder + " (" + settings.symbol + ")"}
          keyboardType={'number-pad'}
          onChangeText={(text) => setState({ ...state,amount: text })}
          value={state.amount}
        />
        <View style={styles.quickMoneyContainer}>
          <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
            <FlatList
              keyExtractor={(item, index) => index.toString()}
              data={state.qickMoney}
              renderItem={newData}
              horizontal={true}
            />
          </ScrollView>
        </View>
        <TouchableOpacity
          style={styles.buttonWrapper2}
          onPress={payNow}>
          <Text style={styles.buttonTitle}>{language.add_money_tile}</Text>
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

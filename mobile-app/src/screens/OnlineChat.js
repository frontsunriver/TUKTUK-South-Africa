import React,{useState,useEffect,useRef,useContext} from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Dimensions,
  TextInput,
  TouchableWithoutFeedback,
  Alert
} from "react-native";
import { colors } from "../common/theme";
import { Header } from "react-native-elements";
import { language } from 'config';
var { height } = Dimensions.get('window');
import { useSelector, useDispatch } from 'react-redux';
import { NavigationEvents } from 'react-navigation';
import { ScrollView } from "react-native-gesture-handler";
import { FirebaseContext } from 'common/src';

export default function OnlineChat(props) {
  const { api } = useContext(FirebaseContext);
  const {
    fetchChatMessages, 
    sendMessage, 
    stopFetchMessages
  } = api;
  const dispatch = useDispatch();
  const bookingId = props.navigation.getParam('bookingId');
  const activeBookings = useSelector(state => state.bookinglistdata.active);
  const [curBooking, setCurBooking] = useState(null);
  const role = useSelector(state => state.auth.info.profile.usertype);
  const [inputMessage,setInputMessage] = useState('');
  const allChat = useSelector(state=>state.chatdata.messages);
  const scrollViewRef = useRef();

  useEffect(() => {
    if (activeBookings && activeBookings.length >= 1) {
      let booking = activeBookings.filter(booking => booking.id == bookingId)[0];
      setCurBooking(booking);
    }
  }, [activeBookings]);


  const SendMsg = () => {
      if (inputMessage == '' || inputMessage == undefined || inputMessage == null) {
          Alert.alert(language.alert,language.chat_blank);
      } else {
        setInputMessage('');
        dispatch(sendMessage({
          booking:curBooking,
          role:role,
          message:inputMessage
        }));
      }
  }

  const renderItem = ({ item }) => {
    return (
      item.source == "rider" ?
        <View style={styles.drivermsgStyle}>
          <Text style={styles.msgTextStyle}>{item ? item.message : language.chat_not_found}</Text>
          <Text style={styles.msgTimeStyle}>{item ? item.msgTime : null}</Text>
        </View>
        :
        <View style={styles.riderMsgStyle}>
          <Text style={styles.riderMsgText}>{item ? item.message : language.chat_not_found}</Text>
          <Text style={styles.riderMsgTime}>{item ? item.msgTime : null}</Text>
        </View>
    );
  }


  return (
    <View style={styles.container}>
      <NavigationEvents
        onWillFocus={payload => {
          console.log("Focus");
          dispatch(fetchChatMessages(bookingId));
        }}
        onWillBlur={payload => {
          dispatch(stopFetchMessages(bookingId));
        }}
      />
      <Header
        backgroundColor={colors.GREY.default}
        leftComponent={{ icon: 'angle-left', type: 'font-awesome', color: colors.WHITE, size: 30, component: TouchableWithoutFeedback, onPress: () => { props.navigation.goBack(); } }}
        centerComponent={<Text style={styles.headerTitleStyle}>{language.chat_title}</Text>}
        containerStyle={styles.headerStyle}
        innerContainerStyles={styles.inrContStyle}
        statusBarProps={{ barStyle: 'light-content' }}
        barStyle="light-content"
        containerStyle={{
          justifyContent: 'space-around',
          height: 80
        }}
      />

      <KeyboardAvoidingView behavior= {(Platform.OS === 'ios')? "padding" : null} style={{flex:1}}>
        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={(contentWidth, contentHeight)=> {scrollViewRef.current.scrollToEnd({animated: true})}}
        >
        <FlatList
          data={allChat? allChat: []}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
        </ScrollView>
        <View style={styles.footer}>
          <TextInput
            value={inputMessage}
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder={language.chat_input_title}
            onChangeText={text => setInputMessage(text)}
          />
          <TouchableOpacity onPress={() => SendMsg()}>
            <Text style={styles.send}>{language.send_button_text}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}


//Screen Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.GREY.btnSecondary
  },
  container1: {
    height: height - 150
  },
  container2: {
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: StyleSheet.hairlineWidth
  },
  backIconStyle: {
    alignSelf: 'flex-start',
    marginLeft: 20
  },
  contentContainerStyle: {
    flexGrow: 1
  },
  headerTitleStyle: {
    color: colors.WHITE,
    fontSize: 18,
    textAlign: 'center',
  },
  headerStyle: {
    backgroundColor: colors.GREY.default,
    borderBottomWidth: 0
  },

  inrContStyle: {
    marginLeft: 10,
    marginRight: 10
  },
  row: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.GREY.btnPrimary
  },
  avatar: {
    borderRadius: 20,
    width: 40,
    height: 40,
    marginRight: 10
  },
  rowText: {
    flex: 1
  },
  message: {
    fontSize: 18
  },
  sender: {
    fontWeight: 'bold',
    paddingRight: 10
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: colors.WHITE,
    borderBottomColor: colors.GREY.btnPrimary
  },
  input: {
    paddingHorizontal: 20,
    fontSize: 18,
    flex: 1
  },
  send: {
    alignSelf: 'center',
    color: 'lightseagreen',
    fontSize: 16,
    fontWeight: 'bold',
    padding: 20
  },
  drivermsgStyle: {
    backgroundColor: colors.GREY.default,
    marginBottom: 5,
    marginTop: 5,
    marginRight: 10,
    marginLeft: 30,
    borderRadius: 20,
    elevation: 5,
    shadowOpacity: 0.75,
    shadowRadius: 5,
    shadowColor: colors.GREY.Deep_Nobel,
    shadowOffset: { height: 1, width: 0 },
  },
  msgTextStyle: {
    marginStart: 15,
    marginEnd: 15,
    marginTop: 10,
    textAlign: "right",
    fontSize: 18,
    color: colors.WHITE
  },
  msgTimeStyle: {
    marginStart: 15,
    marginBottom: 10,
    marginEnd: 15,
    textAlign: "right",
    fontSize: 12,
    color: colors.WHITE
  },
  riderMsgStyle: {
    backgroundColor: colors.WHITE,
    marginBottom: 5,
    marginTop: 5,
    marginRight: 30,
    marginLeft: 10,
    borderRadius: 20,
    shadowOpacity: 0.75,
    shadowRadius: 5,
    shadowColor: colors.GREY.Deep_Nobel,
    shadowOffset: { height: 1, width: 0 },
  },
  riderMsgText: {
    marginStart: 15,
    textAlign: "left",
    fontSize: 18,
    color: colors.BLACK,
    marginTop: 10
  },
  riderMsgTime: {
    marginStart: 15,
    textAlign: "left",
    fontSize: 12,
    color: colors.BLACK,
    marginBottom: 10
  }
});

import React from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity
} from "react-native";
import { Avatar, Button } from "react-native-elements";
import { colors } from "../common/theme";
import { language } from 'config';
import { useSelector } from 'react-redux';

export default function PromoComp(props) {

  const settings = useSelector(state => state.settingsdata.settings);
  const promos = useSelector(state => state.promodata.promos);

  const onPressButton = (item, index) => {
    const { onPressButton } = props;
    onPressButton(item, index)
  }

  const renderData = ({ item, index }) => {
    return (
      <View style={styles.container} >
        <View style={styles.promoViewStyle}>
          <View style={styles.promoPosition}>
            <View style={styles.avatarPosition}>
              <Avatar
                size={40}
                rounded
                source={{
                  uri: item.promo_discount_type ?
                    item.promo_discount_type == 'flat' ? "https://cdn1.iconfinder.com/data/icons/service-maintenance-icons/512/tag_price_label-512.png" :
                      "https://cdn4.iconfinder.com/data/icons/icoflat3/512/discount-512.png" : null
                }}
              />
            </View>
            <View style={styles.textViewStyle}>
              <Text style={styles.textStyle}>
                <Text style={styles.couponCode}>{item.promo_name}</Text> - {item.promo_description}
              </Text>
              <Text style={styles.timeTextStyle}>{language.min_order_value} {settings.symbol}{item.min_order}</Text>

            </View>
            <View style={styles.applyBtnPosition} >
              <Button
                title={language.apply}
                TouchableComponent={TouchableOpacity}
                titleStyle={styles.buttonTitleStyle}
                buttonStyle={styles.confButtonStyle}
                onPress={() => onPressButton(item, index)}
              />
            </View>
          </View>
          <View style={styles.borderBottomStyle} />
        </View>
      </View>
    );
  };

  return (
    <View>
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        data={promos}
        renderItem={renderData}
      />
    </View>
  );

}
//Screen Styling
const styles = StyleSheet.create({
  container: {
    width: "95%",
    alignSelf: "center",
    paddingTop: 10,
    paddingBottom: 10
  },
  viewStyle: {
    flexDirection: "row",
    backgroundColor: colors.WHITE
  },
  borderBottomStyle: {
    borderBottomWidth: 1,
    marginTop: 5,
    borderBottomColor: colors.GREY.border,
    opacity: 0.3
  },
  promoViewStyle: {
    flex: 1
  },
  promoPosition: {
    flexDirection: "row"
  },
  avatarPosition: {
    justifyContent: "flex-start",
    flex: 1.5
  },
  textViewStyle: {
    justifyContent: "center",
    flex: 6
  },
  applyBtnPosition: {
    justifyContent: "flex-start",
    flex: 2.5
  },
  textStyle: {
    fontSize: 15,
    flexWrap: "wrap"
  },
  couponCode: {
    fontWeight: 'bold'
  },
  timeTextStyle: {
    color: colors.GREY.Deep_Nobel,
    marginTop: 2
  },
  buttonContainerStyle: {
    flexDirection: "row",
    marginTop: 4
  },
  buttonTitleStyle: {
    textAlign: "center",
    color: colors.GREEN.default,
    fontSize: 11,
    paddingBottom: 0,
    paddingTop: 0
  },
  confButtonStyle: {
    borderRadius: 6,
    height: 29,
    width: 65,
    alignSelf: 'flex-end',
    backgroundColor: colors.GREY.whiteish,
    elevation: 0
  },
  deleteButtonStyle: {
    backgroundColor: colors.WHITE,
    borderRadius: 6,
    height: 29,
    marginLeft: 8,
    borderColor: colors.GREY.Dim_Grey,
    borderWidth: 1,
    width: 85
  },
  deleteBtnTitleStyle: {
    color: colors.LIGHT_RED,
    textAlign: "center",
    fontSize: 11,
    paddingBottom: 0,
    paddingTop: 0
  }
});

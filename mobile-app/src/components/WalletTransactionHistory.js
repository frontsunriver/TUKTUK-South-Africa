import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, FlatList, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements'
import { colors } from '../common/theme';
import  { language, dateStyle }  from 'config';
import { useSelector } from 'react-redux';

export default function  WTransactionHistory(props) {

    const [data,setData] = useState(null);
    const settings = useSelector(state => state.settingsdata.settings);

    useEffect(()=>{
        let wdata = props.walletHistory;
        var wallHis = []
        for(key in wdata){
            wdata[key].walletKey = key
            let d = wdata[key].date;
            let tDate = new Date(d);
            wdata[key].date = tDate.toLocaleString(dateStyle);
            wallHis.push(wdata[key])
        }
        wallHis.length>0?setData(wallHis.reverse()):setData([]);
    },[props.walletHistory]);

    const newData = ({ item }) => {
        return (
            <View style={styles.container}>
                <View style={styles.divCompView}>
                    <View style={styles.containsView}>
                        <View style={styles.statusStyle}>
                            {item.type == 'Credit' ?
                                <View style={styles.crimageHolder}>
                                    <Icon
                                        iconStyle={styles.debiticonPositionStyle}
                                        name='keyboard-arrow-left'
                                        type='MaterialIcons'
                                        size={32}
                                        color={colors.WHITE}
                                    />

                                </View>
                            :null}
                            {item.type == 'Debit' ?
                                <View style={styles.drimageHolder}>
                                    <Icon
                                        iconStyle={styles.crediticonPositionStyle}
                                        name='keyboard-arrow-right'
                                        type='MaterialIcons'
                                        size={32}
                                        color={colors.WHITE}
                                    />
                                </View>
                            :null}
                            {item.type == 'Withdraw' ?
                                <View style={styles.primageHolder}>
                                    <Icon
                                        iconStyle={styles.crediticonPositionStyle}
                                        name='keyboard-arrow-down'
                                        type='MaterialIcons'
                                        size={32}
                                        color={colors.WHITE}
                                    />
                                </View>
                            :null}
                            <View style={styles.statusView}>
                            {item.type  && item.type == 'Credit'?
                                <Text style={styles.historyamounttextStyle}>{language.credited + ' ' + settings.symbol + parseFloat(item.amount).toFixed(2)}</Text>
                            :null}
                            {item.type && item.type == 'Debit'?
                                <Text style={styles.historyamounttextStyle}>{language.debited + ' ' + settings.symbol + parseFloat(item.amount).toFixed(2)}</Text>
                            :null}
                            {item.type && item.type == 'Withdraw'?
                                <Text style={styles.historyamounttextStyle}>{language.withdrawn + ' ' + settings.symbol + parseFloat(item.amount).toFixed(2)}</Text>
                            :null}   
                            <Text style={styles.textStyle}>{language.Transaction_Id} {item.txRef}</Text>
                            <Text style={styles.textStyle2}>{item.date}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
    return (
        <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={data}
            renderItem={newData}
        />
    );
    
};
const styles = StyleSheet.create({
    myHeader: {
        marginTop: 0,
    },
    container: {
        flex: 1,
    },
    divCompView: {
        height: 80,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        backgroundColor: colors.GREY.whiteish,
        flexDirection: 'row',
        flex: 1,
        borderRadius: 6,
    },
    drimageHolder: {
        height: 40,
        width: 40,
        borderRadius: 20,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.DULL_RED,
        padding: 3
    },
    crimageHolder: {
        height: 40,
        width: 40,
        borderRadius: 20,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.GREEN.bright,
    },
    primageHolder: {
        height: 40,
        width: 40,
        borderRadius: 20,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'blue',
        padding: 3
    },
    containsView: {
        justifyContent: 'center',
    },

    statusStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems : 'center'
    },
    statusView: {
        marginLeft: 10

    },
    textStyle: {
        fontSize: 14,
        fontFamily: 'Roboto-Regular',
        fontWeight:'500',
        color: colors.GREY.Deep_Nobel
    },
    historyamounttextStyle: {
        fontSize: 16,
        fontFamily: 'Roboto-Regular',
        fontWeight:'500'
    },
    textStyle2:{
        fontSize: 14,
        fontFamily: 'Roboto-Regular',
        color: colors.GREY.Deep_Nobel
    },
    textColor: {
        color: colors.GREY.iconPrimary,
        alignSelf: 'center',
        fontSize: 12,
        fontFamily: 'Roboto-Regular',
        paddingLeft: 5
    },
    textFormat: {
        flex: 1,
        width: Dimensions.get("window").width - 100
    },
    cabLogoStyle: {
        width: 25,
        height: 28,
        flex: 1
    },
    clockIconStyle: {
        flexDirection: 'row',
        marginTop: 8
    },
    debiticonPositionStyle: {
        alignSelf: 'flex-start',
    },
    crediticonPositionStyle: {
        alignSelf: 'flex-start',
    }
});
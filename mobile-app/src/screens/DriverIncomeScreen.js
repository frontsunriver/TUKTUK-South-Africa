import React, {useState,useEffect} from 'react';
import { Header } from 'react-native-elements';
import { colors } from '../common/theme';
import { 
    StyleSheet,
    View,
    Text,
    TouchableWithoutFeedback
} from 'react-native';
import { language } from 'config';
import { useSelector } from 'react-redux';

export default function DriverIncomeScreen(props) {

    const bookings = useSelector(state => state.bookinglistdata.bookings);
    const settings = useSelector(state => state.settingsdata.settings);
    const [totalEarning,setTotalEarning] = useState(0);
    const [today,setToday] = useState(0);
    const [thisMonth, setThisMonth] = useState(0);

    useEffect(()=>{
        if(bookings){
            let today =  new Date();
            let tdTrans = 0;
            let mnTrans = 0;
            let totTrans = 0;
            for(let i=0;i<bookings.length;i++){
                const {tripdate,driver_share} = bookings[i];
                let tDate = new Date(tripdate);
                if(driver_share != undefined){
                    if(tDate.getDate() === today.getDate() && tDate.getMonth() === today.getMonth()){
                        tdTrans  = tdTrans + driver_share;
                    }          
                    if(tDate.getMonth() === today.getMonth() && tDate.getFullYear() === today.getFullYear()){
                        mnTrans  = mnTrans + driver_share;
                    }
                    totTrans  = totTrans + driver_share; 
                }
            }
            setTotalEarning(totTrans);
            setToday(tdTrans);
            setThisMonth(mnTrans);   
        }else{
            setTotalEarning(0);
            setToday(0);
            setThisMonth(0);
        }
    },[bookings]);

    return (
        <View style={styles.mainView}>
            <Header 
                backgroundColor={colors.GREY.default}
                leftComponent={{icon:'md-menu', type:'ionicon', color:colors.WHITE, size: 30, component: TouchableWithoutFeedback,onPress: ()=>{props.navigation.toggleDrawer();} }}
                centerComponent={<Text style={styles.headerTitleStyle}>{language.incomeText}</Text>}
                containerStyle={styles.headerStyle}
                innerContainerStyles={{marginLeft:10, marginRight: 10}}
            />
            <View style={styles.bodyContainer}>
                <View style={styles.todaysIncomeContainer}>
                    <Text style={styles.todayEarningHeaderText}>{language.today_text}</Text>
                    <Text style={styles.todayEarningMoneyText}>{settings.symbol}{today?parseFloat(today).toFixed(2):'0'}</Text>
                </View>
                <View style={styles.listContainer}>
                    <View style={styles.totalEarning}>
                    <Text style={styles.todayEarningHeaderText2}>{language.thismonth}</Text>
                    <Text style={styles.todayEarningMoneyText2}>{settings.symbol}{thisMonth?parseFloat(thisMonth).toFixed(2):'0'}</Text>
                    </View>
                    <View style={styles.thismonthEarning}>
                    <Text style={styles.todayEarningHeaderText2}>{language.totalearning}</Text>
                    <Text style={styles.todayEarningMoneyText2}>{settings.symbol}{totalEarning?parseFloat(totalEarning).toFixed(2):'0'}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainView:{ 
        flex:1, 
        backgroundColor: colors.WHITE, 
    } ,
    headerStyle: { 
        backgroundColor: colors.GREY.default, 
        borderBottomWidth: 0 
    },
    headerTitleStyle: { 
        color: colors.WHITE,
        fontFamily:'Roboto-Bold',
        fontSize: 20
    },
    bodyContainer:{
        flex:1,
        backgroundColor: colors.YELLOW.secondary,
        flexDirection:'column'
    },
    todaysIncomeContainer:{
        flex:1.5,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: colors.YELLOW.light,
    },
    listContainer:{
        flex:5,
        backgroundColor: colors.WHITE,
        marginTop:1,
        flexDirection:'row',
        paddingHorizontal:6,
        paddingVertical:6,
        paddingBottom:6,
        justifyContent:'space-between',
        alignItems:'flex-start'
    },
    todayEarningHeaderText:{
        fontSize:20,
        paddingBottom:5,
        color:colors.GREEN.bright
    },
    todayEarningMoneyText:{
        fontSize:55,
        fontWeight:'bold',
        color:colors.GREEN.bright 
    },
    totalEarning:{
       height:90,
       width:'49%',
       backgroundColor: colors.GREEN.medium,
       borderRadius:6,
       justifyContent:'center',
       alignItems:'center',
    },
    thismonthEarning:{
        height:90,
        width:'49%',
        backgroundColor: colors.YELLOW.primary,
        borderRadius:6,
        justifyContent:'center',
        alignItems:'center',
    },
    todayEarningHeaderText2:{
        fontSize:16,
        paddingBottom:5,
        color: colors.WHITE
    },
    todayEarningMoneyText2:{
        fontSize:20,
        fontWeight:'bold',
        color: colors.WHITE
    },
})
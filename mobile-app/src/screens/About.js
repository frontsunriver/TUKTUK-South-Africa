import React from 'react';
import { Header } from 'react-native-elements';
import { colors } from '../common/theme';
import {
    StyleSheet,
    View,
    Text,
    TouchableWithoutFeedback,
    Dimensions,
    Image
} from 'react-native';
var { width } = Dimensions.get('window');
import { language } from 'config';


export default function AboutPage(props) {
    return (
        <View style={styles.mainView}>
            <Header
                backgroundColor={colors.GREY.default}
                leftComponent={{ icon: 'md-menu', type: 'ionicon', color: colors.WHITE, size: 30, component: TouchableWithoutFeedback, onPress: () => { props.navigation.toggleDrawer(); } }}
                centerComponent={<Text style={styles.headerTitleStyle}>{language.about_us_menu}</Text>}
                containerStyle={styles.headerStyle}
                innerContainerStyles={{ marginLeft: 10, marginRight: 10 }}
            />
            <View>
                <View styles={{ flex: 1 }}>
                    <View style={{ height: 200, width: 200, marginTop: 30, marginBottom: 40, alignSelf: 'center' }}>
                        <Image
                            style={{ width: 200, height: 200, borderRadius: 15 }}
                            source={require('../../assets/images/logo1024x1024.png')}
                        />
                    </View>
                    <View style={{ width: width, paddingLeft: 40, paddingRight: 40 }}>
                        <Text style={{ textAlign: 'justify', fontSize: 20, lineHeight: 28 }}>
                            {language.about_us_content1 + ' ' + language.about_us_content2} 
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    mainView: {
        flex: 1,
        backgroundColor: colors.WHITE,
        //marginTop: StatusBar.currentHeight,
    },
    headerStyle: {
        backgroundColor: colors.GREY.default,
        borderBottomWidth: 0
    },
    headerTitleStyle: {
        color: colors.WHITE,
        fontFamily: 'Roboto-Bold',
        fontSize: 20
    },
    aboutTitleStyle: {
        color: colors.BLACK,
        fontFamily: 'Roboto-Bold',
        fontSize: 20,
        marginLeft: 8,
        marginTop: 8
    },
    aboutcontentmainStyle: {
        marginTop: 12,
        marginBottom: 60
    },
    aboutcontentStyle: {
        color: colors.GREY.secondary,
        fontFamily: 'Roboto-Regular',
        fontSize: 15,
        textAlign: "justify",
        alignSelf: 'center',
        width: width - 20,
        letterSpacing: 1,
        marginTop: 6,
    },
    contact: {
        marginTop: 6,
        marginLeft: 8,
        //flexDirection:'row',
        width: "100%",
        marginBottom: 30
    },
    contacttype1: {
        textAlign: 'left',
        color: colors.GREY.secondary,
        fontFamily: 'Roboto-Bold',
        fontSize: 15,
    },
    contacttype2: {
        textAlign: 'left',
        marginTop: 4,
        color: colors.GREY.secondary,
        fontFamily: 'Roboto-Bold',
        fontSize: 15,
    }
})
import React from 'react';
import { 
    StyleSheet,
    Text,
    TouchableOpacity,
  } from 'react-native';
import { colors } from '../common/theme';


export default function Button(props){
    const { style, children, btnClick, buttonStyle } = props;
    return (
        <TouchableOpacity
            style={[styles.button,style]}
            onPress={btnClick}
        >
            <Text style={[styles.textStyle, buttonStyle]}>{children}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button:{
        alignItems: 'center',
        justifyContent:'center',
        padding: 10,
        borderRadius:5
    },
    textStyle:{
        color: colors.WHITE,
        width:"100%",
        textAlign: "center"
    }
});

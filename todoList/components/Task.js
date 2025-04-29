import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Task = ({text, logo}) => {
    return(
        <View style={styles.items}>
            <View style={styles.itemLeft}>
                {logo ? <View style={styles.square}><Text style={styles.squareText}>{logo}</Text></View>: <View style={styles.checkbox}><Text style={styles.squareText}>{logo}</Text></View>}
                <Text style={styles.itemText}>{text}</Text>
            </View>
            <View style={styles.circular}></View>
        </View>
    )
}

const styles = StyleSheet.create({
    items:{
        backgroundColor : "#FFF",
        padding: 15,
        borderRadius: 10,
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    itemLeft:{
        flexDirection:'row',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    checkbox:{
        width: 25,
        height: 25,
        borderRadius: 10,
        backgroundColor: "blue",
        opacity: 0.4,
        marginRight: 15,
        marginVertical: 'auto'
    },
    square:{
        width: 25,
        height: 25,
        borderRadius: 10,
        marginRight: 15,
        marginVertical: 'auto'
    },
    squareText:{
        fontSize: 20,
        margin: 'auto',
        opacity: 1.0,
    },
    itemText:{
        maxWidth: '80%'
    },
    circular:{
        width: 12,
        height: 12,
        borderColor: '#55BCF6',
        borderWidth: 2,
        borderRadius: 5
    }
});

export default Task;
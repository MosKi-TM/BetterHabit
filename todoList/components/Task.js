import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Task = ({ text, logo, completed, completedBy = [], users = [] }) => {
    const completedUsers = users.filter(user => 
        completedBy.some(completedUser => completedUser._id.toString() === user._id.toString())
      );
    console.log(completedUsers);
    return (
        <View style={[styles.items, completed && styles.completed]}>
            <View style={styles.itemLeft}>
                {logo ? (
                    <View style={styles.square}>
                        <Text style={styles.squareText}>{logo}</Text>
                    </View>
                ) : (
                    <View style={styles.checkbox}>
                        <Text style={styles.squareText}>{logo}</Text>
                    </View>
                )}
                <Text style={styles.itemText}>{text}</Text>
            </View>

            <View style={styles.avatars}>
            {completedUsers.map((user, index) => (
                <View
                key={`${user._id || user.id}-${index}`}
                style={[styles.avatar, { left: index * -15, zIndex: completedUsers.length + index }]}
                >
                <Text style={styles.avatarText}>
                    {user.username?.charAt(0).toUpperCase() || "?"}
                </Text>
                </View>
            ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    items: {
        backgroundColor: "#FFF",
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    completed: {
        backgroundColor: '#D4EDDA' // Light green background
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    checkbox: {
        width: 25,
        height: 25,
        borderRadius: 10,
        backgroundColor: "blue",
        opacity: 0.4,
        marginRight: 15,
        marginVertical: 'auto'
    },
    square: {
        width: 25,
        height: 25,
        borderRadius: 10,
        marginRight: 15,
        marginVertical: 'auto'
    },
    squareText: {
        fontSize: 20,
        margin: 'auto',
        opacity: 1.0,
    },
    itemText: {
        maxWidth: '80%'
    },
    circular: {
        width: 12,
        height: 12,
        borderColor: '#55BCF6',
        borderWidth: 2,
        borderRadius: 5
    },
    avatars: {
        flexDirection: 'row',
        marginLeft: 10,
        minWidth: 50,
        height: 30,
        alignItems: 'center'
      },
      avatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#6c757d',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        borderWidth: 1,
        borderColor: '#fff'
      },
      avatarText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold'
      }
});


export default Task;
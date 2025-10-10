import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';

export default function CustomerChat() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 5,
        text: 'Thank you! See you soon.',
        createdAt: new Date(Date.now() - 1000),
        user: {
          _id: 1,
        },
      },
      {
        _id: 4,
        text: 'I will be there in 5 minutes.',
        createdAt: new Date(Date.now() - 60000),
        user: {
          _id: 2,
          name: 'Rider',
          avatar: 'https://i.pravatar.cc/150?img=12',
        },
      },
      {
        _id: 3,
        text: 'Where are you now?',
        createdAt: new Date(Date.now() - 120000),
        user: {
          _id: 1,
        },
      },
      {
        _id: 2,
        text: 'Yes, I am on my way to pick up your package.',
        createdAt: new Date(Date.now() - 180000),
        user: {
          _id: 2,
          name: 'Rider',
          avatar: 'https://i.pravatar.cc/150?img=12',
        },
      },
      {
        _id: 1,
        text: 'Hello! Are you coming to pick up the package?',
        createdAt: new Date(Date.now() - 240000),
        user: {
          _id: 1,
        },
      },
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
  }, []);

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
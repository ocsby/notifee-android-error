/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import type {Node} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import notifee, {
  TriggerType,
  RepeatFrequency,
  AndroidImportance,
} from '@notifee/react-native';

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [detail, setDetail] = useState();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  notifee.onBackgroundEvent(async ({type, detail}) => {
    console.debug('onBackgroundEvent handler');
  });

  const createTrigger = () => {
    const date = new Date().getTime() + 1000 * 15;
    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date, // schedule 15 seconds later
      alarmManager: {
        allowWhileIdle: true,
      },
      repeatFrequency: RepeatFrequency.HOURLY,
    };

    notifee
      .createChannel({
        id: 'notifeetest',
        name: 'Default Channel',
        sound: 'default',
      })
      .then(channelId => {
        console.log('Channel Created' + channelId);
        notifee
          .createTriggerNotification(
            {
              title: 'Test Notification',
              body: 'Testing notification',
              android: {
                channelId,
                importance: AndroidImportance.HIGH,
                pressAction: {
                  id: 'default',
                },
              },
            },
            trigger,
          )
          .then(data =>
            setDetail(
              `Notification ${data} created at ${new Date(date).toString()}`,
            ),
          );
      })
      .catch(e => console.log(e));
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
            marginTop: 100,
          }}>
          <Button onPress={createTrigger} title="Schedule Timestamp Trigger" />
          <Text style={{marginTop: 100}}>{detail}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Alert,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { Notifications } from 'react-native-notifications';
import RNInsider from 'react-native-insider';
import InsiderCallbackType from 'react-native-insider/src/InsiderCallbackType';
import OneSignal from 'react-native-onesignal';
import {
  INSIDER_PARTER_NAME,
  INSIDER_GROUP_BUNDLE_ID,
  ONESIGNAL_APP_ID,
} from './config';

const App: () => React$Node = () => {
  React.useEffect(() => {
    RNInsider.init(
      INSIDER_PARTER_NAME,
      INSIDER_GROUP_BUNDLE_ID,
      (type, data) => {
        switch (type) {
          case InsiderCallbackType.NOTIFICATION_OPEN:
            if (
              data.data &&
              data.data.source &&
              typeof data.data.source === 'string' &&
              data.data.source.toLowerCase() === 'insider'
            ) {
              console.log('[INSIDER][NOTIFICATION_OPEN]: ', data);
              Alert.alert(
                '[INSIDER][NOTIFICATION_OPEN]:',
                JSON.stringify(data),
              );
            }
            break;
          case InsiderCallbackType.INAPP_BUTTON_CLICK:
            console.log('[INSIDER][INAPP_BUTTON_CLICK]: ', data);
            Alert.alert(
              '[INSIDER][INAPP_BUTTON_CLICK]: ',
              JSON.stringify(data),
            );
            break;
          case InsiderCallbackType.TEMP_STORE_PURCHASE:
            console.log('[INSIDER][TEMP_STORE_PURCHASE]: ', data);
            Alert.alert(
              '[INSIDER][TEMP_STORE_PURCHASE]: ',
              JSON.stringify(data),
            );
            break;
          case InsiderCallbackType.TEMP_STORE_ADDED_TO_CART:
            console.log('[INSIDER][TEMP_STORE_ADDED_TO_CART]: ', data);
            Alert.alert(
              '[INSIDER][TEMP_STORE_ADDED_TO_CART]: ',
              JSON.stringify(data),
            );
            break;
          case InsiderCallbackType.TEMP_STORE_CUSTOM_ACTION:
            console.log('[INSIDER][TEMP_STORE_CUSTOM_ACTION]: ', data);
            Alert.alert(
              '[INSIDER][TEMP_STORE_CUSTOM_ACTION]: ',
              JSON.stringify(data),
            );
            break;
        }
      },
    );
    RNInsider.registerWithQuietPermission(false);
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Step One</Text>
              <Text style={styles.sectionDescription}>
                Edit <Text style={styles.highlight}>App.js</Text> to change this
                screen and then come back to see your edits.
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>See Your Changes</Text>
              <Text style={styles.sectionDescription}>
                <ReloadInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Debug</Text>
              <Text style={styles.sectionDescription}>
                <DebugInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Learn More</Text>
              <Text style={styles.sectionDescription}>
                Read the docs to discover what to do next:
              </Text>
            </View>
            <LearnMoreLinks />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

class AppTest extends React.Component {
  constructor() {
    super();
    //this.registerNotificationEvents()
    this.state = {isSubscribed: false, requiresPrivacyConsent: false};
  }

  componentDidMount = () => {

    /* O N E S I G N A L   S E T U P */
    OneSignal.setAppId(ONESIGNAL_APP_ID);
    OneSignal.setLogLevel(6, 0);
    OneSignal.setRequiresUserPrivacyConsent(false);
    OneSignal.promptForPushNotificationsWithUserResponse((response) => {
      //this.OSLog('Prompt response:', response);
      console.log('Prompt response:', response);
    });

    /* O N E S I G N A L  H A N D L E R S */
    OneSignal.setNotificationWillShowInForegroundHandler(
      (notifReceivedEvent) => {
        // this.OSLog(
        //   'OneSignal: notification will show in foreground:',
        //   notifReceivedEvent,
        // );
        console.log(
          'OneSignal: notification will show in foreground:',
          notifReceivedEvent,
        );
        let notif = notifReceivedEvent.getNotification();

        const button1 = {
          text: 'Cancel',
          onPress: () => {
            notifReceivedEvent.complete();
          },
          style: 'cancel',
        };

        const button2 = {
          text: 'Complete',
          onPress: () => {
            notifReceivedEvent.complete(notif);
          },
        };

        Alert.alert('Complete notification?', 'Test', [button1, button2], {
          cancelable: true,
        });
      },
    );
    OneSignal.setNotificationOpenedHandler((notification) => {
      console.log('OneSignal: notification opened:', notification);
      Alert.alert(
        'OneSignal Notification Opened',
        JSON.stringify(notification),
      );
    });
    OneSignal.setInAppMessageClickHandler((event) => {
      console.log('OneSignal IAM clicked:', event);
    });
    OneSignal.addEmailSubscriptionObserver((event) => {
      console.log('OneSignal: email subscription changed: ', event);
    });
    OneSignal.addSubscriptionObserver((event) => {
      console.log('OneSignal: subscription changed:', event);
      this.setState({isSubscribed: event.to.isSubscribed});
    });
    OneSignal.addPermissionObserver((event) => {
      console.log('OneSignal: permission changed:', event);
    });

    // const deviceState = await OneSignal.getDeviceState();
    //
    // this.setState({
    //   isSubscribed: deviceState.isSubscribed,
    // });
  };

  // registerNotificationEvents = () => {
  //   Notifications.registerRemoteNotifications();
  //
  //       Notifications.events().registerRemoteNotificationsRegistered((event: Registered) => {
  //           // TODO: Send the token to my server so it could send back push notifications...
  //           console.log("Device Token Received", event.deviceToken);
  //       });
  //       Notifications.events().registerRemoteNotificationsRegistrationFailed((event: RegistrationError) => {
  //           console.error(event);
  //       });
  //
  //   Notifications.events().registerNotificationReceivedForeground((notification, completion) => {
  //     console.log('Notification Received - Foreground', notification)
  //     // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
  //     completion({ alert: false, sound: false, badge: false })
  //   })
  //
  //   Notifications.events().registerNotificationReceivedBackground((notification, completion) => {
  //     console.log('Notification Received - Background', notification)
  //
  //     // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
  //     completion({ alert: true, sound: true, badge: false })
  //   })
  //
  //   Notifications.getInitialNotification()
  //       .then(notification => {
  //         console.log('Initial notification was:', notification || 'N/A')
  //       })
  //       .catch(err => console.error('getInitialNotifiation() failed', err))
  // }

  render = () => <App />;
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default AppTest;

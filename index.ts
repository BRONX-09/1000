import { AppRegistry } from 'react-native';
import { registerWidgetTaskHandler, registerWidgetConfigurationScreen } from 'react-native-android-widget';
import { widgetTaskHandler } from './widgets/widgetTaskHandler';
import UrgeWidgetConfiguration from './widgets/configure/UrgeWidgetConfiguration';
import 'expo-router/entry';

// Register background task handler for Android widgets
registerWidgetTaskHandler(widgetTaskHandler);

// Register configuration screen natively using the library helper
registerWidgetConfigurationScreen(UrgeWidgetConfiguration);

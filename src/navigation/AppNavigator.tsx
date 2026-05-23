import { NavigationContainer, type LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { colors } from '../theme/colors';
import { CalendarSyncScreen } from '../screens/CalendarSyncScreen';
import { DataBackupScreen } from '../screens/DataBackupScreen';
import { EventEditorScreen } from '../screens/EventEditorScreen';
import { FocusHistoryScreen } from '../screens/FocusHistoryScreen';
import { FocusScreen } from '../screens/FocusScreen';
import { HealthProgressScreen } from '../screens/HealthProgressScreen';
import { HealthTrackerScreen } from '../screens/HealthTrackerScreen';
import { HubHomeScreen } from '../screens/HubHomeScreen';
import { InvestmentAdvisorScreen } from '../screens/InvestmentAdvisorScreen';
import { ProductivityHomeScreen } from '../screens/ProductivityHomeScreen';
import { WealthManagerScreen } from '../screens/WealthManagerScreen';
import { WishlistScreen } from '../screens/WishlistScreen';
import { WidgetCenterScreen } from '../screens/WidgetCenterScreen';
import type { RootStackParamList } from './routes';

const Stack = createNativeStackNavigator<RootStackParamList>();

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['personalhub://'],
  config: {
    screens: {
      Home: 'home',
      Productivity: 'productivity',
      WealthManager: 'finance',
      FinanceWishlist: 'wishlist',
      InvestmentAdvisor: 'investment-advisor',
      HealthTracker: 'health',
      HealthProgress: 'health-progress',
      WidgetCenter: 'widgets',
      DataBackup: 'backup',
      CalendarSync: 'calendar-sync',
      FocusHistory: 'focus-history',
      EventEditor: 'event-editor',
      Focus: 'focus',
    },
  },
};

export function AppNavigator() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerTitleAlign: 'center',
          contentStyle: {
            backgroundColor: colors.background,
          },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="Home" component={HubHomeScreen} options={{ title: 'Personal Hub' }} />
        <Stack.Screen
          name="Productivity"
          component={ProductivityHomeScreen}
          options={{ title: 'ProductivityHub' }}
        />
        <Stack.Screen
          name="WealthManager"
          component={WealthManagerScreen}
          options={{ title: 'WealthManager' }}
        />
        <Stack.Screen
          name="FinanceWishlist"
          component={WishlistScreen}
          options={{ title: 'Wishlist' }}
        />
        <Stack.Screen
          name="InvestmentAdvisor"
          component={InvestmentAdvisorScreen}
          options={{ title: 'Investment Advisor' }}
        />
        <Stack.Screen
          name="HealthTracker"
          component={HealthTrackerScreen}
          options={{ title: 'HealthTracker' }}
        />
        <Stack.Screen
          name="HealthProgress"
          component={HealthProgressScreen}
          options={{ title: 'Progresion' }}
        />
        <Stack.Screen
          name="WidgetCenter"
          component={WidgetCenterScreen}
          options={{ title: 'Widgets' }}
        />
        <Stack.Screen
          name="DataBackup"
          component={DataBackupScreen}
          options={{ title: 'Backup' }}
        />
        <Stack.Screen
          name="EventEditor"
          component={EventEditorScreen}
          options={{ title: 'Evento' }}
        />
        <Stack.Screen
          name="Focus"
          component={FocusScreen}
          options={{ title: 'Enfoque' }}
        />
        <Stack.Screen
          name="FocusHistory"
          component={FocusHistoryScreen}
          options={{ title: 'Historial de foco' }}
        />
        <Stack.Screen
          name="CalendarSync"
          component={CalendarSyncScreen}
          options={{ title: 'Sync Calendar' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

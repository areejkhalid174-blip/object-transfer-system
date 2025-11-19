import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native";
import 'react-native-gesture-handler';
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
// Rider
import Mobile from "./pages/Mobile";
import RiderChat from "./pages/RiderChat";
import RiderHome from "./pages/RiderHome";
import RiderLogin from "./pages/RiderLogin";
import RiderOtp from "./pages/RiderOtp";
import RiderSignup from "./pages/RiderSignup";
import SetMode from "./pages/SetMode";
import Setting from "./pages/Setting";
import SupportingDocuments from "./pages/SupportingDocuments";
import TripDetails from "./pages/TripDetails";
import VehicelInformationr from "./pages/VehicelInformationr";

// Customer
import CustomerBookTrip from "./pages/CustomerBookTrip";
import CustomerChat from "./pages/CustomerChat";
import CustomerHome from "./pages/CustomerHome";
import CustomerLogin from "./pages/CustomerLogin";
import CustomerSignup from "./pages/CustomerSignup";
import DirectChat from "./pages/DirectChat";
import MapSelector from "./pages/MapSelector";
import Notifications from "./pages/Notifications";
import OrderConfirmation from "./pages/OrderConfirmation";
import PackageDetail from "./pages/PackageDetail";
import RatingCustomer from "./pages/RatingCustomer";
import SelectDate from "./pages/SelectDate";
import SplashScreen from "./pages/SplashScreen";
import Vehicle from "./pages/Vehicle";

import RoleSelection from "./pages/select";
import VehicleSelection from "./pages/Vehicle";
import { persistor, store } from "./redux/store";

const Stack = createNativeStackNavigator();

const RiderStack = () => (
  <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ contentStyle: { backgroundColor: "#538cc6" } }}>
    <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
    <Stack.Screen name="RiderSignup" component={RiderSignup} options={{ headerShown: false }} />
    <Stack.Screen name="VehicelInformationr" component={VehicelInformationr} options={{ headerShown: false }} />
    <Stack.Screen name="SetMode" component={SetMode} options={{ headerShown: false }} />
    <Stack.Screen name="RiderHome" component={RiderHome} options={{ headerShown: false }} />
    <Stack.Screen name="Mobile" component={Mobile} />
    <Stack.Screen name="RiderOtp" component={RiderOtp} />
    <Stack.Screen name="SupportingDocuments" component={SupportingDocuments} />
    <Stack.Screen name="Setting" component={Setting} />
    <Stack.Screen name="TripDetails" component={TripDetails} />
    <Stack.Screen name="RiderChat" component={RiderChat} />
    <Stack.Screen name="DirectChat" component={DirectChat} options={{ headerShown: false }} />
    <Stack.Screen name="Notifications" component={Notifications} options={{ headerShown: false }} />

  </Stack.Navigator>
);

const CustomerStack = () => (
  <Stack.Navigator initialRouteName="CustomerHome" screenOptions={{ contentStyle: { backgroundColor: "#538cc6" } }}>
    <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
    {/* <Stack.Screen name="Mobile" component={Mobile} /> */}
    {/* <Stack.Screen name="CustomerOtp" component={CustomerOtp} /> */}
    <Stack.Screen name="CustomerHome" component={CustomerHome} options={{ headerShown: false }} />
    <Stack.Screen name="PackageDetail" component={PackageDetail} options={{ headerShown: false }} />
    <Stack.Screen name="OrderConfirmation" component={OrderConfirmation} options={{ headerShown: false }} />
    <Stack.Screen name="MapSelector" component={MapSelector} options={{ headerShown: false }} />
    <Stack.Screen name="SelectDate" component={SelectDate} />
    <Stack.Screen name="Vehicle" component={Vehicle} />
    <Stack.Screen name="RatingCustomer" component={RatingCustomer} />
    <Stack.Screen name="VehicleSelection" component={VehicleSelection} />
    {/* <Stack.Screen name="select" component={select} /> */}
    <Stack.Screen name="CustomerBookTrip" component={CustomerBookTrip} />
    <Stack.Screen name="CustomerChat" component={CustomerChat} />
    <Stack.Screen name="DirectChat" component={DirectChat} options={{ headerShown: false }} />
    <Stack.Screen name="Notifications" component={Notifications} options={{ headerShown: false }} />

  </Stack.Navigator>
);

const App = () => {
  // Choose stack based on role and authentication
  const RenderStack = () => {
    const userRole = useSelector((state) => state.home.role);
    const user = useSelector((state) => state.home.user);
    const isLoggedIn = user && Object.keys(user).length > 0;

    if (!isLoggedIn) {
      return (
        <Stack.Navigator
          key="auth-stack"
          initialRouteName="CustomerLogin"
          screenOptions={{ contentStyle: { backgroundColor: "#538cc6" } }}
        >
          <Stack.Screen name="CustomerLogin" component={CustomerLogin} options={{ headerShown: false }} />
          <Stack.Screen name="Select" component={RoleSelection} options={{ headerShown: false }} />
          <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
          <Stack.Screen name="CustomerSignup" component={CustomerSignup} options={{ headerShown: false }} />
          <Stack.Screen name="RiderLogin" component={RiderLogin} options={{ headerShown: false }} />
          <Stack.Screen name="RiderSignup" component={RiderSignup} options={{ headerShown: false }} />
          <Stack.Screen name="VehicelInformationr" component={VehicelInformationr} options={{ headerShown: false }} />
          <Stack.Screen name="SetMode" component={SetMode} options={{ headerShown: false }} />
          <Stack.Screen name="RiderHome" component={RiderHome} options={{ headerShown: false }} />
          <Stack.Screen name="CustomerHome" component={CustomerHome} options={{ headerShown: false }} />
          <Stack.Screen name="TripDetails" component={TripDetails} options={{ headerShown: false }} />
          <Stack.Screen name="Setting" component={Setting} options={{ headerShown: false }} />
        <Stack.Screen name="DirectChat" component={DirectChat} options={{ headerShown: false }} />
        </Stack.Navigator>
      );
    }

    switch (userRole) {
      case "Customer":
        return <CustomerStack key="customer-stack" />;
      case "Rider":
        return <RiderStack key="rider-stack" />;
      default:
        return (
          <Stack.Navigator
            key="auth-stack"
            initialRouteName="CustomerLogin"
            screenOptions={{ contentStyle: { backgroundColor: "#538cc6" } }}
          >
            <Stack.Screen name="CustomerLogin" component={CustomerLogin} options={{ headerShown: false }} />
            <Stack.Screen name="Select" component={RoleSelection} options={{ headerShown: false }} />
            <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
            <Stack.Screen name="CustomerSignup" component={CustomerSignup} options={{ headerShown: false }} />
            <Stack.Screen name="RiderLogin" component={RiderLogin} options={{ headerShown: false }} />
            <Stack.Screen name="RiderSignup" component={RiderSignup} options={{ headerShown: false }} />
            <Stack.Screen name="VehicelInformationr" component={VehicelInformationr} options={{ headerShown: false }} />
            <Stack.Screen name="SetMode" component={SetMode} options={{ headerShown: false }} />
            <Stack.Screen name="RiderHome" component={RiderHome} options={{ headerShown: false }} />
            <Stack.Screen name="CustomerHome" component={CustomerHome} options={{ headerShown: false }} />
            <Stack.Screen name="TripDetails" component={TripDetails} options={{ headerShown: false }} />
            <Stack.Screen name="Setting" component={Setting} options={{ headerShown: false }} />
          </Stack.Navigator>
        );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#538cc6" }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <RenderStack />
        </PersistGate>
      </Provider>
    </SafeAreaView>
  );
};

export default App;

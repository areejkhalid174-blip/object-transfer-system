import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
// Rider
import Mobile from "./pages/Mobile";
import Payment2 from "./pages/Payment2";
import RiderChat from "./pages/RiderChat";
import RiderEarning from "./pages/RiderEarning";
import RiderHistory from "./pages/RiderHistory";
import RiderOtp from "./pages/RiderOtp";
import RiderSignup from "./pages/RiderSignup";
import RiderVerification from "./pages/RiderVerification";
import Setting from "./pages/Setting";
import SupportingDocuments from "./pages/SupportingDocuments";
import VehicelInformationr from "./pages/VehicelInformationr";
import RatingRider from "./pages/RatingRider";
import SetMode from "./pages/SetMode";
import RiderHome from "./pages/RiderHome";
import TripDetails from "./pages/TripDetails";

// Customer
import CustomerChat from "./pages/CustomerChat";
import CustomerHome from "./pages/CustomerHome";
import CustomerLogin from "./pages/CustomerLogin";
import CustomerSignup from "./pages/CustomerSignup";
import Payment from "./pages/Payment";
import Picture1 from "./pages/Picture1";
import Picture2 from "./pages/Picture2";
import RatingCustomer from "./pages/RatingCustomer";
import SelectDate from "./pages/SelectDate";
import Vehicle from "./pages/Vehicle";
import CustomerBookTrip from "./pages/CustomerBookTrip";
import SplashScreen from "./pages/SplashScreen";
import PackageDetail from "./pages/PackageDetail";
import TrackOrder from "./pages/TrackOrder";

// Admin
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

import RoleSelection from "./pages/select";
import VehicleSelection from "./pages/Vehicle";
import { persistor, store } from "./redux/store";

const Stack = createNativeStackNavigator();

const RiderStack = () => (
  <Stack.Navigator initialRouteName="RiderHome" screenOptions={{ contentStyle: { backgroundColor: "#538cc6" } }}>
    <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
    <Stack.Screen name="RiderHome" component={RiderHome} options={{ headerShown: false }} />
    <Stack.Screen name="Mobile" component={Mobile} />
    <Stack.Screen name="RiderOtp" component={RiderOtp} />
    <Stack.Screen name="VehicelInformationr" component={VehicelInformationr} />
    <Stack.Screen name="RiderVerification" component={RiderVerification} />
    <Stack.Screen name="SupportingDocuments" component={SupportingDocuments} />
    <Stack.Screen name="RiderHistory" component={RiderHistory} />
    <Stack.Screen name="RiderEarning" component={RiderEarning} />
    <Stack.Screen name="Setting" component={Setting} />
   <Stack.Screen name="RatingRider" component={RatingRider} />
   <Stack.Screen name="SetMode" component={SetMode} />
   <Stack.Screen name="TripDetails" component={TripDetails} />
   <Stack.Screen name="RiderChat" component={RiderChat} />

  </Stack.Navigator>
);

const CustomerStack = () => (
  <Stack.Navigator initialRouteName="CustomerHome" screenOptions={{ contentStyle: { backgroundColor: "#538cc6" } }}>
    <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
    {/* <Stack.Screen name="Mobile" component={Mobile} /> */}
    {/* <Stack.Screen name="CustomerOtp" component={CustomerOtp} /> */}
    <Stack.Screen name="CustomerHome" component={CustomerHome} options={{ headerShown: false }} />
    <Stack.Screen name="PackageDetail" component={PackageDetail} options={{ headerShown: false }} />
    <Stack.Screen name="TrackOrder" component={TrackOrder} options={{ headerShown: false }} />
    <Stack.Screen name="Picture1" component={Picture1} />
    <Stack.Screen name="Picture2" component={Picture2} />
    <Stack.Screen name="Payment" component={Payment} />
    <Stack.Screen name="Payment2" component={Payment2} />
    <Stack.Screen name="SelectDate" component={SelectDate} />
    <Stack.Screen name="Vehicle" component={Vehicle} />
    <Stack.Screen name="RatingCustomer" component={RatingCustomer} />
    <Stack.Screen name="VehicleSelection" component={VehicleSelection} />
    {/* <Stack.Screen name="select" component={select} /> */}
    <Stack.Screen name="CustomerBookTrip" component={CustomerBookTrip} />
    <Stack.Screen name="CustomerChat" component={CustomerChat} />

  </Stack.Navigator>
);

const AdminStack = () => (
  <Stack.Navigator initialRouteName="AdminDashboard" screenOptions={{ contentStyle: { backgroundColor: "#538cc6" } }}>
    <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ headerShown: false }} />
  </Stack.Navigator>
);

const App = () => {
  // Choose stack based on role
  const RenderStack = () => {
    const userRole = useSelector((state) => state.home.role);
    // alert(userRole)

    switch (userRole) {
      case "Customer":
        return <CustomerStack />;
      case "Rider":
        return <RiderStack />;
      case "Admin":
        return <AdminStack />;
      default:
        return (
          <Stack.Navigator initialRouteName="CustomerLogin" screenOptions={{ contentStyle: { backgroundColor: "#538cc6" } }}>
            <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
            <Stack.Screen name="CustomerLogin" component={CustomerLogin} options={{ headerShown: false }} />
            <Stack.Screen name="AdminLogin" component={AdminLogin} options={{ headerShown: false }} />
            <Stack.Screen name="CustomerSignup" component={CustomerSignup} />
            <Stack.Screen name="RiderSignup" component={RiderSignup} />
            <Stack.Screen name="Select" component={RoleSelection} />
            <Stack.Screen name="RiderVerification" component={RiderVerification} />
            <Stack.Screen name="VehicelInformationr" component={VehicelInformationr} />
            <Stack.Screen name="SetMode" component={SetMode} />
            <Stack.Screen name="RiderHome" component={RiderHome} options={{ headerShown: false }} />
            <Stack.Screen name="TripDetails" component={TripDetails} />
            <Stack.Screen name="Setting" component={Setting} />
            <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ headerShown: false }} />
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

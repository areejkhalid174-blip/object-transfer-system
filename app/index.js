import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
// Rider
import HomeRider from "./pages/HomeRider";
import Mobile from "./pages/Mobile";
import Payment2 from "./pages/Payment2";
import RiderChat from "./pages/RiderChat";
import RiderEarning from "./pages/RiderEarning";
import RiderHistory from "./pages/RiderHistory";
import RiderLogin from "./pages/RiderLogin";
import RiderOtp from "./pages/RiderOtp";
import RiderSignup from "./pages/RiderSignup";
import RiderVerification from "./pages/RiderVerification";
import Setting from "./pages/Setting";
import SupportingDocuments from "./pages/SupportingDocuments";
import VehicelInformationr from "./pages/VehicelInformationr";

// Customer
import CustomerChat from "./pages/CustomerChat";
import CustomerHome from "./pages/CustomerHome";
import CustomerLogin from "./pages/CustomerLogin";
import CustomerOtp from "./pages/CustomerOtp";
import CustomerSignup from "./pages/CustomerSignup";
import Order from "./pages/Order";
import PackageDetail from "./pages/PackageDetail";
import Payment from "./pages/Payment";
import Picture1 from "./pages/Picture1";
import Picture2 from "./pages/Picture2";
import RatingCustomer from "./pages/RatingCustomer";
import SelectDate from "./pages/SelectDate";
import Vehicle from "./pages/Vehicle";

import { persistor, store } from "./redux/store";

const Stack = createNativeStackNavigator();

const RiderStack = () => (
  <Stack.Navigator initialRouteName="RiderSignup">
    <Stack.Screen name="Mobile" component={Mobile} />
    <Stack.Screen name="RiderSignup" component={RiderSignup} />
    <Stack.Screen name="RiderLogin" component={RiderLogin} />
    <Stack.Screen name="RiderOtp" component={RiderOtp} />
    <Stack.Screen name="VehicelInformationr" component={VehicelInformationr} />
    <Stack.Screen name="RiderVerification" component={RiderVerification} />
    <Stack.Screen name="SupportingDocuments" component={SupportingDocuments} />
    <Stack.Screen name="RiderHistory" component={RiderHistory} />
    <Stack.Screen name="RiderEarning" component={RiderEarning} />
    <Stack.Screen name="HomeRider" component={HomeRider} />
    <Stack.Screen name="RiderChat" component={RiderChat} />
    <Stack.Screen name="Setting" component={Setting} />
  </Stack.Navigator>
);

const CustomerStack = () => (
  <Stack.Navigator initialRouteName="CustomerSignup">
    <Stack.Screen name="Mobile" component={Mobile} />

    <Stack.Screen name="CustomerSignup" component={CustomerSignup} />
    <Stack.Screen name="CustomerLogin" component={CustomerLogin} />
    <Stack.Screen name="CustomerOtp" component={CustomerOtp} />
    <Stack.Screen name="CustomerHome" component={CustomerHome} />
    <Stack.Screen name="Order" component={Order} />
    <Stack.Screen name="PackageDetail" component={PackageDetail} />
    <Stack.Screen name="Picture1" component={Picture1} />
    <Stack.Screen name="Picture2" component={Picture2} />
    <Stack.Screen name="Payment" component={Payment} />
    <Stack.Screen name="Payment2" component={Payment2} />
    <Stack.Screen name="SelectDate" component={SelectDate} />
    <Stack.Screen name="Vehicle" component={Vehicle} />
    <Stack.Screen name="RatingCustomer" component={RatingCustomer} />
    <Stack.Screen name="CustomerChat" component={CustomerChat} />
  </Stack.Navigator>
);

const App = () => {
  // Choose stack based on role
  const RenderStack = () => {
    const userRole = useSelector((state) => state.home.role);
    switch (userRole) {
      case "Customer":
        return <CustomerStack />;
      case "Rider":
        return <RiderStack />;
      default:
        return (
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={BuyerLogin} />
          </Stack.Navigator>
        );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <PersistGate loading={null} persistor={persistor}>
        <Provider store={store}>
          <RenderStack />
        </Provider>
      </PersistGate>
    </SafeAreaView>
  );
};

export default App;

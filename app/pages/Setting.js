import React, { useState } from "react";
import { View, Text, Switch, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { useDispatch } from "react-redux";
import { CommonActions } from "@react-navigation/native";
import { setRole, setUser } from "../redux/Slices/HomeDataSlice";
import { logout } from "../Helper/firebaseHelper";

export default function Setting({ navigation }) {
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [locationAccess, setLocationAccess] = useState(true);
  const [shareData, setShareData] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Settings & Privacy</Text>

      {/* General Settings */}
      <Text style={styles.sectionTitle}>General Settings</Text>

      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>Update Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>Change Password</Text>
      </TouchableOpacity>

      <View style={styles.optionRow}>
        <Text style={styles.optionText}>Notifications</Text>
        <Switch value={notifications} onValueChange={setNotifications} />
      </View>

      <View style={styles.optionRow}>
        <Text style={styles.optionText}>Dark Mode</Text>
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>

      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>Language</Text>
      </TouchableOpacity>

      {/* Privacy & Security */}
      <Text style={styles.sectionTitle}>Privacy & Security</Text>

      <View style={styles.optionRow}>
        <Text style={styles.optionText}>Allow Location Access</Text>
        <Switch value={locationAccess} onValueChange={setLocationAccess} />
      </View>

      <View style={styles.optionRow}>
        <Text style={styles.optionText}>Share Data for Research</Text>
        <Switch value={shareData} onValueChange={setShareData} />
      </View>

      <TouchableOpacity style={styles.option}>
        <Text style={styles.optionText}>Delete Account</Text>
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity 
        style={styles.logoutBtn}
        onPress={() => {
          Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
              {
                text: "Cancel",
                style: "cancel"
              },
              {
                text: "Logout",
                style: "destructive",
                onPress: async () => {
                  try {
                    // Logout from Firebase
                    await logout();
                    // Clear Redux state
                    dispatch(setRole(""));
                    dispatch(setUser({}));
                    
                    // Reset navigation stack to login screen
                    navigation.dispatch(
                      CommonActions.reset({
                        index: 0,
                        routes: [{ name: "CustomerLogin" }],
                      })
                    );
                  } catch (error) {
                    console.error("Logout error:", error);
                    // Still clear the state even if Firebase logout fails
                    dispatch(setRole(""));
                    dispatch(setUser({}));
                    
                    // Reset navigation stack to login screen
                    navigation.dispatch(
                      CommonActions.reset({
                        index: 0,
                        routes: [{ name: "CustomerLogin" }],
                      })
                    );
                  }
                }
              }
            ]
          );
        }}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#538cc6", padding: 15 },
  heading: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginVertical: 10, color: "gray" },
  option: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#eee" },
  optionText: { fontSize: 16 },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  historyBtn: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  historyText: { color: "#000000", fontSize: 16, fontWeight: "bold" },
  logoutBtn: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  logoutText: { color: "#000000", fontSize: 16, fontWeight: "bold" },
});

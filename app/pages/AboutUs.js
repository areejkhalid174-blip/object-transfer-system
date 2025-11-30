import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AboutUs({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.content, { paddingTop: Math.max(insets.top, 20) }]}>
        {/* Header */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#2c5aa0" />
        </TouchableOpacity>

        <Text style={styles.pageTitle}>About Us</Text>

        {/* App Logo/Icon Section */}
        <View style={styles.logoSection}>
          <View style={styles.logoContainer}>
            <Ionicons name="cube-outline" size={64} color="#2c5aa0" />
          </View>
          <Text style={styles.appName}>Object Transfer System</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Our Service</Text>
          <Text style={styles.sectionText}>
            Object Transfer System (OTS) is a comprehensive delivery and logistics
            platform designed to connect customers with reliable riders for seamless
            package delivery services. Our mission is to provide fast, secure, and
            convenient delivery solutions for individuals and businesses.
          </Text>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Features</Text>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.featureText}>
              Fast and reliable package delivery
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.featureText}>
              Real-time tracking of your orders
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.featureText}>
              Multiple vehicle options (Car, Bike, Van, Cycle)
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.featureText}>
              Secure payment processing
            </Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <Text style={styles.featureText}>
              24/7 customer support
            </Text>
          </View>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <View style={styles.contactItem}>
            <Ionicons name="mail-outline" size={20} color="#2c5aa0" />
            <Text style={styles.contactText}>support@objecttransfer.com</Text>
          </View>
          <View style={styles.contactItem}>
            <Ionicons name="call-outline" size={20} color="#2c5aa0" />
            <Text style={styles.contactText}>+1 (555) 123-4567</Text>
          </View>
          <View style={styles.contactItem}>
            <Ionicons name="location-outline" size={20} color="#2c5aa0" />
            <Text style={styles.contactText}>
              123 Delivery Street, City, State 12345
            </Text>
          </View>
        </View>

        {/* Company Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Company Information</Text>
          <Text style={styles.sectionText}>
            Object Transfer System was founded with the vision of revolutionizing
            the delivery industry. We are committed to providing exceptional service
            and ensuring customer satisfaction with every delivery.
          </Text>
          <Text style={styles.sectionText}>
            Our team consists of experienced professionals dedicated to making
            package delivery simple, fast, and reliable for everyone.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2024 Object Transfer System. All rights reserved.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f3f8",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1c1b1f",
    marginBottom: 30,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 40,
    paddingVertical: 30,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  appName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2c5aa0",
    marginBottom: 8,
  },
  appVersion: {
    fontSize: 16,
    color: "#666",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1c1b1f",
    marginBottom: 15,
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 24,
    color: "#666",
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureText: {
    fontSize: 15,
    color: "#333",
    marginLeft: 12,
    flex: 1,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  contactText: {
    fontSize: 15,
    color: "#333",
    marginLeft: 12,
    flex: 1,
  },
  footer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
});


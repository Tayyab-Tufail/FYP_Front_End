import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';

const TermsAndConditionsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Terms and Conditions</Text>
      <Text style={styles.text}>
        Welcome to the Asan Mazdoor App. By accessing or using our mobile application, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree with any part of these terms, you should discontinue use of our application immediately.

        {'\n\n'}**User Account and Responsibilities**
        {'\n'}1. Account Creation: Users must provide accurate and complete information when creating their account. You are responsible for maintaining the confidentiality of your account and password and for restricting access to your mobile device.
        {'\n'}2. Account Use: You are solely responsible for all activities that occur under your account. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.

        {'\n\n'}**Prohibited Conduct**
        {'\n'}You agree not to use the app in any way that:
        {'\n'}- Violates any national, regional, or international law or regulation.
        {'\n'}- Is fraudulent, unlawful, or deceptive.
        {'\n'}- Harms or exploits minors in any way.
        {'\n'}- Transmits or procures the sending of any advertising or promotional material without our prior written consent.
        {'\n'}- Attempts to disrupt the operation of our service through any form of cyber attack or harmful code.

        {'\n\n'}**Intellectual Property Rights**
        {'\n'}The content, arrangement, and layout of this app, including texts, graphics, images, logos, and software, are the property of the Asan Mazdoor App team and are protected by copyright and intellectual property rights laws. You may not reproduce, distribute, modify, or create derivative works without express written permission from us.

        {'\n\n'}**User Content**
        {'\n'}1. Rights to User Content: You retain all rights to any content you submit, post, or display on or through the app.
        {'\n'}2. License to Use: By submitting user content, you grant the Asan Mazdoor App a non-exclusive, royalty-free license to use, reproduce, adapt, publish, and distribute your content in any existing or future media.
        {'\n'}3. Accuracy of Content: You represent and warrant that you own or control all rights to the content and that public posting and use of your content will not infringe or violate the rights of any third party.

        {'\n\n'}**Disclaimer of Warranties**
        {'\n'}You understand and agree that your use of the Asan Mazdoor App is at your sole risk. The app is provided on an "AS IS" and "AS AVAILABLE" basis. We expressly disclaim all warranties of any kind, whether express or implied, including, but not limited to, the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.

        {'\n\n'}**Limitation of Liability**
        {'\n'}The Asan Mazdoor App shall not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages, including but not limited to, damages for loss of profits, goodwill, use, data, or other intangible losses resulting from the use of or inability to use the service.

        {'\n\n'}**Changes to Terms**
        {'\n'}We reserve the right to modify these terms at any time. We will always post the most current version on our app. By continuing to use the app after we post any changes, you accept the updated terms and conditions.

        {'\n\n'}**Contact Us**
        {'\n'}If you have any questions about these Terms and Conditions, please contact us at [your contact information].
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default TermsAndConditionsScreen;

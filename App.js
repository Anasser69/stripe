import React, { useState } from "react";
import { View, Text, Button, TextInput, Alert } from "react-native";
import {
  StripeProvider,
  CardField,
  useStripe,
  ApplePay,
} from "@stripe/stripe-react-native";
import PaymentScreen from "./components/PaymentScreen";
import Apple from "./components/Apple"

const App = () => {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("usd");
  const [clientSecret, setClientSecret] = useState("");
  const { createPaymentMethod, confirmPayment } = useStripe();
  const [cardDetails, setCardDetails] = useState({});
  const [isCardComplete, setIsCardComplete] = useState(false);

  const handleCreatePaymentIntent = async () => {
    try {
      const response = await fetch(
        "http://192.168.1.6:3000/create-payment-intent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount, currency }),
        }
      );
      const { clientSecret } = await response.json();
      setClientSecret(clientSecret);
    } catch (error) {
      console.error("Error creating payment intent:", error);
    }
  };

  const handlePay = async () => {
    if (!isCardComplete) {
      Alert.alert("Error", "Card details are not complete.");
      return;
    }

    try {
      const { error } = await confirmPayment(clientSecret, {
        type: "Card",
        paymentMethodType: "Card", // Ensure this is provided
        billingDetails: {
          /* Add billing details if needed */
        },
      });

      if (paymentMethodError) {
        console.error("Error creating payment method:", paymentMethodError);
        return;
      }

      const { paymentIntent, error: confirmError } = await confirmPayment(
        clientSecret,
        {
          payment_method: paymentMethod.id,
        }
      );

      if (confirmError) {
        console.error("Error confirming payment:", confirmError);
        return;
      }

      Alert.alert("Success", "Payment successful!");
      console.log(paymentIntent);
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  return (
    <StripeProvider
      publishableKey="pk_test_51PVaGqITNJ9MM2uDYXT2FdBdw4XwcwuMWDWeZITuCBVA5MtPYFijlBoX4mBHRYdoZGlTuyMVxDcyx8y1T3kAGyly00Pu6m6LMh"
      // merchantIdentifier="MERCHANT_ID" // put ur apple merchant
    >
      <View style={{ padding: 20 }}>
        {/* <Text>Enter amount:</Text>
        <TextInput
          value={amount}
          onChangeText={(text) => setAmount(text)}
          keyboardType="numeric"
          style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
        />
        <Text>Enter currency:</Text>
        <TextInput
          value={currency}
          onChangeText={(text) => setCurrency(text)}
          style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
        />
        <Button title="Create payment intent" onPress={handleCreatePaymentIntent} />
        {clientSecret && (
          <>
            <CardField
              postalCodeEnabled={true}
              placeholders={{
                number: "4242 4242 4242 4242",
                expMonth: "12",
                expYear: "2025",
                cvc: "123",
              }}
              onCardChange={(cardDetails) => {
                setCardDetails(cardDetails);
                setIsCardComplete(cardDetails.complete);
              }}
              style={{
                width: '100%',
                height: 50,
                marginVertical: 30,
              }}
            />
            <Button title="Pay" onPress={handlePay} />
          </>
        )} */}
        <PaymentScreen />
        {/* <Apple /> */}
      </View>
    </StripeProvider>
  );
};

export default App;

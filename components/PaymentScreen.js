import React, { useState } from "react";
import { View, Button, TextInput } from "react-native";
import { CardField, useStripe } from "@stripe/stripe-react-native";

const PaymentScreen = () => {
  const { confirmPayment } = useStripe();
  const [cardDetails, setCardDetails] = useState(null);
  const [amount, setAmount] = useState("");

  const handlePayPress = async () => {
    const response = await fetch(
      "http://192.168.1.6:3000/create-payment-intent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: parseInt(amount, 10), currency: "usd" }),
      }
    );
    const { clientSecret } = await response.json();

    const { error, paymentIntent } = await confirmPayment(clientSecret, {
      type: 'Card',
      paymentMethodType: 'Card', // Ensure this is provided
      billingDetails: { /* Add billing details if needed */ },
    });

    if (error) {
      console.log("Payment confirmation error", error);
    } else if (paymentIntent) {
      console.log("Payment successful", paymentIntent);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Amount"
        keyboardType="numeric"
        onChangeText={setAmount}
        value={amount}
      />
      <CardField
        postalCodeEnabled={false}
        placeholders={{ number: "4242 4242 4242 4242" }}
        cardStyle={{ backgroundColor: "#FFFFFF" }}
        style={{ width: "100%", height: 50, marginVertical: 30 }}
        onCardChange={(cardDetails) => setCardDetails(cardDetails)}
      />
      <Button onPress={handlePayPress} title="Pay" />
    </View>
  );
};

export default PaymentScreen;

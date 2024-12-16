// src/stripe.js
import { StripeProvider } from "@stripe/stripe-react-native";
import React from "react";

const StripeAppProvider = ({ children }) => {
  return (
    <StripeProvider publishableKey="pk_test_51Q5jPZP45OENxNyqf92Pbhtt20O39uderEQGTq2N6Jv048WEPVZg0LKNA7hgfVsPX2oIuiIep5blGFScKiOk65tq00dGon4JHA">
      {children}
    </StripeProvider>
  );
};

export default StripeAppProvider;

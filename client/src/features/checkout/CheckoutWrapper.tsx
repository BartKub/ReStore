import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutPage from "./CheckoutPage";

const stripePromise = loadStripe("pk_test_51LcrvnD5FwuJtRBkJ4WnB9xLd2JcPmcnb3BXMVgdfY174AS7K3eREiwt2cc8pjun3BSzymQiVsQIgFPy2ASFqozZ00iOf82GCI");

export default function CheckoutWrapper(){
    return (
        <Elements stripe={stripePromise}>
            <CheckoutPage></CheckoutPage>
        </Elements>
    )
}
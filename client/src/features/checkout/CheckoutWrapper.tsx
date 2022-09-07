import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState, useEffect } from "react";
import agent from "../../app/api/agent";
import Loading from "../../app/layout/Loading";
import { useAppDispatch } from "../../app/store/configureStore";
import { setBasket } from "../basket/basketSlice";
import CheckoutPage from "./CheckoutPage";

const stripePromise = loadStripe("pk_test_51LcrvnD5FwuJtRBkJ4WnB9xLd2JcPmcnb3BXMVgdfY174AS7K3eREiwt2cc8pjun3BSzymQiVsQIgFPy2ASFqozZ00iOf82GCI");

export default function CheckoutWrapper(){
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        agent.Payments.createPaymentIntent()
        .then(response => dispatch(setBasket(response)))
        .catch(err => console.log(err))
        .finally(() => setLoading(false));
    }, [dispatch]);

    if(loading) return <Loading message="loading"></Loading>

    return (
        <Elements stripe={stripePromise}>
            <CheckoutPage></CheckoutPage>
        </Elements>
    )
}
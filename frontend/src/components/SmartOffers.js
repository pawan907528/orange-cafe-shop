import { API_URL } from "../config";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SmartOffers.css";

export default function SmartOffers() {

    const navigate = useNavigate();

    const [offer, setOffer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ==========================================
    // Load Personalized Offer
    // ==========================================

    useEffect(() => {

        const storedUser =
            JSON.parse(localStorage.getItem("user"));

        // Check login
        if (!storedUser || !storedUser.email) {

            setError("Please login to see your personalized offer.");

            setLoading(false);

            return;
        }

        const loadOffer = async () => {

            try {

                const response = await axios.get(

                    `${API_URL}/personalized-offer/${encodeURIComponent(
                        storedUser.email
                    )}`

                );

                console.log(
                    "Personalized Offer:",
                    response.data
                );

                setOffer(response.data);

                setError("");

            } catch (err) {

                console.error(
                    "Personalized Offer Error:",
                    err
                );

                setError(
                    "Unable to load personalized offer."
                );

            } finally {

                setLoading(false);

            }

        };

        loadOffer();

    }, []);


    // ==========================================
    // Loading
    // ==========================================

    if (loading) {

        return (

            <div className="smart-offers">

                <div className="offer-loading">

                    ✨ Finding the best offer for you...

                </div>

            </div>

        );

    }


    // ==========================================
    // Error
    // ==========================================

    if (error) {

        return (

            <div className="smart-offers">

                <div className="offer-error">

                    ❌ {error}

                </div>

            </div>

        );

    }


    // ==========================================
    // No Offer
    // ==========================================

    if (!offer) {

        return null;

    }


    // ==========================================
    // Go To Menu
    // ==========================================

    const handleOrderNow = () => {

        navigate("/menu");

    };


    // ==========================================
    // UI
    // ==========================================

    return (

        <section className="smart-offers">

            <div className="smart-offer-card">

                <div className="offer-icon">

                    🎁

                </div>


                <div className="offer-content">

                    <span className="offer-label">

                        ✨ PERSONALIZED FOR YOU

                    </span>

                    <h2>

                        {offer.title}

                    </h2>

                    <p>

                        {offer.message}

                    </p>


                    {/* Discount */}

                    {offer.discount > 0 && (

                        <div className="discount-badge">

                            {typeof offer.discount === "number"
                                ? offer.discount >= 100
                                    ? `₹${offer.discount} OFF`
                                    : `${offer.discount}% OFF`
                                : offer.discount}

                        </div>

                    )}


                    {/* Category */}

                    {offer.category &&
                        offer.category !== "All" && (

                        <div className="offer-category">

                            ☕ Recommended Category:
                            {" "}
                            <strong>
                                {offer.category}
                            </strong>

                        </div>

                    )}


                    <button
                        className="offer-order-btn"
                        onClick={handleOrderNow}
                    >

                        🛒 Order Now

                    </button>

                </div>

            </div>

        </section>

    );

}

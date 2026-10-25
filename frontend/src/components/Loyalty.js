import { API_URL } from "../config";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Loyalty.css";

export default function Loyalty() {

    const [points, setPoints] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ==========================
    // Load Reward Points
    // ==========================

    useEffect(() => {

        const storedUser =
            JSON.parse(localStorage.getItem("user"));

        if (!storedUser || !storedUser.email) {

            setError("Please login first.");
            setLoading(false);

            return;
        }

        const email = storedUser.email;

        const loadPoints = async () => {

            try {

                const response = await axios.get(
                    `${API_URL}/reward/${encodeURIComponent(email)}`
                );

                console.log(
                    "Reward API Response:",
                    response.data
                );

                setPoints(
                    response.data.reward_points || 0
                );

                setError("");

            } catch (err) {

                console.error(
                    "Reward Points Error:",
                    err
                );

                setError(
                    "Unable to load reward points."
                );

            } finally {

                setLoading(false);

            }
        };

        loadPoints();

    }, []);


    // ==========================
    // Loading
    // ==========================

    if (loading) {

        return (
            <section className="loyalty-page">

                <div className="loyalty-card">

                    <h1>
                        🎁 Orange Cafe Rewards
                    </h1>

                    <p>
                        Loading your reward points...
                    </p>

                </div>

            </section>
        );
    }


    // ==========================
    // UI
    // ==========================

    return (

        <section className="loyalty-page">

            <div className="loyalty-card">

                <h1>
                    🎁 Orange Cafe Rewards
                </h1>

                <p>
                    Earn points every time you order!
                </p>

                {error && (

                    <div className="error-box">
                        ❌ {error}
                    </div>

                )}

                {!error && (

                    <>

                        <div className="points-box">

                            <span>⭐</span>

                            <h2>
                                {points}
                            </h2>

                            <p>
                                Reward Points
                            </p>

                        </div>

                        <p className="earning-info">

                            💰 Earn <strong>1 point</strong>
                            {" "}for every ₹100 spent.

                        </p>

                        <h2>
                            🎁 Redeem Your Rewards
                        </h2>

                        <div className="reward-grid">

                            <div className="reward-card">

                                <h3>
                                    ☕ Free Coffee
                                </h3>

                                <p>
                                    Get one free coffee
                                    from our menu.
                                </p>

                                <strong>
                                    5 Points
                                </strong>

                                <button
                                    disabled={points < 5}
                                >
                                    {points >= 5
                                        ? "Redeem"
                                        : "Need 5 Points"}
                                </button>

                            </div>


                            <div className="reward-card">

                                <h3>
                                    🍰 Free Dessert
                                </h3>

                                <p>
                                    Enjoy a delicious
                                    cafe dessert.
                                </p>

                                <strong>
                                    10 Points
                                </strong>

                                <button
                                    disabled={points < 10}
                                >
                                    {points >= 10
                                        ? "Redeem"
                                        : "Need 10 Points"}
                                </button>

                            </div>


                            <div className="reward-card">

                                <h3>
                                    🎉 ₹100 Discount
                                </h3>

                                <p>
                                    Get ₹100 off your
                                    next order.
                                </p>

                                <strong>
                                    20 Points
                                </strong>

                                <button
                                    disabled={points < 20}
                                >
                                    {points >= 20
                                        ? "Redeem"
                                        : "Need 20 Points"}
                                </button>

                            </div>

                        </div>

                    </>

                )}

            </div>

        </section>

    );
}

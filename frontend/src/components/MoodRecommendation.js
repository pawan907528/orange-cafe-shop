import { API_URL } from "../config";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MoodRecommendation.css";


import espresso from "../images/espresso.jpg";
import cappuccino from "../images/cappuccino.jpg";
import latte from "../images/latte.jpg";
import mocha from "../images/mocha.jpg";
import coldcoffee from "../images/coldcoffee.jpg";
import greentea from "../images/greentea.jpg";
import masalatea from "../images/masalatea.jpg";
import hotchocolate from "../images/hotchocolate.jpg";
import mangomilkshake from "../images/mangomilkshake.jpg";
import chocolatemilkshake from "../images/chocolatemilkshake.jpg";
import vegburger from "../images/vegburger.jpg";
import cheeseburger from "../images/cheeseburger.jpg";
import fries from "../images/fries.jpg";
import garlicbread from "../images/garlicbread.jpg";
import vegsandwich from "../images/vegsandwich.jpg";
import grilledsandwich from "../images/grilledsandwich.jpg";
import margherita from "../images/margherita.jpg";
import farmhouse from "../images/farmhouse.jpg";
import brownie from "../images/brownie.jpg";
import cheesecake from "../images/cheesecake.jpg";

const imageMap = {

  Espresso: espresso,
  Cappuccino: cappuccino,
  Latte: latte,
  Mocha: mocha,

  "Cold Coffee": coldcoffee,

  "Green Tea": greentea,
  "Masala Tea": masalatea,

  "Hot Chocolate": hotchocolate,
  "Mango Milkshake": mangomilkshake,
  "Chocolate Milkshake": chocolatemilkshake,

  "Veg Burger": vegburger,
  "Cheese Burger": cheeseburger,
  "French Fries": fries,
  "Garlic Bread": garlicbread,
  "Veg Sandwich": vegsandwich,
  "Grilled Sandwich": grilledsandwich,

  "Margherita Pizza": margherita,
  "Farmhouse Pizza": farmhouse,

  "Chocolate Brownie": brownie,
  "Blueberry Cheesecake": cheesecake

};

export default function MoodRecommendation() {

    const [mood, setMood] = useState("");
    const navigate = useNavigate();

    const [recommendations, setRecommendations] = useState([]);

    const [loading, setLoading] = useState(false);

    // ==========================
    // Get Recommendation
    // ==========================

    const getRecommendation = async (selectedMood) => {

        setMood(selectedMood);

        setLoading(true);

        try {

            const response = await axios.get(

                `${API_URL}/recommend/${selectedMood}`

            );

            setRecommendations(response.data);

        }

        catch (error) {

            console.error(error);

            setRecommendations([]);

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="mood-container">

            <h2>😊 How are you feeling today?</h2>


            <p>

                Select your mood and we'll recommend the perfect food & drinks.

            </p>

            {/* Mood Buttons */}

            <div className="mood-buttons">

                <button onClick={() => getRecommendation("happy")}>

                    😊 Happy

                </button>

                <button onClick={() => getRecommendation("sad")}>

                    😔 Sad

                </button>

                <button onClick={() => getRecommendation("sleepy")}>

                    😴 Sleepy

                </button>

                <button onClick={() => getRecommendation("energetic")}>

                    💪 Energetic

                </button>

                <button onClick={() => getRecommendation("romantic")}>

                    ❤️ Romantic

                </button>

            </div>

            {/* Loading */}

            {loading && (

                <h3>Finding the best recommendation...</h3>

            )}

            {/* Recommendations */}

            {!loading && recommendations.length > 0 && (

    <div className="recommendation-box">

        <h3>
            🎯 Recommended For You
        </h3>

        <div className="recommend-grid">

            {recommendations.map((item, index) => (

                <div
                    key={index}
                    className="recommend-card"
                >

                    <img
    src={imageMap[item.name]}
    alt={item.name}
    className="recommend-image"
/>

                    <h4>{item.name}</h4>

                    <p>{item.category}</p>

                    <h3 className="recommend-price">
                        ₹ Special
                    </h3>

                   <button
    className="recommend-btn"
    onClick={() => navigate("/menu")}
>
    🛒 View Menu
</button>

                    <p>Current Mood: {mood}</p>

                </div>

            ))}

        </div>

    </div>

)}
        </div>

    );

}

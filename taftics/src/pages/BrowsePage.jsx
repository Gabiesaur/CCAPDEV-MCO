import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import RatingFilter from "../components/browse/RatingFilter";
import EstablishmentCard from "../components/browse/EstablishmentCard";

// ❌ REMOVED: import { ESTABLISHMENTS } from "../data/mockData";

const categories = [
  "Any",
  "School Supplies",
  "Laundry",
  "Groceries",
  "Dorms/Condos",
  "Repairs",
  "Printing",
  "Fitness",
  "Food",
  "Coffee",
];

const parseTimeToMinutes = (timeLabel) => {
  if (!timeLabel) return null;

  const normalized = String(timeLabel).trim().toUpperCase();
  const match = normalized.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3];

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    minutes < 0 ||
    minutes > 59 ||
    hours < 1 ||
    hours > 12
  ) {
    return null;
  }

  if (hours === 12) hours = 0;
  if (period === "PM") hours += 12;

  return hours * 60 + minutes;
};

const getHoursState = (businessHours) => {
  if (!businessHours) return { isOpenNow: false, is24x7: false };

  const normalized = String(businessHours).trim();
  if (normalized.toLowerCase() === "24/7") {
    return { isOpenNow: true, is24x7: true };
  }

  const parts = normalized.split("-").map((part) => part.trim());
  if (parts.length !== 2) return { isOpenNow: false, is24x7: false };

  const openMinutes = parseTimeToMinutes(parts[0]);
  const closeMinutes = parseTimeToMinutes(parts[1]);
  if (openMinutes == null || closeMinutes == null)
    return { isOpenNow: false, is24x7: false };

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  let isOpenNow = false;
  if (openMinutes === closeMinutes) {
    isOpenNow = true;
  } else if (openMinutes < closeMinutes) {
    isOpenNow = currentMinutes >= openMinutes && currentMinutes < closeMinutes;
  } else {
    // Overnight schedule (e.g., 8:00 PM - 5:00 AM)
    isOpenNow = currentMinutes >= openMinutes || currentMinutes < closeMinutes;
  }

  return { isOpenNow, is24x7: false };
};

const BrowsePage = () => {
  const location = useLocation();

  // 1. Initialize states for each filter group
  const selectedCategoryFromState = location.state?.selectedCategory;
  const selectedSearchFromState = location.state?.searchQuery;
  const initialCategory = categories.includes(selectedCategoryFromState)
    ? selectedCategoryFromState
    : "Any";
  const initialSearchQuery =
    typeof selectedSearchFromState === "string" ? selectedSearchFromState : "";

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeHour, setActiveHour] = useState("Any");
  const [activePrice, setActivePrice] = useState("Any");
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [minimumRating, setMinimumRating] = useState(0);

  // 2. NEW: State to hold the fetched establishments
  const [establishments, setEstablishments] = useState([]);
  const [loading, setLoading] = useState(true);

  const hours = ["Any", "Open Now", "24/7"];
  const prices = ["Any", "P", "PP", "PPP"];

  useEffect(() => {
    if (categories.includes(selectedCategoryFromState)) {
      setActiveCategory(selectedCategoryFromState);
    }
  }, [selectedCategoryFromState, categories]);

  useEffect(() => {
    if (typeof selectedSearchFromState === "string") {
      setSearchQuery(selectedSearchFromState);
    }
  }, [selectedSearchFromState]);

  // 3. NEW: Fetch establishments from the database on component mount
  useEffect(() => {
    fetch("http://localhost:3000/api/establishments")
      .then((res) => res.json())
      .then((data) => {
        setEstablishments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch establishments:", err);
        setLoading(false);
      });
  }, []);

  // Filter establishments based on active filters, search query, AND the live database state
  const filteredEstablishments = establishments.filter((est) => {
    // Category filter
    if (activeCategory !== "Any" && est.category !== activeCategory)
      return false;

    // Minimum rating filter
    if (minimumRating > 0 && Number(est.rating || 0) < minimumRating)
      return false;

    // Hours filter
    const hoursState = getHoursState(est.businessHours);
    if (activeHour === "Open Now" && !hoursState.isOpenNow) return false;
    if (activeHour === "24/7" && !hoursState.is24x7) return false;

    // Search query filter
    if (
      searchQuery &&
      !est.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;

    return true; // Pass if all active filters match
  });

  return (
    <div className="bg-white min-vh-100">
      <div className="container-fluid px-5">
        <div className="row">
          {/* LEFT SIDEBAR: User Info & Filters */}
          <aside className="col-lg-3 pe-lg-5" style={{ paddingTop: "48px" }}>
            <div
              className="sticky-top"
              style={{
                top: "128px",
                alignSelf: "start",
                height: "fit-content",
              }}
            >
              <h1 className="fs-3 fw-semibold">Search Filters</h1>
              <h2 className="fs-6 text-dlsu-primary fw-semibold pb-4">
                {loading
                  ? "Loading results..."
                  : `${filteredEstablishments.length} result${filteredEstablishments.length === 1 ? "" : "s"}`}
              </h2>
              {/* Categories Filter */}
              <div className="filter-section mb-4">
                <label className="small opacity-50 fw-bold mb-2 text-uppercase d-block">
                  Categories
                </label>
                <div className="d-flex flex-wrap gap-2">
                  {categories.map((item) => (
                    <button
                      key={item}
                      onClick={() => setActiveCategory(item)} // Updates state on click
                      className={`btn rounded-pill btn-sm px-3 fw-semibold transition-all ${
                        activeCategory === item
                          ? "btn-success border-0 shadow-sm"
                          : "btn-outline-dark border-dark opacity-50"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <RatingFilter
                selectedRating={minimumRating}
                onChange={setMinimumRating}
              />

              {/* Hours Filter */}
              <div className="filter-section mb-4">
                <label className="small opacity-50 fw-bold mb-2 text-uppercase d-block">
                  Hours
                </label>
                <div className="d-flex gap-2">
                  {hours.map((item) => (
                    <button
                      key={item}
                      onClick={() => setActiveHour(item)}
                      className={`btn rounded-pill btn-sm px-3 fw-semibold transition-all ${
                        activeHour === item
                          ? "btn-success border-0 shadow-sm"
                          : "btn-outline-dark border-dark opacity-50"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT: Search & Results */}
          <main className="col-lg-9" style={{ paddingTop: "20px" }}>
            {/* Establishment Cards Container */}
            <div
              style={{
                paddingTop: "24px",
                paddingBottom: "80px",
                width: "720px",
                minHeight: "100vh",
              }}
            >
              {loading ? (
                <div className="text-center py-5">
                  <p className="text-muted fs-5">Loading establishments...</p>
                </div>
              ) : filteredEstablishments.length > 0 ? (
                filteredEstablishments.map((store) => (
                  <EstablishmentCard
                    key={store._id} // ✅ CHANGED: MongoDB uses _id
                    id={store._id} // ✅ CHANGED: Passing the MongoDB ID to the card
                    establishment={store}
                    name={store.name}
                    category={store.category}
                    location={store.location}
                    rating={store.rating}
                    reviewCount={store.reviewCount}
                    image={store.image}
                  />
                ))
              ) : (
                <div className="text-center py-5">
                  <p className="text-muted fs-5">
                    No establishments found matching your criteria.
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default BrowsePage;

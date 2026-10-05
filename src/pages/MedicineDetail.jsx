import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";

const RESULTS_KEY = "medicine-search-results";
const NOT_AVAILABLE = "N/A";

function getFirstValue(value) {
  if (Array.isArray(value)) return value[0] || NOT_AVAILABLE;
  return value || NOT_AVAILABLE;
}

function getDisplayValue(value) {
  if (!Array.isArray(value)) return value || NOT_AVAILABLE;

  const values = value.filter(Boolean);
  return values.length ? values.join(", ") : NOT_AVAILABLE;
}

const detailFields = [
  ["generic_name", "Generic name"],
  ["manufacturer_name", "Manufacturer"],
  ["product_type", "Product type"],
  ["route", "Route"],
  ["dosage_form", "Dosage form"],
  ["substance_name", "Substance"],
  ["application_number", "Application number"],
  ["package_ndc", "Package NDC"],
  ["product_ndc", "Product NDC"],
];

function getInitialMedicine(location, index) {
  if (location.state?.medicine) return location.state.medicine;

  const savedResults = JSON.parse(sessionStorage.getItem(RESULTS_KEY) || "[]");
  return savedResults[Number(index)] || null;
}

function MedicineDetail() {
  const { index } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [medicine] = useState(() => getInitialMedicine(location, index));

  useEffect(() => {
    if (!medicine) return;

    document.title = `${getFirstValue(medicine.openfda?.brand_name)} | MeddiBuddy`;
  }, [medicine]);

  if (!medicine) {
    return (
      <main className="detail-page">
        <Link className="back-link" to="/">
          ← Back to search
        </Link>
        <ErrorMessage message="This medicine could not be loaded. Please search again." />
      </main>
    );
  }

  const openFda = medicine.openfda || {};
  const brandName = getFirstValue(openFda.brand_name);

  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand" to="/" aria-label="MeddiBuddy home">
          <span>MeddiBuddy</span>
        </Link>
      </header>
      <main className="detail-page">
        <button
          className="back-link"
          type="button"
          onClick={() => navigate(-1)}
        >
          ← Back to results
        </button>
        <section className="detail-hero">
          <span className="section-label">Medicine details</span>
          <h1>{brandName}</h1>
          <p>{getFirstValue(openFda.generic_name)}</p>
        </section>
        <section className="detail-card">
          <h2>Product information</h2>
          <div className="detail-grid">
            {detailFields.map(([key, label]) => (
              <div className="detail-item" key={key}>
                <span className="detail-label">{label}</span>
                <span className="detail-value">
                  {getDisplayValue(openFda[key])}
                </span>
              </div>
            ))}
          </div>
          {Object.entries(medicine)
            .filter(([key]) => key !== "openfda" && key !== "id")
            .map(([key, value]) => (
              <div className="long-detail" key={key}>
                <span className="detail-label">{key.replaceAll("_", " ")}</span>
                <p>{Array.isArray(value) ? value.join(" ") : value}</p>
              </div>
            ))}
        </section>
        <p className="detail-id">
          Record: {getFirstValue(openFda.application_number)}
        </p>
      </main>
    </div>
  );
}

export default MedicineDetail;

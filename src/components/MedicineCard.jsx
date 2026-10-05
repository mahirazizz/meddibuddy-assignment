import { Link } from "react-router-dom";

const getFirstValue = (value) => {
  if (!Array.isArray(value)) return value || "N/A";
  return value[0] || "N/A";
};

function MedicineCard({ medicine, index }) {
  const openFda = medicine.openfda || {};
  const brandName = getFirstValue(openFda.brand_name);
  const applicationNumber = getFirstValue(openFda.application_number);

  return (
    <Link
      className="medicine-card"
      to={`/medicine/${index}`}
      state={{ medicine }}
    >
      <div className="medicine-card-header">
        <div>
          <h3>{brandName}</h3>
          <p className="medicine-subtitle">
            {getFirstValue(openFda.generic_name)}
          </p>
        </div>
        <span className="category-tag">
          {getFirstValue(openFda.product_type)}
        </span>
      </div>
      <div className="medicine-content">
        <div className="detail-item">
          <span className="detail-label">Manufacturer</span>
          <span className="detail-value">
            {getFirstValue(openFda.manufacturer_name)}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Route</span>
          <span className="detail-value">{getFirstValue(openFda.route)}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Dosage form</span>
          <span className="detail-value">
            {getFirstValue(openFda.dosage_form)}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Application</span>
          <span className="detail-value">{applicationNumber}</span>
        </div>
      </div>
    </Link>
  );
}

export default MedicineCard;

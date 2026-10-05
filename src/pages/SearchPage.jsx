import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import MedicineCard from "../components/MedicineCard";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

const RESULTS_KEY = "medicine-search-results";
const API_URL = "https://api.fda.gov/drug/label.json";

function SearchPage() {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!searchQuery) return undefined;

    const controller = new AbortController();

    async function loadMedicines() {
      setIsLoading(true);
      setError("");

      try {
        const url = new URL(API_URL);
        url.searchParams.set("search", `openfda.brand_name:"${searchQuery}"`);
        url.searchParams.set("limit", "20");

        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok && response.status !== 404) {
          throw new Error("Request failed");
        }

        const results = response.status === 404
          ? []
          : (await response.json()).results || [];
        setMedicines(results);
        sessionStorage.setItem(RESULTS_KEY, JSON.stringify(results));
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError("Something went wrong. Please try again.");
          setMedicines([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadMedicines();

    return () => controller.abort();
  }, [searchQuery]);

  function handleSubmit(event) {
    event.preventDefault();
    const trimmedValue = inputValue.trim();

    if (!trimmedValue) {
      setError("Please enter a medicine brand name.");
      setHasSearched(false);
      return;
    }

    if (trimmedValue.toLowerCase() === searchQuery.toLowerCase()) return;

    setSearchQuery(trimmedValue);
    setHasSearched(true);
    setError("");
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="MeddiBuddy home">
          <span>MeddiBuddy</span>
        </a>
      </header>

      <main>
        <section className="hero-section">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            Find trusted medicine information
          </div>
          <h1>Know what you’re taking.</h1>
          <p className="hero-copy">
            Search by brand name to explore medicine labels and useful product
            information.
          </p>
          <SearchBar
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
          <p className="search-hint">Try “advil”, “tylenol”, or “claritin”</p>
        </section>

        <section className="results-section" aria-live="polite">
          {isLoading && <Loading />}
          {!isLoading && error && <ErrorMessage message={error} />}
          {!isLoading && !error && hasSearched && medicines.length === 0 && (
            <div className="empty-state">
              <span className="empty-icon" aria-hidden="true">
                ⌕
              </span>
              <h2>No results found for “{searchQuery}”</h2>
              <p>Try checking the spelling or searching for another brand.</p>
            </div>
          )}
          {!isLoading && !error && medicines.length > 0 && (
            <>
              <div className="results-heading">
                <div>
                  <span className="section-label">Search results</span>
                  <h2>Medicine labels for “{searchQuery}”</h2>
                </div>
                <span className="result-count">{medicines.length} results</span>
              </div>
              <div className="medicine-list">
                {medicines.map((medicine, index) => (
                  <MedicineCard
                    key={`${medicine.openfda?.application_number?.[0] || "medicine"}-${index}`}
                    medicine={medicine}
                    index={index}
                  />
                ))}
              </div>
            </>
          )}
          {!isLoading && !error && !hasSearched && (
            <div className="welcome-state">
              <h2>Your search starts here</h2>
              <p>Enter a brand name above to see matching medicine labels.</p>
            </div>
          )}
        </section>
      </main>

    </div>
  );
}

export default SearchPage;

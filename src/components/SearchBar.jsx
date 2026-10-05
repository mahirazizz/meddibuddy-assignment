function SearchBar({ value, onChange, onSubmit, isLoading }) {
  return (
    <form className="search-form" onSubmit={onSubmit} role="search">
      <input
        className="search-input"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search medicine name..."
        aria-label="Medicine name"
      />
      <button className="search-button" type="submit" disabled={isLoading}>
        {isLoading ? "Searching..." : "Search"}
      </button>
    </form>
  );
}

export default SearchBar;

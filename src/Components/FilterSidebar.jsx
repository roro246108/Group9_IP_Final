export default function FilterSidebar({
  filters,
  setFilters,
  resetFilters,
  branchOptions = [],
  typeOptions = [],
}) {
  return (
    <aside className="h-fit rounded-3xl bg-[#e6eef7] p-6 shadow-md">
      <div>
        <h3 className="mb-6 text-2xl font-bold text-[#223a5e]">Filters</h3>
      </div>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-[#223a5e]">
            Room Type
          </label>
          <select
            value={filters.type || ""}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="w-full rounded-2xl border border-[#dbe4f0] bg-[#CBD9E6] px-4 py-4 text-[#223a5e] outline-none"
          >
            <option value="">All Types</option>
            {typeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#223a5e]">
            Branch
          </label>
          <select
            value={filters.branch || ""}
            onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
            className="w-full rounded-2xl border border-[#dbe4f0] bg-[#CBD9E6] px-4 py-4 text-[#223a5e] outline-none"
          >
            <option value="">All Branches</option>
            {branchOptions.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#223a5e]">
            Minimum Rating
          </label>
          <select
            value={filters.rating || ""}
            onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
            className="w-full rounded-2xl border border-[#dbe4f0] bg-[#CBD9E6] px-4 py-4 text-[#223a5e] outline-none"
          >
            <option value="">All Ratings</option>
            <option value="4">4.0+</option>
            <option value="4.5">4.5+</option>
            <option value="4.8">4.8+</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#223a5e]">
            Guests
          </label>
          <select
            value={filters.guests || ""}
            onChange={(e) => setFilters({ ...filters, guests: e.target.value })}
            className="w-full rounded-2xl border border-[#dbe4f0] bg-[#CBD9E6] px-4 py-4 text-[#223a5e] outline-none"
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#223a5e]">
            Sort By
          </label>
          <select
            value={filters.sortBy || ""}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            className="w-full rounded-2xl border border-[#dbe4f0] bg-[#CBD9E6] px-4 py-4 text-[#223a5e] outline-none"
          >
            <option value="">Default</option>
            <option value="low-high">Price Low to High</option>
            <option value="high-low">Price High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        <button
          onClick={resetFilters}
          className="mt-2 w-full rounded-2xl bg-[#EAF1F8] py-4 font-semibold text-[#2f6fb3] transition hover:bg-[#dce8f4]"
        >
          Reset Filters
        </button>
      </div>
    </aside>
  );
}

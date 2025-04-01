import React, { useState, useEffect, useMemo } from 'react';
import '../CustomerPages_css/FilterSection.css'; // Ensure CSS is well-structured

function FilterSection({ items = [], onFilter }) {
    const [sortType, setSortType] = useState("");
    const [category, setCategory] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredCount, setFilteredCount] = useState(items.length);

    // Memoize categories for performance, normalizing whitespace and case sensitivity
    const categories = useMemo(() => {
        const normalizedCategories = new Set(
            items.map(item => item.category.trim().toLowerCase())
        );
        // Return original categories preserving case but ensuring uniqueness
        return [...normalizedCategories].map(
            cat => items.find(item => item.category.trim().toLowerCase() === cat).category
        );
    }, [items]);

    // Apply filters whenever sortType, category, searchTerm, or items change
    useEffect(() => {
        const applyFilters = () => {
            let filteredItems = [...items];

            // Sorting logic
            if (sortType) {
                filteredItems.sort((a, b) => {
                    if (sortType === "lowToHigh") return a.price - b.price;
                    if (sortType === "highToLow") return b.price - a.price;
                    if (sortType === "aToZ") return a.name.localeCompare(b.name);
                    if (sortType === "zToA") return b.name.localeCompare(a.name);
                    return 0;
                });
            }

            // Category filter logic
            if (category) {
                filteredItems = filteredItems.filter(item =>
                    item.category.trim().toLowerCase() === category.trim().toLowerCase()
                );
            }

            // Search filter logic
            if (searchTerm) {
                filteredItems = filteredItems.filter(item =>
                    item.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
                );
            }

            // Update filtered item count and pass filtered items to the parent component
            setFilteredCount(filteredItems.length);
            onFilter(filteredItems);
        };

        applyFilters();
    }, [sortType, category, searchTerm, items, onFilter]);

    // Reset all filter values to default
    const resetFilters = () => {
        setSortType("");
        setCategory("");
        setSearchTerm("");
        setFilteredCount(items.length);
        onFilter(items);
    };

    return (
        <div className="filter-section-depth">
            <select
                value={sortType}
                onChange={e => setSortType(e.target.value)}
                className="filter-select"
                aria-label="Sort products"
            >
                <option value="" disabled>Sort By</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
                <option value="aToZ">Name: A to Z</option>
                <option value="zToA">Name: Z to A</option>
            </select>

            <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="filter-select"
                aria-label="Filter by category"
            >
                <option value="" disabled>All Categories</option>
                {categories.map((cat, index) => (
                    <option key={index} value={cat}>{cat}</option>
                ))}
            </select>

            <input
                type="text"
                placeholder="Search here..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="search-input"
                aria-label="Search products"
            />

            <button onClick={resetFilters} className="reset-button" aria-label="Reset filters">
                Reset Filters
            </button>

            <div className="product-count">
                {filteredCount} {filteredCount === 1 ? 'Product' : 'Products'} Available
            </div>
        </div>
    );
}

export default FilterSection;

// Example data - replace with dynamic data later
const prices = [
    { supplier: "Supplier A", product: "Product X", price: "$10.50", updated: "2024-12-10" },
    { supplier: "Supplier B", product: "Product Y", price: "$15.20", updated: "2024-12-11" },
    { supplier: "Supplier C", product: "Product Z", price: "$12.30", updated: "2024-12-12" }
];

function populateTable() {
    const tableBody = document.getElementById('price-list');
    tableBody.innerHTML = ""; // Clear existing rows
    prices.forEach(price => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${price.supplier}</td>
            <td>${price.product}</td>
            <td>${price.price}</td>
            <td>${price.updated}</td>
        `;
        tableBody.appendChild(row);
    });
}

function filterTable() {
    const searchValue = document.getElementById('search-bar').value.toLowerCase();
    const rows = document.querySelectorAll('#price-list tr');
    rows.forEach(row => {
        const supplier = row.children[0].textContent.toLowerCase();
        row.style.display = supplier.includes(searchValue) ? "" : "none";
    });
}

// Initialize table on load
document.addEventListener('DOMContentLoaded', populateTable);

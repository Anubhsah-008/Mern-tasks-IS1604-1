const form = document.getElementById("item-entry-form");
const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const itemsBody = document.getElementById("items-body");
const formTitle = document.getElementById("form-title");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");
const message = document.getElementById("message");
const searchInput = document.getElementById("search");

let editingId = null;
let allItems = [];

document.getElementById("today-label").textContent =
  new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date());

async function loadItems() {
  try {
    const response = await fetch("/api/items");
    if (!response.ok) throw new Error("Could not load inventory.");
    allItems = await response.json();
    updateSummary(allItems);
    renderItems();
  } catch (error) {
    showMessage(error.message, true);
  }
}

function updateSummary(items) {
  const total = items.reduce((sum, item) => sum + Number(item.price), 0);
  const average = items.length ? total / items.length : 0;
  const count = String(items.length).padStart(2, "0");

  document.getElementById("total-items").textContent = count;
  document.getElementById("side-count").textContent = count;
  document.getElementById("list-count").textContent = count;
  document.getElementById("total-value").textContent = formatCurrency(total);
  document.getElementById("average-price").textContent = formatCurrency(average);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 2
  }).format(value);
}

function renderItems() {
  const query = searchInput.value.trim().toLowerCase();
  const visibleItems = allItems.filter(item => item.name.toLowerCase().includes(query));
  itemsBody.replaceChildren();

  if (visibleItems.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 3;
    cell.className = "empty-row";
    cell.textContent = allItems.length ? "No matching items. Try another search." : "Your inventory is empty. Add your first item.";
    row.appendChild(cell);
    itemsBody.appendChild(row);
  }

  visibleItems.forEach(item => {
    const row = document.createElement("tr");
    const details = document.createElement("td");
    const itemCell = document.createElement("div");
    itemCell.className = "item-cell";

    const avatar = document.createElement("span");
    avatar.className = "item-avatar";
    avatar.textContent = item.name.slice(0, 1);

    const nameWrap = document.createElement("div");
    const itemName = document.createElement("div");
    itemName.className = "item-name";
    itemName.textContent = item.name;
    const itemId = document.createElement("div");
    itemId.className = "item-id";
    itemId.textContent = `ITEM-${String(item.id).padStart(3, "0")}`;
    nameWrap.append(itemName, itemId);
    itemCell.append(avatar, nameWrap);
    details.appendChild(itemCell);

    const price = document.createElement("td");
    price.className = "price-cell";
    price.textContent = formatCurrency(Number(item.price));

    const actions = document.createElement("td");
    actions.className = "action-cell";

    const edit = document.createElement("button");
    edit.type = "button";
    edit.className = "row-action edit";
    edit.textContent = "Edit";
    edit.addEventListener("click", () => startEdit(item));

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "row-action delete";
    remove.textContent = "Delete";
    remove.addEventListener("click", () => deleteItem(item.id));

    actions.append(edit, remove);
    row.append(details, price, actions);
    itemsBody.appendChild(row);
  });

  document.getElementById("showing-count").textContent =
    `Showing ${visibleItems.length} of ${allItems.length} items`;
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  const itemData = { name: nameInput.value.trim(), price: priceInput.value };
  const isEditing = editingId !== null;

  try {
    const response = await fetch(isEditing ? `/api/items/${editingId}` : "/api/items", {
      method: isEditing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(itemData)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Request failed.");

    showMessage(isEditing ? "Item updated successfully." : "Item added to inventory.");
    resetForm();
    await loadItems();
  } catch (error) {
    showMessage(error.message, true);
  }
});

function startEdit(item) {
  editingId = item.id;
  nameInput.value = item.name;
  priceInput.value = item.price;
  formTitle.textContent = "Edit item";
  submitBtn.innerHTML = 'Save changes <span>↗</span>';
  nameInput.focus();
  document.getElementById("item-form").scrollIntoView({ behavior: "smooth", block: "center" });
  showMessage(`Editing ITEM-${String(item.id).padStart(3, "0")}`);
}

async function deleteItem(id) {
  if (!confirm("Delete this item from your inventory?")) return;
  try {
    const response = await fetch(`/api/items/${id}`, { method: "DELETE" });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Delete failed.");
    if (editingId === id) resetForm();
    showMessage("Item deleted successfully.");
    await loadItems();
  } catch (error) {
    showMessage(error.message, true);
  }
}

function resetForm() {
  form.reset();
  editingId = null;
  formTitle.textContent = "Add an item";
  submitBtn.innerHTML = 'Add to inventory <span>↗</span>';
  message.textContent = "";
}

function showMessage(text, isError = false) {
  message.textContent = text;
  message.style.color = isError ? "#bd4e3f" : "#397b3d";
}

cancelBtn.addEventListener("click", resetForm);
searchInput.addEventListener("input", renderItems);
loadItems();

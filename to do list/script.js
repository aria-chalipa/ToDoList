// Select DOM elements
const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const inputInvalid = document.getElementById('input-invalid');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('items-clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;  // Flag to track if the edit mode is active

// Display items stored in localStorage when the document is loaded
function displayItems() {
    const itemsFromStorage = getItemsFromStorage();

    // Add each item to the DOM
    itemsFromStorage.forEach(item => addItemToDOM(item));
    checkUI();  // Update the UI based on the current items
}

// Set item for editing
function setItemToEdit(item) {
    isEditMode = true;  // Enable edit mode
    // Remove edit mode class from all items
    itemList.querySelectorAll('li').forEach(item => item.classList.remove('edit-mode'));

    // Set the clicked item to edit mode
    item.classList.add('edit-mode');
    itemInput.value = item.textContent;

    // Update the button text and style for edit mode
    formBtn.innerHTML = "<i class='bi bi-pencil-fill'></i> Update Item";
    formBtn.classList.replace('btn-dark', 'btn-primary');
}

// Add a new item or update an existing one
function addItem(e) {
    e.preventDefault();  // Prevent form submission

    const newItem = itemInput.value;

    // Validate input
    if (newItem === '') {
        inputInvalid.innerText = 'Please add an item';
        return;
    } else {
        inputInvalid.innerText = '';
    }

    if (isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');
        // Remove the old item from storage
        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.remove();  // Remove the item from the DOM
        // Reset button to add mode
        formBtn.innerHTML = "<i class='bi bi-plus'></i> Add item";
        formBtn.classList.replace('btn-primary', 'btn-dark');
    } else {
        // Check if item already exists
        if (checkItemExists(newItem)) {
            inputInvalid.innerText = 'That item already exists';
            return;
        } else {
            inputInvalid.innerText = '';
        }
    }

    // Add the new item to the DOM and storage
    addItemToDOM(newItem);
    addItemToStorage(newItem);

    // Clear the input field
    itemInput.value = '';
    checkUI();  // Update the UI based on the current items
}

// Check if an item already exists in localStorage
function checkItemExists(newItem) {
    const items = getItemsFromStorage();
    return items.includes(newItem);
}

// Add item to the DOM
function addItemToDOM(item) {
    const li = document.createElement('li');
    li.className = 'list-item';
    li.textContent = item;

    // Add delete icon to the item
    const icon = createIcon('bi bi-x fs-5 text-danger');
    li.appendChild(icon);

    itemList.appendChild(li);  // Append the item to the list
}

// Add item to localStorage
function addItemToStorage(item) {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.push(item);
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

// Get items from localStorage
function getItemsFromStorage() {
    let itemsFromStorage;

    if (localStorage.getItem('items') === null) {
        itemsFromStorage = [];
    } else {
        try {
            itemsFromStorage = JSON.parse(localStorage.getItem('items'));
            if (!Array.isArray(itemsFromStorage)) {
                itemsFromStorage = [];
            }
        } catch (e) {
            itemsFromStorage = [];
        }
    }

    return itemsFromStorage;
}

// Create an icon element
function createIcon(classes) {
    const icon = document.createElement('i');
    icon.className = classes;

    return icon;
}

// Handle click events on the list items
function onClickItem(e) {
    if (e.target.classList.contains('bi-x')) {
        // Remove the item if the delete icon is clicked
        removeItem(e.target.parentElement);
    } else {
        // Set the item to edit mode
        setItemToEdit(e.target);
    }
}

// Clear all items from the list and localStorage
function clearItems() {
    itemList.innerHTML = '';
    localStorage.removeItem('items');
    checkUI();  // Update the UI based on the current items
}

// Remove item from the DOM and localStorage
function removeItem(item) {
    item.remove();  // Remove the item from the DOM
    removeItemFromStorage(item.textContent);  // Remove the item from storage
    checkUI();  // Update the UI based on the current items
}

// Remove item from localStorage
function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage();
    itemsFromStorage = itemsFromStorage.filter(i => i !== item);
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

// Update the UI based on the current state
function checkUI() {
    const items = itemList.querySelectorAll('li');

    // Show or hide clear button and filter input based on items
    if (items.length === 0) {
        clearBtn.style.display = 'none';
        itemFilter.style.display = 'none';
    } else {
        clearBtn.style.display = 'block';
        itemFilter.style.display = 'block';
    }
}

// Filter items based on input
function filterItems(e) {
    const items = itemList.querySelectorAll('li');
    const text = e.target.value.toLowerCase();

    // Show or hide items based on the filter text
    items.forEach(item => {
        const itemName = item.firstChild.textContent.toLowerCase();
        if (itemName.indexOf(text) !== -1) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Event listeners
itemForm.addEventListener('submit', addItem);
itemList.addEventListener('click', onClickItem);
clearBtn.addEventListener('click', clearItems);
itemFilter.addEventListener('input', filterItems);
document.addEventListener('DOMContentLoaded', displayItems);

checkUI();  // Initial check of the UI when the script loads

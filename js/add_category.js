/**
 * @author Christiane
 * Join Gruppenarbeit 727
 * November 2023
 * 
 * functions to add and del categorys
 * 
 * 
 */
let categoryArray = ['Technical Task', 'User Story'];


/**
 * function to show input field to add category if value 'Enter new category' is select
 * 
 * 
 * 
 */
function handleCategoryChange() {
    let categorySelect = document.getElementById("category");
    let newCategoryInput = document.getElementById("inputCategory");
    // let newCategory = document.getElementById('newCategory');
    if (categorySelect.value === "Enter new category") {
        newCategoryInput.classList.remove("d-none");
    } else {
        newCategoryInput.classList.add("d-none");
    }
}


/**
 * function to add the new category
 * 
 * 
 * 
 */
async function addCategory() {
    const newCategory = document.getElementById('newCategory');
    const cat = newCategory.value.trim();
    if (cat !== '') {
        categoryArray.push(cat);
        await setItem('categories', JSON.stringify(categoryArray));
        updateCategorySelect();
    } else {
        alert("Darf nicht leer sein");
    }
}


/**
 * function to clear the input field 
 * 
 * 
 */
function clearInput() {
    newCategory.value = '';
}


/**
 * function to render the options of category in the select field
 * 
 * 
 * 
 */
function updateCategorySelect() {
    const categorySelect = document.getElementById('category');
    categorySelect.innerHTML = '';

    categoryArray.forEach((cat, i) => {
        const option = document.createElement('option');
        option.className = 'option-container';
        option.value = cat;
        option.innerText = cat;
        // option.onclick = () => delCategory(i);
        const img = document.createElement('img');
        img.src = '../assets/img/delete.png';
        img.alt = 'Delete';
        img.onclick = () => delCategory(i);
        option.appendChild(img);
        categorySelect.appendChild(option);
    });
    const newCategoryOption = document.createElement('option');
    newCategoryOption.value = 'Enter new category';
    newCategoryOption.innerText = 'Enter new category';
    newCategoryOption.classList = 'markText';
    categorySelect.appendChild(newCategoryOption);
}


/**
 * function to delete a category
 * 
 * 
 * @param {*} i 
 * 
 */
async function delCategory(i) {
    if (i >= 0 && i < categoryArray.length) {
        categoryArray.splice(i, 1);
        await setItem('categories', JSON.stringify(categoryArray));
    } else {
        console.log('Invalid index');
    }
}
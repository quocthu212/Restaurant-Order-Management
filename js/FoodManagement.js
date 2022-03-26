import Food from "../model/Food.js";
import {
    deleteFood,
    getFoodListFromLocalStorage,
    postFood,
    updateFood,
    updateFoodListLocalStorageFromDatabase,
} from "./ApiFunction.js";
import { TOKEN } from "./Settings.js";

//Global variables
let btnAddFood = document.querySelector("#btn-add-food");
let btnSortAscending = document.querySelector(".btn-sort-ascending");
let btnSortDescending = document.querySelector(".btn-sort-descending");
let btnSortCreatedDate = document.querySelector(".btn-sort-createdDate");
let btnSaveEditFood = document.querySelector(".btn-save-edit-food");

//events
btnAddFood.addEventListener("click", async () => {
    let arrInputTag = document.querySelectorAll("#foodForm input, #foodForm select, #foodForm textarea");
    let food = new Food();

    for (let inputTag of arrInputTag) {
        let key = inputTag.name;
        let value = inputTag.value;
        food[key] = value;
    }
    await postFood(food);
    await updateFoodListLocalStorageFromDatabase(food);
    fillDataTable(getFoodListFromLocalStorage());
});

btnSortAscending.addEventListener("click", () => {
    if (isButtonOn(btnSortAscending)) {
        return;
    }

    //Turn on the needed button and turn off the others
    turnOffButton(btnSortCreatedDate);
    turnOffButton(btnSortDescending);
    turnOnButton(btnSortAscending);

    let foodList = getFoodListFromLocalStorage();
    foodList.sort((a, b) => a.price - b.price);
    fillDataTable(foodList);
});

btnSortDescending.addEventListener("click", () => {
    if (isButtonOn(btnSortDescending)) {
        return;
    }

    //Turn on the needed button and turn off the others
    turnOffButton(btnSortCreatedDate);
    turnOffButton(btnSortAscending);
    turnOnButton(btnSortDescending);

    let foodList = getFoodListFromLocalStorage();
    foodList.sort((a, b) => b.price - a.price);
    fillDataTable(foodList);
});

btnSortCreatedDate.addEventListener("click", () => {
    if (isButtonOn(btnSortCreatedDate)) {
        return;
    }

    //Turn on the needed button and turn off the others
    turnOffButton(btnSortAscending);
    turnOffButton(btnSortDescending);
    turnOnButton(btnSortCreatedDate);

    let foodList = getFoodListFromLocalStorage();
    fillDataTable(foodList);
});

btnSaveEditFood.addEventListener("click", async () => {
    let foodEdit = JSON.parse(localStorage.getItem('foodEdit'));
    let arrInputEditTag = document.querySelectorAll("#editForm input, #editForm select, #editForm textarea");

    for (let inputTag of arrInputEditTag) {
        let key =inputTag.name;
        foodEdit[key]=inputTag.value;
    }
    
    await updateFood(foodEdit);
    await updateFoodListLocalStorageFromDatabase(TOKEN);
    fillDataTable(getFoodListFromLocalStorage());

});

//functions
window.handleDeleteFoodEvent = async (foodId) => {
    let foodName = getFoodListFromLocalStorage().find(food => food.id===foodId).name;
    if (window.confirm(`Are you sure to delete '${foodName}' ?`)) {
        await deleteFood(foodId);
        await updateFoodListLocalStorageFromDatabase(TOKEN);
        fillDataTable(getFoodListFromLocalStorage());
    }
};

window.handleBtnEditFoodEvent = async (foodId) => {
    let foodList = getFoodListFromLocalStorage();
    let foodEdit = foodList.find((food) => food.id === foodId);
    let arrInputEditTag = document.querySelectorAll("#editForm input, #editForm select, #editForm textarea");
    for (let inputTag of arrInputEditTag) {
        let key = inputTag.name;
        inputTag.value = foodEdit[key];
    }

    localStorage.setItem('foodEdit',JSON.stringify(foodEdit))
};

//functions

let fillDataTable = (foodList) => {
    //function to fill data from foodList into table base

    //Split into 2 drink and dish array
    console.log("foodList in fillDataTable", foodList);
    console.log("foodList", foodList);
    let dishes = foodList.filter((food) => food.type == 0);
    let drinks = foodList.filter((food) => food.type == 1);

    //handle table dish
    let tbodyDish = document.querySelector(".table-dish tbody");
    let contentDishes = "";
    dishes.forEach((dish, index) => {
        contentDishes += `
        <tr>
            <th scope="row">${index + 1}</th>
            <td>${dish.name}</td>
            <td>$${dish.price}</td>
            <td><img src="${dish.image}" alt=""></td>
            <td>
            <button class="btn btn-warning" data-toggle="modal" data-target="#editModal"
            onclick="handleBtnEditFoodEvent(${dish.id})"><i class="fa fa-edit"></i></button>
                <button class="btn btn-danger" onclick="handleDeleteFoodEvent(${
                    dish.id
                })" ><i class="fa fa-times"></i></button>
            </td>
       
        </tr>
        `;
    });
    tbodyDish.innerHTML = contentDishes;

    //handle table drink
    let tbodyDrink = document.querySelector(".table-drink tbody");
    let contentDrinks = "";
    drinks.forEach((drink, index) => {
        contentDrinks += `
        <tr>
            <th scope="row">${index + 1}</th>
            <td>${drink.name}</td>
            <td>$${drink.price}</td>
            <td><img src="${drink.image}" alt=""></td>
            <td>
                <button class="btn btn-warning" data-toggle="modal" data-target="#editModal"
                onclick="handleBtnEditFoodEvent(${drink.id})"><i class="fa fa-edit"></i></button>
                    <button class="btn btn-danger" onclick="handleDeleteFoodEvent(${
                        drink.id
                    })" ><i class="fa fa-times"></i></button>
            </td>
       
        </tr>
        `;
    });
    tbodyDrink.innerHTML = contentDrinks;
};

let turnOffButton = (btn) => {
    btn.classList.remove("btn-success");
    btn.classList.add("btn-danger");
};

let turnOnButton = (btn) => {
    btn.classList.remove("btn-danger");
    btn.classList.add("btn-success");
};

let isButtonOn = (btn) => {
    return btn.classList.contains("btn-success");
};

//run here
updateFoodListLocalStorageFromDatabase(TOKEN); //Run this function to the get latest data from database
fillDataTable(getFoodListFromLocalStorage());

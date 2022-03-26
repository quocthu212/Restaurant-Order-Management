import { URL } from "./Settings.js";

export async function updateFoodListLocalStorageFromDatabase(token = "") {
    //Function to fill up localstorage with data from database
    let result = await fetch(URL, {
        headers: { Authorization: `${token}` },
    })
        .then((res) => res.json())
        .catch((err) => {
            console.log("Wrong token");
        });
    console.log('updated',result)
    await localStorage.setItem("foodList", JSON.stringify(result.data));
}

export function getFoodListFromLocalStorage() {
    if (localStorage.getItem("foodList")) {
        return JSON.parse(localStorage.getItem("foodList"));
    }
}

export async function deleteFood(foodId) {
    try {
        const res = await axios.delete(`${URL}/${foodId}`);
        console.log(res);
      } catch (error) {
        console.log('Error: ' + error);
      }
}

export async function postFood(food) {
    try {
        const res = await axios.post(`${URL}`,food);
        console.log(res);
        alert('Add food successfully');
    } catch (error) {
        console.log('Error: ' + error);
    }
}

export async function updateFood(food) {
    try {

        const res = await axios.put(`${URL}/${food.id}`,food);
        console.log(res);
        alert('Edit food successfully');
    } catch (error) {
        console.log('Error: ' + error);
    }
}

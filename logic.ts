const initArray = [
  { id: 1, name: "Apple", price: 30 },
  { id: 2, name: "Banana", price: 35 },
  { id: 3, name: "Orange", price: 40 },
];

const updateObject = { id: 3, name: "Orange", price: 38 };
const updatePrice = { id: 2, price: 20 };

// const mergeData = initArray.findIndex((items) => console.log(items, "check"));
// const mergeData = initArray.findIndex((items) => items.id === updateObject.id);

const checkMergeData = initArray.findIndex(
  (items) => items.id === updateObject.id && items.name === updateObject.name,
);

if (checkMergeData !== -1) {
  initArray.splice(checkMergeData, 1, updateObject);
}

console.log(initArray, "merged");

const mergeUpdatePrice = initArray.find((items) => items.id === updatePrice.id);
if (mergeUpdatePrice) {
  mergeUpdatePrice.price = updatePrice.price;
}

console.log(mergeUpdatePrice, "price");

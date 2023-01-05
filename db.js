const mongoose = require("mongoose");
const ObjectId = require("mongodb").ObjectId;

//schemas
const userSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  token: String,
});

const priceListSchema = mongoose.Schema({
  idUser: String,
  lastUpdate: Number,
  list: [
    {
      item: String,
      unit: Number,
      price: Number,
    },
  ],
});

const budgetSchema = mongoose.Schema({
  title: String,
  idUser: String,
  description: String,
  ingredients: [
    {
      ingredient: String,
      amount: Number,
      cost: Number,
    },
  ],
  total: String,
});

const recipeSchema = mongoose.Schema({
  title: String,
  idUser: String,
  description: String,
  ingredients: [
    {
      ingredient: String,
      amount: Number,
    },
  ],
});

//models
const User = mongoose.model("User", userSchema);
const PriceList = mongoose.model("PriceList", priceListSchema);
const Budget = mongoose.model("Budget", budgetSchema);
const Recipes = mongoose.model("Recipe", recipeSchema);

//actions
//priceList
const findItem = async (idUser) => {
  const result = await PriceList.find({ idUser });

  if (!result[0].list.length) return result
  if (result[0].list[0].item === undefined && result[0].list[0]['_id'] && result[0].list.length === 1){
    result[0].list.splice(0, 1)

    await PriceList.updateOne(
      { idUser },
      { $set: { list: result[0].list } }
    );
  }

  result[0].list.sort((a, b) => {
    const ingredientA = a.item.toUpperCase(); 
    const ingredientB = b.item.toUpperCase(); 

    if (ingredientA < ingredientB) {
      return -1;
    }
    if (ingredientA > ingredientB) {
      return 1;
    }
  
    return 0;
  });

  return result;
};

const addItem = async (data) => {
  const { item, unit, price, idUser } = data,
    result = await PriceList.updateOne({ idUser }, { $push: { list: data } });

  return result.modifiedCount;
};

const updateList = async (data) => {
  const { item, unit, price, idUser } = data,
    document = await PriceList.find({ idUser });

  document[0].list.forEach((obj) => {
    if (obj.item === item) {
      obj.unit = unit;
      obj.price = price;
    }
  });

  const result = await PriceList.updateOne(
    { idUser },
    { $set: { list: document[0].list } }
  );

  return result.modifiedCount;
};

const deleteItem = async (data) => {
  let { item, unit, price, idUser } = data,
    document = await PriceList.find({ idUser }),
    index = 0;

  //find index of the element
  for (let i = 0; i < document[0].list.length; i++) {
    index += 1;

    if (document[0].list[i].item === item) break;
  }

  //remove the item from the array
  document[0].list.splice(index - 1, 1);

  const result = await PriceList.updateOne(
    { idUser },
    { $set: { list: document[0].list } }
  );

  return { result: result.modifiedCount, list: document[0].list };
};

//budget
const findBudget = async (idUser) => {
  const result = await Budget.find({ idUser });

  result.sort((a, b) => {
    const ingredientA = a.title.toUpperCase(); 
    const ingredientB = b.title.toUpperCase(); 
    
    if (ingredientA < ingredientB) {
      return -1;
    }
    if (ingredientA > ingredientB) {
      return 1;
    }
  
    return 0;
  });

  return result;
};

const newBudget = async (data) => {
  const { title, description, idUser } = data;

  const newBudgett = new Budget({
    title,
    idUser,
    description,
    ingredients: [{}],
    total: "",
  });

  newBudgett.save();
  return newBudgett;
};

const updateBudget = async (data) => {
  const { idUser, _id, ingredients, total, title } = data,
    result = await Budget.updateOne(
      { $and: [{ _id: ObjectId(_id), idUser }] },
      { $set: { ingredients, total } }
    );

  return { update: result.modifiedCount, title };
};

const deleteBudget = async (data) => {
  const { idUser, title, _id } = data,
    deletion = await Budget.deleteOne({ $and: [{ idUser, _id }] });

  return { info: deletion.deletedCount, title };
};

//recipes
const findRecipes = async (idUser) => {
  const result = await Recipes.find({ idUser });

  result.sort((a, b) => {
    const ingredientA = a.title.toUpperCase(); 
    const ingredientB = b.title.toUpperCase(); 
    
    if (ingredientA < ingredientB) {
      return -1;
    }
    if (ingredientA > ingredientB) {
      return 1;
    }
  
    return 0;
  });

  return result;
};

const newRecipe = async (data) => {
  const { title, description, idUser } = data;

  const newRecipe = new Recipes({
    title,
    idUser,
    description,
    ingredients: [{}],
  });

  newRecipe.save();
  return newRecipe;
};

const updateRecipe = async (data) => {
  const { idUser, title, _id, ingredients } = data,
    result = await Recipes.updateOne(
      { $and: [{ idUser, _id }] },
      { $set: { ingredients } }
    );

  return { update: result.modifiedCount, title };
};

const deleteRecipe = async (data) => {
  const { idUser, title, _id } = data,
    deletion = await Recipes.deleteOne({ $and: [{ idUser, _id }] });

  return { info: deletion.deletedCount, title };
};


module.exports = {
  findItem,
  addItem,
  updateList,
  deleteItem,
  findBudget,
  newBudget,
  updateBudget,
  deleteBudget,
  findRecipes,
  newRecipe,
  updateRecipe,
  deleteRecipe,
  User,
  PriceList,
};

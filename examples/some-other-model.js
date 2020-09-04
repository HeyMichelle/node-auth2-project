const db = require('../data/dbConfig.js');

// helper functions

module.exports = {
  find,
  findById,
  insert,
  update,
  remove,
};
// any function that returns a promise, consider making asynchronous 
// do not make async if you can't accept a promise where you need to consume it, like in map/filter/array methods

function find() {
  return db('cars');
}

function findById(id) {
  return db('cars')
    .where({id})
    .first();
}

async function insert(payload) {
  const [id] = await db('cars')
    .insert(payload, "id")
  
  return findById(id);
  
}

function update(id, changes) {
    return db('cars')
      .where({ id })
      .update(changes, '*');
} 

function remove(id) {
  return db('cars')
    .where({ id })
    .del();
}


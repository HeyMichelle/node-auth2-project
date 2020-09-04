const db = require("../data/dbConfig.js");


module.exports = {
  find,
  findById,
  findSteps,
  add,
  update,
  remove,
};

function find() {
  return db("schemes");
}

function findById(id) {
  return db("schemes").where({ id }).first();
}


function findSteps(id) {
  return db('schemes as s')
    .join('steps as c','s.id', 'c.scheme_id',)
    .select('s.scheme_name', 'c.step_number', 'c.instructions', )
    .where({ scheme_id: id });

} // number arrays are returned by insert, because its usually returning integer

async function add(schemeData) {
  const [id] = await db("schemes")
   .insert(schemeData)
   return findById(id)
}


async function update(updates, id) {
  const changes = await db("schemes").where({ id }).update(updates);
  return changes ? findById(id) : undefined;
}

async function remove(id) {
  const deleted = await findById(id);
  const changes = await db("schemes").where({ id }).del();
  return changes ? deleted : undefined;
}
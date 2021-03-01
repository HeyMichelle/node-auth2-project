exports.seed = async function(knex) {
	await knex("projects").insert([
		{
			name: "sprint challenge 2",
			description: "database design",
			completed: false
		},
		{
			name: "Build Week Project",
			description: "Backend build week",
			completed: false
		},
		{
			name: "Re-watch Lectures From Sprint 2",
			description: "database design",
			completed: true
		}
	]);
};
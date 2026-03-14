const { load } = require('js-yaml');

module.exports = {
	process(src) {
		const parsed = load(src);
		return { code: `module.exports = ${JSON.stringify(parsed)};` };
	},
};

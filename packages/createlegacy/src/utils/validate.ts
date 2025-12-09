export function validateProjectName(name: string): boolean | string {
	if (!name) {
		return "Project name is required";
	}

	if (name.length === 0) {
		return "Project name cannot be empty";
	}

	// Check for valid directory name
	if (!/^[a-zA-Z0-9_.-]+$/.test(name)) {
		return "Project name can only contain letters, numbers, hyphens, underscores, and dots";
	}

	// Check for reserved names
	const reservedNames = ["node_modules", "package.json", "src", "dist"];
	if (reservedNames.includes(name.toLowerCase())) {
		return `"${name}" is a reserved name`;
	}

	return true;
}

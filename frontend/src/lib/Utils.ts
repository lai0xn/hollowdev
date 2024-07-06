export const byteToString = (bytes: number) => {
	const units = ['B', 'KB', 'MB', 'GB', 'TB'];
	let index = 0;
	while (bytes >= 1024 && index < units.length - 1) {
		bytes /= 1024;
		index++;
	}
	return `${Math.round(bytes * 100) / 100} ${units[index]}`;
};

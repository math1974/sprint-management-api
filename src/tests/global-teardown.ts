import DatabaseModule from '../config/database';

async function setup(): Promise<boolean> {
	globalThis.database = DatabaseModule;

	return true;
}

export default setup;

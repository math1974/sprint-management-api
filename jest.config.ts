import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
	roots: [__dirname + '/src'],
	rootDir: __dirname,
	testEnvironment: 'node',
	moduleDirectories: ['node_modules', 'src', __dirname, __dirname + './src'],
	transform: {
		'^.+\\.(ts)?$': 'ts-jest',
		'^.+\\.(js)$': 'babel-jest'
	},
	testRegex: '.*\\.test\\.ts$',
	verbose: true,
	coveragePathIgnorePatterns: ['node_modules', 'tests'],
	moduleNameMapper: {
		'^@app/(.*)$': '<rootDir>/src/$1'
	}
};

export default jestConfig;

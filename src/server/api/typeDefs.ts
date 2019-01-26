import * as glob from 'glob';
import { readFileSync } from 'fs';

function loadGraphQLSchema(filePath: string) {
  return readFileSync(`${process.cwd()}/${filePath}`, { encoding: 'utf-8' });
}

// Glob will return an array of all the files located in the dist/ director ending in .graphql
// The Base schema (base.graphql) must be loaded first however it is the first element in the array becuase
// It located at the highest directory level.
const typeDefs = glob.sync('dist/**/*.graphql').map(loadGraphQLSchema);

export default typeDefs;

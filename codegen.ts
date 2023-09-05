/* eslint-disable import/no-extraneous-dependencies */
import { CodegenConfig } from '@graphql-codegen/cli';
import { url } from './src/makeURL';

const config: CodegenConfig = {
  schema: `${url}/api/graphql`,
  documents: ['gql/*.gql'],
  generates: {
    './src/gql/': {
      preset: 'client',
      config: {
        documentMode: 'string',
      },
    },
  },
  hooks: { afterAllFileWrite: ['prettier --write'] },
};

export default config;
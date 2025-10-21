import React, { FC } from 'react';
import Main from './components/Main';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';

const client = new ApolloClient({
  link: new HttpLink({ 
    uri: process.env.REACT_APP_GRAPHQL_URL || 'http://localhost:8000/graphql' 
  }),
  cache: new InMemoryCache(),
});

const App: FC = () => {
  return (
    <ApolloProvider client={client}>
      <Main />
    </ApolloProvider>
  );
};

export default App;

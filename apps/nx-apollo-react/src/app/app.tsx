import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import React from 'react';
import './app.css';
import SetList from './set-list/set-list';
import AddSetForm from './add-set-form/add-set-form';

const client = new ApolloClient({
  uri: 'http://localhost:3333/graphql'
});

const App = () => (
  <ApolloProvider client={client}>
    <h1>My Lego Sets</h1>
    <div className="flex">
      <AddSetForm />
      <SetList />
    </div>
  </ApolloProvider>
);

export default App;

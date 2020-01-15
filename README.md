# NxApolloExample

This project was generated using [Nx](https://nx.dev).

<p align="center"><img src="https://raw.githubusercontent.com/nrwl/nx/master/nx-logo.png" width="450"></p>

🔎 **Nx is a set of Extensible Dev Tools for Monorepos.**

## Run demo
GraphQL API
- `npm start api`

[Angular](https://angular.io)
- `npm start nx-apollo`

[React](https://reactjs.org)
- `npm start nx-apollo-react`

## What you’ll create
In this article, we’ll be creating a simple GraphQL API that will allow us to track some information about Lego sets. We’ll create this API using NestJS, and it will be consumed by both an Angular and a React application. We’ll have this all inside of a Nx Workspace in a single repository.

## What you’ll learn
In this article, you’ll learn how to:
- Create an Nx workspace for both frontend and backend applications
- Create a GraphQL API using NestJS
- Autogenerate frontend code based on your GraphQL schema
- Create an Angular application to consume your GraphQL api
- Create a React application to consume your GraphQL api
- Create a new workspace

Let’s get started by creating our Nx workspace. We’ll start with an empty workspace:

`npx create-nx-workspace@latest nx-apollo-example`

```
philip@DESKTOP-L1839TI:~$ npx create-nx-workspace@latest nx-apollo-example
npx: installed 169 in 42.333s
? What to create in the new workspace angular-nest      [a workspace with a full stack application (Angular + Nest)]
? Application name                    nx-apollo       
? Default stylesheet format           CSS`
```

## Create GraphQL API
We’ll be using the NestJS framework to create our GraphQL API. First, let’s add NestJS to our Nx workspace and create an application:

`nx add @nrwl/nestjs`

`nx generate @nrwl/nest:application api`

Once our application is created, we’ll install the GraphQL modules needed for Nest

`npm install @nestjs/graphql apollo-server-express graphql-tools graphql`

We’re going to need a GraphQL schema to create our API, so let’s create a very simple one with a single query and a single mutation.

```
type Set {
    id: Int!
    name: String
    year: Int
    numParts: Int
}

type Query {
    allSets: [Set]
}

type Mutation {
    addSet(name: String, year: String, numParts: Int): Set
}
```

Now we can import the GraphQLModule and use that schema in NestJS.
```typescript
// apps/api/src/app/app.module.ts
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SetResolver } from './set.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql']
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
```

This is already enough to see some progress when we run our API application.

`npm start api`

When the application is running, you can bring up the GraphQL playground in your browser at [http://localhost:3333/graphql](http://localhost:3333/graphql)

Here you can inspect your GraphQL schema as well as submit queries. The queries won’t return anything right now because we haven’t provided any data. Let’s take care of that by writing a resolver. Create a new file in your api project salled set.resolver.ts. Then add this code:

```typescript
// apps/api/src/app/set.resolver.ts

import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

export interface SetEntity {
  id: number;
  name: string;
  numParts: number;
  year: string;
}

@Resolver('Set')
export class SetResolver {
  private sets: SetEntity[] = [
    {
      id: 1,
      name: 'Voltron',
      numParts: 2300,
      year: '2019'
    },
    {
      id: 2,
      name: 'Ship in a Bottle',
      numParts: 900,
      year: '2019'
    }
  ];

  @Query('allSets')
  getAllSets(): SetEntity[] {
    return this.sets;
  }

  @Mutation()
  addSet(
    @Args('name') name: string,
    @Args('year') year: string,
    @Args('numParts') numParts: number
  ) {
    const newSet = {
      id: this.sets.length + 1,
      name,
      year,
      numParts: +numParts
    };

    this.sets.push(newSet);

    return newSet;
  }
}
```

This is a very simple resolver which will hold our data in memory. It will return the current contents of the sets array for the allSets query and allow users to add a new set using the addSet mutation. Once we have this written, we need to add it to our providers array in our app module:

```typescript
// apps/api/src/app/app.module.ts
@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql']
    })
  ],
  controllers: [AppController],
  providers: [AppService, SetResolver]
})
export class AppModule {}
```

Go back to your GraphQL Playground and see if your queries return any data now. Try a query and a mutation:

```
query {
  allSets{
    Id,
    name,
    numParts
  }
}

mutation {
  addSet(name: "My New Set", numParts: 200, year: "2020") {
    id
 }
}
```

Now that our API is working, we’re ready to build a frontend to access this.

## Create Angular app
Just like with Nest, we need to add Angular support to our workspace and create an application:

`nx add @nrwl/angular`

`nx generate @nrwl/angular:application nx-apollo`

We’ll be using the Apollo client to consume our GraphQL API, so let’s install that. The Apollo team has made it easy for us by supporting the Angular CLI’s add command:

`ng add apollo-angular`

When that’s done running, you’ll have a new file in your Angular application named graph.module.ts. Open it up and add the URI of your GraphQL api at the top of this file

```typescript
// apps/nx-apollo/src/app/graphql.module.ts
const uri = 'http://localhost:3333/graphql'; // <-- add the URL of the GraphQL server here
```

## Setup Angular Code Generation
We’ll take advantage of a tool called GraphQL Code Generator to make development a little faster. As always, first we install dependencies:

npm install --save-dev @graphql-codegen/cli @graphql-codegen/typescript-operations
@graphql-codegen/typescript-apollo-angular

We’ll need to create some queries and mutations for the frontend to consume GraphQL. Create a folder named graphql in your Angular application with a file inside called operations.graphql:

```
// apps/nx-apollo/src/app/graphql/operations.graphql

query setList {
  allSets{
    id
    name
    numParts
    year
  }
}


mutation addSet($name: String!, $year: String!, $numParts: Int!) {
  addSet(name: $name, year: $year, numParts: $numParts) {
    id
    name
    numParts
    year
  }
}
```

To configure the code generator for Angular, we’ll create a file named codegen.yml in our Angular project:

```yaml
# apps/nx-apollo/codegen.yml
overwrite: true
schema: "apps/api/src/app/schema.graphql"
generates:
  apps/nx-apollo/src/app/generated/generated.ts:
    documents: "apps/nx-apollo/**/*.graphql"
    plugins:
      - "typescript"
      - "typescript-operations"
      - "typescript-apollo-angular"
```

This configuration will grab all of our GraphQL files and generate all of the needed types and services to consume the API. 

To actually run this code generator, we’ll add a new task to our Angular project in our workspace:
```json
// workspace.json

{
  "version": 1,
  "projects": {
    "nx-apollo": {
      ...
      "architect": {
        ...
        "generate": {
          "builder": "@nrwl/workspace:run-commands",
          "options": {
            "commands": [
              {
                "command": "npx graphql-codegen --config apps/nx-apollo/codegen.yml"
              }
            ]
          }
        }
      }
    },
    ...
}
```

Now we can run that using the Nx CLI:

`nx run nx-apollo:generate`

We should now have a folder called generated in our Angular project with a file named generated.ts. It contains typing information about the GraphQL schema and the operations we defined. It even has some services which will make consuming this api super-fast.

## Create Angular components
We now have all we need to start building our Angular components. We’ll create two: a list of Lego sets and a form to add a Lego set. We use the Nx CLI to build these:

`nx generate @schematics/angular:component --name=SetList --project=nx-apollo --module=app.module.ts `

`nx generate @schematics/angular:component --name=SetForm --project=nx-apollo --module=app.module.ts`

Since our form is using the ReactiveFormsModule, remember to import that into your app module. Your app.module.ts file should look like this now.

```typescript
// apps/nx-apollo/src/app/app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { GraphQLModule } from './graphql.module';
import { SetListComponent } from './set-list/set-list.component';
import { SetFormComponent } from './set-form/set-form.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AppComponent, SetListComponent, SetFormComponent],
  imports: [BrowserModule, HttpClientModule, GraphQLModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

In the SetList component, add the following:
```html
<!-- apps/nx-apollo/src/app/set-list/set-list.component.html -->
<ul>
  <li *ngFor="let set of sets$ | async">
    {{ set.year }} <strong>{{ set.name }}</strong> ({{ set.numParts }} parts)
  </li>
</ul>
```

```css
/* apps/nx-apollo/src/app/set-list/set-list.component.css */

:host {
  font-family: sans-serif;
}

ul {
  list-style: none;
  margin: 0;
}

li {
  padding: 8px;
}

li:nth-child(2n) {
  background-color: #eee;
}

span.year {
  display: block;
  width: 20%;
}
```

```typescript
// apps/nx-apollo/src/app/set-list/set-list.component.ts
import { Component } from '@angular/core';
import { Set } from '@nx-apollo-example/api-interfaces';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SetListGQL } from '../generated/generated';

@Component({
  selector: 'nx-apollo-example-set-list',
  templateUrl: './set-list.component.html',
  styleUrls: ['./set-list.component.css']
})
export class SetListComponent {
  sets$: Observable<Set[]>;

  constructor(private setListGQL: SetListGQL) {
    this.sets$ = this.setListGQL
      .watch()
      .valueChanges.pipe(map(result => result.data.allSets));
  }
}
```

Notice how we’ve imported SetListGQL. This is a service generated by GraphQL Code Generator that will allow us to use the results of the SetList query we created earlier. We watch the results of this query and map them so that we get the list of sets. This entire pipeline is type-safe, using the types generated for us.

Final step: bring those new components into our app component and add a little styling

```html
<!-- apps/nx-apollo/src/app/app.component.html -->
<h1>My Lego Sets</h1>
<div class="flex">
  <nx-apollo-example-set-form></nx-apollo-example-set-form>
  <nx-apollo-example-set-list></nx-apollo-example-set-list>
</div>
```

```css
/* apps/nx-apollo/src/app/app.component.css */
h1 {
  font-family: sans-serif;
  text-align: center;
}

.flex {
  display: flex;
}

nx-apollo-example-set-list {
  flex: 1;
  padding: 8px;
}
```

If your API isn’t running already, go ahead and start it:

`npm start api`

And now start your Angular app

`npm start nx-apollo`

Browse to [http://localhost:4200](http://localhost:4200) and see the results of our work!

## Create React App
Let’s create the React application now. We need to add React support to our workspace and create an application:

`nx add @nrwl/react`

`nx generate @nrwl/react:application nx-apollo-react`

We’ll be using the Apollo client to consume our GraphQL API, so let’s install that. 

`npm install apollo-boost @apollo/react-hooks graphql`

Modify your app.tsx to provide the Apollo Client:
```typescript
// apps/nx-apollo-react/src/app/app.tsx

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
  </ApolloProvider>
);

export default App;
```

## Setup React Code Generation
We’ll take advantage of a tool called GraphQL Code Generator to make things a little easier. As always, first we install dependencies:

`npm install --save-dev @graphql-codegen/cli @graphql-codegen/typescript-operations @graphql-codegen/typescript-react-apollo`

We’ll need to create some queries and mutations for the frontend to consume GraphQL. Create a folder named graphql with a file inside called operations.graphql:

```
query setList {
  allSets{
    id
    name
    numParts
    year
  }
}


mutation addSet($name: String!, $year: String!, $numParts: Int!) {
  addSet(name: $name, year: $year, numParts: $numParts) {
    id
    name
    numParts
    year
  }
}
```

To configure the code generator for React, we’ll create a file named codegen.yml in our React project:

```yaml
overwrite: true
schema: "apps/api/src/app/schema.graphql"
generates:
  apps/nx-apollo-react/src/app/generated/generated.tsx:
    documents: "apps/nx-apollo-react/**/*.graphql"
    plugins:
      - "typescript"
      - "typescript-operations"
      - "typescript-react-apollo"
    config:
      withHooks: true
```

This configuration will grab the GraphQL schema from the api project and the operations we just created in our React project and generate all of the needed types and hooks to consume the API. 

To actually run this code generator, we’ll add a new task to our React project in our workspace:

```json
// workspace.json

{
  "version": 1,
  "projects": {
    "nx-apollo-react": {
      ...
      "architect": {
        ...
        "generate": {
          "builder": "@nrwl/workspace:run-commands",
          "options": {
            "commands": [
              {
                "command": "npx graphql-codegen --config apps/nx-apollo-react/codegen.yml"
              }
            ]
          }
        }
      }
    },
    ...
}
```

Now we can run that using the Nx CLI:

`nx run nx-apollo-react:generate`

We should now have a folder called generated in our React project with a file named generated.ts. 

## Create React components
We now have all we need to start building our React components. We’ll create two: a list of Lego sets and a form to add a Lego set. We use the Nx CLI to build these:

`nx generate @schematics/react:component --name=SetList --project=nx-apollo-react`

`nx generate @schematics/react:component --name=SetForm --project=nx-apollo`

In the SetList component, add the following:

```typescript
// apps/nx-apollo-react/src/app/set-list/set-list.tsx

import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const ALL_SETS = gql`
  {
    allSets {
      name
      pieces
    }
  }
`;
import './set-list.css';
import { useSetListQuery } from '../generated/generated';

/* eslint-disable-next-line */
export interface SetListProps {}

export const SetList = (props: SetListProps) => {
  const { loading, error, data } = useSetListQuery();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <ul>
      {data.allSets.map(({ id, name, numParts, year }) => (
        <li key={id}>
          {year} - <strong>{name}</strong> ({numParts} parts)
        </li>
      ))}
    </ul>
  );
};

export default SetList;
```

```css
/* apps/nx-apollo-react/src/app/set-list/set-list.css */
ul {
  list-style: none;
  margin: 0;
  font-family: sans-serif;
  width: 100%;
}

li {
  padding: 8px;
}

li:nth-child(2n) {
  background-color: #eee;
}

span.year {
  display: block;
  width: 20%;
}
```

Notice how we’ve imported useSetListQuery. This is a hook genereated by GraphQL Code Generator that we’ll allow su to use the results of the SetList query we created earlier. This entire pipeline is typesafe, using the types generated for us.

Final step: bring those new components into our app component and add a little styling
```typescript
// apps/nx-apollo-react/src/app/app.tsx

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
```

```css
// apps/nx-apollo-react/src/app/app.css

h1 {
  font-family: sans-serif;
  text-align: center;
}

.flex {
  display: flex;
}

SetList {
  flex: 1;
  padding: 8px;
}
```

If your API isn’t running already, go ahead and start it:

`npm start api`

And now start your React app:

`npm start nx-apollo-react`

Browse to [http:localhost:4200](http:localhost:4200ß) and see the results of our work!

## Further Reading
NestJS
- [GraphQL Quick Start](https://docs.nestjs.com/graphql/quick-start)

Apollo Angular
- [Apollo Angular Client](https://www.apollographql.com/docs/angular/)

Apollo React
- [Apollo React Client](https://www.apollographql.com/docs/react/)

GraphQL Code Generator
- [Documentation](https://graphql-code-generator.com/)





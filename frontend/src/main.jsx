import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom"
import DotBackground from "./components/ui/DotBackground.jsx"
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql',
    cache: new InMemoryCache(),
    credentials: 'include'
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <DotBackground>
        <ApolloProvider client={client}>
        <App />
        </ApolloProvider>
    </DotBackground>
    </BrowserRouter>
  </StrictMode>,
)

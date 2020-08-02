import React from 'react';

// Styles

import {GlobalStyle, Wrapper} from './App.style';
import Trivia from './components/Trivia';


const App = () => {
  return (
    <>
    <GlobalStyle />
    <Wrapper>
      <Trivia />
    </Wrapper>
    </>
  );
}

export default App;

import React from 'react';
import { render } from 'react-dom';
import d3Scale from 'd3-scale';

import { XAxis, YAxis } from '../';

class App extends React.Component {
 render() {
   const margins = {
     top: 20,
     right: 20,
     left: 50,
     bottom: 50
   };

   return (
    <svg width="800px" height="600px">
      <g transform={`translate(${margins.left}, ${margins.top})`}>
        <XAxis
          scale={d3Scale.scaleLinear().range([0, 800 - (margins.right + margins.left)])}
          translate={{ x: 0, y: 600 - (margins.bottom + margins.top) }}
          orientation="bottom"
        />
        <YAxis
          scale={
            d3Scale.scaleLinear()
            .domain([200, 500])
            .range([600 - (margins.bottom + margins.top), 0])
          }
          orientation="left"
        />
      </g>
    </svg>
   );
 }
}

render(<App />, document.getElementById('app'));

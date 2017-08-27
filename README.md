# Processing.jsx

Your Sketch is Your React.

## [Example](https://mimorisuzuko.github.io/processing-jsx)

If you write a sketch as below in Processing, 

```java
void setup(){
  size(400, 400);
}

void draw(){
  background(255);
  fill(mousePressed ? color(255, 0, 0) : color(255));
  ellipse(mouseX, mouseY, 50, 50);
}
```

you can rewrite it by `processing-jsx`.

```jsx
import React from 'react';
import { render } from 'react-dom';
import { Processing, Sketch, Ellipse, Background, color } from './processing';

class App extends Processing {
	draw() {
		const { mouseX, mouseY, isMousePressed } = this;

		return (
			<Sketch width={400} height={400}>
				<Background color={color(255)} />
				<Ellipse x={mouseX} y={mouseY} width={50} height={50} fill={isMousePressed ? color(255, 0, 0) : color(255)} />
			</Sketch>
		);
	}
}

render(<App />, document.querySelector('main'));
```

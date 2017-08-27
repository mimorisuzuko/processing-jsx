import React from 'react';
import { Processing, Sketch, Ellipse, Background, color, render } from './processing';

class App extends Processing {
	draw() {
		const { state: { mouseX, mouseY, mousePressed } } = this;

		return (
			<Sketch width={400} height={400}>
				<Background color={color(255)} />
				<Ellipse x={mouseX} y={mouseY} width={50} height={50} fill={mousePressed ? color(255, 0, 0) : color(255)} />
			</Sketch>
		);
	}
}

render(<App />, document.querySelector('main'));

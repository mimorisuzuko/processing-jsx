import React from 'react';
import { render } from 'react-dom';
import { Processing, Sketch, Ellipse, Background, color } from './processing';

class App extends Processing {
	setup() {
		this.size(400, 400);
	}

	draw() {
		const { mouseX, mouseY, isMousePressed } = this;

		return (
			<Sketch>
				<Background color={color(255)} />
				<Ellipse x={mouseX} y={mouseY} width={50} height={50} fill={isMousePressed ? color(255, 0, 0) : color(255)} />
			</Sketch>
		);
	}
}

render(<App />, document.querySelector('main'));

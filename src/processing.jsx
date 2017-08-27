import React, { Component, cloneElement, Children } from 'react';
import findDOMNode from 'react-dom/lib/findDOMNode';
import autobind from 'autobind-decorator';

/**
 * @param {number[]} args
 * @returns {string}
 */
export const color = (...args) => {
	const [a, b, c, d] = args;

	switch (args.length) {
		case 1:
			return `rgb(${a}, ${a}, ${a})`;
		case 2:
			return `rgba(${a}, ${a}, ${a}, ${b})`;
		case 3:
			return `rgb(${a}, ${b}, ${c})`;
		case 4:
			return `rgba(${a}, ${b}, ${c}, ${d})`;
		default:
			throw new Error('the arguments is not applicable');
	}
};

export class Background extends Component {
	render() {
		const { props: { color, $canvas } } = this;
		const { width, height } = $canvas;
		const context = $canvas.getContext('2d');

		context.fillStyle = color;
		context.fillRect(0, 0, width, height);

		return null;
	}
}

export class Ellipse extends Component {
	render() {
		const { props: { x, y, width, height, fill, stroke, mode, strokeWeight, $canvas } } = this;
		const context = $canvas.getContext('2d');
		const { CORNER, CORNERS, RADIUS } = Ellipse;
		let cx = x;
		let cy = y;
		let rx = width / 2;
		let ry = height / 2;

		switch (mode) {
			case CORNER:
				cx -= rx;
				cy -= ry;
				break;
			case CORNERS:
				const cornersRadiusX = (rx - cx) / 2;
				const cornersRadiusY = (ry - cy) / 2;
				cx -= cornersRadiusX;
				cy -= cornersRadiusY;
				rx = cornersRadiusX;
				ry = cornersRadiusY;
				break;
			case RADIUS:
				rx = width;
				ry = width;
				break;
			default:
				break;
		}

		context.beginPath();
		context.fillStyle = fill;
		context.strokeStyle = stroke;
		context.lineWidth = strokeWeight;
		context.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
		context.fill();
		context.stroke();
		context.closePath();

		return null;
	}

	static get defaultProps() {
		return {
			fill: color(255),
			stroke: color(0),
			strokeWeight: 1
		};
	}

	static get CORNER() {
		return 0;
	}

	static get CORNERS() {
		return 1;
	}

	static get RADIUS() {
		return 2;
	}

	static get CENTER() {
		return 3;
	}
}

export class Sketch extends Component {
	constructor() {
		super();

		this.$canvas = null;
	}

	componentDidMount() {
		this.$canvas = findDOMNode(this);
	}

	render() {
		const { props: { width, height, children, onMouseDown, onMouseMove, onMouseUp }, $canvas } = this;

		return (
			<canvas width={width} height={height} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} style={{
				backgroundColor: color(204)
			}}>
				{$canvas ? Children.map(children, (child) => cloneElement(child, { $canvas })) : null}
			</canvas>
		);
	}

	static get defaultProps() {
		return {
			width: 100,
			height: 100
		};
	}
}

export class Processing extends Component {
	constructor() {
		super();

		this.pmouseX = 0;
		this.pmouseY = 0;
		this.mouseX = 0;
		this.mouseY = 0;
		this.frameCount = 0;
		this.isMousePressed = false;
	}

	componentDidMount() {
		this._frame();
	}

	draw() {
		return <Sketch />;
	}

	render() {
		this.frameCount += 1;

		return cloneElement(
			this.draw(),
			{
				onMouseDown: this._onMouseDown,
				onMouseMove: this._onMouseMove,
				onMouseUp: this._onMouseUp
			}
		);
	}

	@autobind
	_frame() {
		this.forceUpdate(() => setTimeout(this._frame, 1));
	}

	@autobind
	_onMouseDown() {
		this.isMousePressed = true;
		this._execf('mousePressed');
	}

	@autobind
	_onMouseUp() {
		this.isMousePressed = false;
		this._execf('mouseReleased');
	}

	/**
	 * @param {MouseEvent} e
	 */
	@autobind
	_onMouseMove(e) {
		const { mouseX, mouseY } = this;
		const { clientX, clientY, currentTarget } = e;
		const { left, top } = currentTarget.getBoundingClientRect();

		this.pmouseX = mouseX;
		this.pmouseY = mouseY;
		this.mouseX = clientX - left;
		this.mouseY = clientY - top;
		this._execf('mouseMoved');
	}

	/**
	 * @param {string} key
	 * @param {any[]} args
	 */
	_execf(key, ...args) {
		const f = this[key];

		if (typeof f === 'function') {
			f(...args);
		}
	}
}

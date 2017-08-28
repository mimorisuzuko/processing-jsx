import React, { Component, cloneElement, Children } from 'react';
import findDOMNode from 'react-dom/lib/findDOMNode';
import autobind from 'autobind-decorator';

export const CORNER = 0;
export const CORNERS = 1;
export const RADIUS = 2;
export const CENTER = 3;
export const MITER = 8;
export const BEVEL = 32;
export const ROUND = 2;
export const SQUARE = 1;
export const PROJECT = 4;

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

export class Rect extends Component {
	render() {
		const { props: { fill, stroke, strokeWeight, context2d, radius, mode, strokeJoin, strokeCap } } = this;
		let { props: { x, y, width, height, topLeftRadius, topRightRadius, bottomLeftRadius, bottomRightRadius } } = this;

		if (radius > 0) {
			topLeftRadius = radius;
			topRightRadius = radius;
			bottomLeftRadius = radius;
			bottomRightRadius = radius;
		}

		switch (mode) {
			case CORNERS:
				width = width - x;
				height = height - y;
				break;
			case RADIUS:
				width *= 2;
				height *= 2;
				x -= width / 2;
				y -= height / 2;
				break;
			case CENTER:
				x -= width / 2;
				y -= height / 2;
				break;
			default:
				break;
		}

		context2d.beginPath();
		switch (strokeJoin) {
			case BEVEL:
				context2d.lineJoin = 'bevel';
				break;
			case ROUND:
				context2d.lineJoin = 'round';
				break;
			default:
				context2d.lineJoin = 'miter';
				break;
		}
		switch (strokeCap) {
			case SQUARE:
				context2d.lineCap = 'butt';
				break;
			case PROJECT:
				context2d.lineCap = 'square';
				break;
			default:
				context2d.lineCap = 'round';
				break;
		}
		context2d.fillStyle = fill;
		context2d.strokeStyle = stroke;
		context2d.lineWidth = strokeWeight;
		context2d.moveTo(x + topLeftRadius, y);
		context2d.lineTo(x + width - topRightRadius, y);
		context2d.quadraticCurveTo(x + width, y, x + width, y + topRightRadius);
		context2d.lineTo(x + width, y + height - bottomRightRadius);
		context2d.quadraticCurveTo(x + width, y + height, x + width - bottomRightRadius, y + height);
		context2d.lineTo(x + bottomLeftRadius, y + height);
		context2d.quadraticCurveTo(x, y + height, x, y + height - bottomLeftRadius);
		context2d.lineTo(x, y + topLeftRadius);
		context2d.quadraticCurveTo(x, y, x + topLeftRadius, y);
		context2d.fill();
		context2d.stroke();
		context2d.closePath();

		return null;
	}

	static get defaultProps() {
		return {
			fill: color(255),
			stroke: color(0),
			strokeWeight: 1,
			radius: 0,
			topLeftRadius: 0,
			topRightRadius: 0,
			bottomLeftRadius: 0,
			bottomRightRadius: 0,
			strokeJoin: MITER
		};
	}
}

export class Line extends Component {
	render() {
		const { props: { x1, y1, x2, y2, stroke, strokeWeight, context2d } } = this;

		context2d.beginPath();
		context2d.strokeStyle = stroke;
		context2d.lineWidth = strokeWeight;
		context2d.moveTo(x1, y1);
		context2d.lineTo(x2, y2);
		context2d.stroke();
		context2d.closePath();

		return null;
	}

	static get defaultProps() {
		return {
			stroke: color(0),
			strokeWeight: 1
		};
	}
}

export class Background extends Component {
	render() {
		const { props: { color, $canvas, context2d } } = this;
		const { width, height } = $canvas;

		context2d.fillStyle = color;
		context2d.fillRect(0, 0, width, height);

		return null;
	}

	static get defaultProps() {
		return {
			color: color(204)
		};
	}
}

export class Ellipse extends Component {
	render() {
		const { props: { x, y, width, height, fill, stroke, mode, strokeWeight, context2d, strokeJoin, strokeCap } } = this;
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

		context2d.beginPath();
		switch (strokeJoin) {
			case BEVEL:
				context2d.lineJoin = 'bevel';
				break;
			case ROUND:
				context2d.lineJoin = 'round';
				break;
			default:
				context2d.lineJoin = 'miter';
				break;
		}
		switch (strokeCap) {
			case SQUARE:
				context2d.lineCap = 'butt';
				break;
			case PROJECT:
				context2d.lineCap = 'square';
				break;
			default:
				context2d.lineCap = 'round';
				break;
		}
		context2d.fillStyle = fill;
		context2d.strokeStyle = stroke;
		context2d.lineWidth = strokeWeight;
		context2d.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
		context2d.fill();
		context2d.stroke();
		context2d.closePath();

		return null;
	}

	static get defaultProps() {
		return {
			fill: color(255),
			stroke: color(0),
			strokeWeight: 1,
			strokeJoin: MITER
		};
	}
}

export class Sketch extends Component {
	constructor() {
		super();

		this.$canvas = null;
		this.context2d = null;
	}

	componentDidMount() {
		const $c = findDOMNode(this);
		this.$canvas = $c;
		this.context2d = $c.getContext('2d');
	}

	render() {
		const { props: { width, height, children, onMouseDown, onMouseMove, onMouseUp }, $canvas, context2d } = this;

		return (
			<canvas width={width} height={height} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} style={{
				backgroundColor: color(204)
			}}>
				{$canvas ? Children.map(children, (child) => cloneElement(child, { $canvas, context2d })) : null}
			</canvas>
		);
	}
}

export class Processing extends Component {
	constructor() {
		super();

		this.width = 100;
		this.height = 100;
		this.pmouseX = 0;
		this.pmouseY = 0;
		this.mouseX = 0;
		this.mouseY = 0;
		this.frameCount = 0;
		this.isMousePressed = false;
		this._canLoop = true;
		this._delay = 0;
		this.frameRate = 0;
		this._idealFrameRate = 1000 / 60;
		this._prevTime = Date.now();
	}

	componentDidMount() {
		this._loop();
		this.setup();
	}

	setup() {
	}

	draw() {
		return <Sketch />;
	}

	render() {
		const { width, height } = this;
		const sketch = this.draw();

		this.frameCount += 1;

		return cloneElement(
			sketch,
			{
				onMouseDown: this._onMouseDown,
				onMouseMove: this._onMouseMove,
				onMouseUp: this._onMouseUp,
				width,
				height
			}
		);
	}

	@autobind
	_loop() {
		const { _canLoop, _delay, _idealFrameRate, _prevTime } = this;
		const now = Date.now();

		this.frameRate = 1000 / (now - _prevTime);
		this._delay = 0;
		this._prevTime = now;

		if (_canLoop) {
			this.forceUpdate(() => setTimeout(this._loop, _idealFrameRate + _delay));
		} else {
			setTimeout(this._loop, _idealFrameRate + _delay);
		}
	}

	/**
	 * @param {number} ms
	 */
	delay(ms) {
		this._delay += ms;
	}

	/**
	 * @param {number} fps
	 */
	setFrameRate(fps) {
		this._idealFrameRate = 1000 / fps;
	}

	/**
	 * @param {number} width 
	 * @param {number} height 
	 */
	size(width, height) {
		this.width = width;
		this.height = height;
	}

	@autobind
	loop() {
		this._canLoop = true;
	}

	noLoop() {
		this._canLoop = false;
	}

	redraw() {
		this.forceUpdate();
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
		if (typeof this[key] === 'function') {
			this[key](...args);
		}
	}
}

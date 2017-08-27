import React, { Component, cloneElement, Children } from 'react';
import { render as reactRender, findDOMNode } from 'react-dom';
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
	/**
	 * @param {{}} props
	 * @param {HTMLCanvasElement} $canvas
	 */
	static draw(props, $canvas) {
		const { color } = props;
		const { width, height } = $canvas;
		const context = $canvas.getContext('2d');

		context.fillStyle = color;
		context.fillRect(0, 0, width, height);
	}
}

export class Ellipse extends Component {
	/**
	 * @param {{}} props
	 * @param {HTMLCanvasElement} $canvas
	 */
	static draw(props, $canvas) {
		const context = $canvas.getContext('2d');
		const { x, y, width, height, fill, stroke, mode, strokeWeight } = props;
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

		if ($canvas) {
			Children.map(children, (child) => {
				child.type.draw(child.props, $canvas);
			});
		}

		return (
			<canvas width={width} height={height} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} style={{
				backgroundColor: color(204)
			}} />
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

		this.state = {
			pmouseX: 0,
			pmouseY: 0,
			mouseX: 0,
			mouseY: 0,
			frameCount: 0,
			mousePressed: false
		};
	}

	componentDidMount() {
		this._frame();
	}

	draw() {
		return <Sketch />;
	}

	render() {
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
		const { state: { frameCount } } = this;

		this.setState({ frameCount: frameCount + 1 }, () => {
			setTimeout(this._frame, 1);
		});
	}

	@autobind
	_onMouseDown() {
		this.setState({ mousePressed: true });
		this._execf('mousePressed');
	}

	@autobind
	_onMouseUp() {
		this.setState({ mousePressed: false });
		this._execf('mouseReleased');
	}

	/**
	 * @param {MouseEvent} e
	 */
	@autobind
	_onMouseMove(e) {
		const { state: { mouseX, mouseY } } = this;
		const { clientX, clientY, currentTarget } = e;
		const { left, top } = currentTarget.getBoundingClientRect();

		this._execf('mouseMoved');
		this.setState({
			pmouseX: mouseX,
			pmouseY: mouseY,
			mouseX: clientX - left,
			mouseY: clientY - top
		});
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

export const render = reactRender;

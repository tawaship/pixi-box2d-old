import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import buble from '@rollup/plugin-buble';
import { terser } from 'rollup-plugin-terser';
import del from 'del';

const conf = require('./package.json');
const version = conf.version;
const pixi = conf.dependencies['pixi.js'].replace('^', '');

const banner = [
	'/*!',
	` * pixi-box2d - v${version}`,
	' * ',
	` * @require pixi.js v${pixi}`,
	' * @require Box2d.js',
	' * @author tawaship (makazu.mori@gmail.com)',
	' * @license MIT',
	' */',
	''
].join('\n');

export default (async () => {
	if (process.env.PROD) {
		await del(['./docs/', './dist/']);
	}
	
	return [
		{
			input: 'src/index.ts',
			output: [
				{
					banner,
					file: 'dist/pixi-box2d.js',
					format: 'iife',
					name: 'PIXI.box2d',
					sourcemap: true,
					extend: true,
					globals: {
						'pixi.js': 'PIXI',
						'box2dweb': 'Box2D'
					}
				}
			],
			external: ['pixi.js', 'box2dweb'],
			plugins: [
				nodeResolve(),
				commonjs(),
				typescript({tsconfig: 'tsconfig.json'}),
				buble(),
				terser({
					compress: {
						//drop_console: true
						//pure_funcs: ['console.log']
					},
					mangle: false,
					output: {
						beautify: true,
						braces: true
					}
				})
			]
		},
		{
			input: 'src/index.ts',
			output: [
				{
					banner,
					file: 'dist/pixi-box2d.min.js',
					format: 'iife',
					name: 'PIXI.box2d',
					sourcemap: true,
					extend: true,
					globals: {
						'pixi.js': 'PIXI',
						'box2dweb': 'Box2D'
					},
					compact: true
				}
			],
			external: ['pixi.js', 'box2dweb'],
			plugins: [
				nodeResolve(),
				commonjs(),
				typescript({tsconfig: 'tsconfig.json'}),
				buble(),
				terser({
					compress: {
						//drop_console: true,
						pure_funcs: ['console.log']
					}
				})
			]
		}
	]
})();
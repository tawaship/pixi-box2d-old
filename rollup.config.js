import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import buble from '@rollup/plugin-buble';
import { terser } from 'rollup-plugin-terser';
import del from 'del';

const conf = require('./package.json');
const version = conf.version;
const pixi = conf.dependencies['pixi.js'].replace('^', '');
const pixim = conf.dependencies['@tawaship/pixim.js'].replace('^', '');

const pixi_banner = [
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

const pixim_banner = [
	'/*!',
	` * Pixim-box2d - v${version}`,
	' * ',
	` * @require pixi.js v${pixi}`,
	` * @require @tawaship/pixim.js v${pixim}`,
	' * @require Box2d.js',
	' * @author tawaship (makazu.mori@gmail.com)',
	' * @license MIT',
	' */',
	''
].join('\n');

export default (async () => {
	if (process.env.PROD) {
		await del(['./docs/pixi/', './docs/pixim/', './dist/']);
	}
	
	return [
		{
			input: 'src/pixim/index.ts',
			output: [
				{
					banner: pixim_banner,
					file: 'dist/Pixim-box2d.js',
					format: 'iife',
					name: 'Pixim.box2d',
					sourcemap: true,
					extend: true,
					globals: {
						'pixi.js': 'PIXI',
						'@tawaship/pixim.js': 'Pixim',
						'box2dweb': 'Box2D'
					}
				}
			],
			external: ['pixi.js', '@tawaship/pixim.js', 'box2dweb'],
			plugins: [
				require("rollup-plugin-replace")({
					"process.env.HOGE": JSON.stringify("gmoge")
				}),
				nodeResolve(),
				commonjs(),
				typescript({tsconfig: 'tsconfig.pixim.json'}),
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
		}/*,
		{
			input: 'src/pixim/index.ts',
			output: [
				{
					banner: pixim_banner,
					file: 'dist/Pixim-box2d.min.js',
					format: 'iife',
					name: 'Pixim.box2d',
					sourcemap: true,
					extend: true,
					globals: {
						'pixi.js': 'PIXI',
						'@tawaship/pixim.js': 'Pixim',
						'box2dweb': 'Box2D'
					},
					compact: true
				}
			],
			external: ['pixi.js', '@tawaship/pixim.js', 'box2dweb'],
			plugins: [
				nodeResolve(),
				commonjs(),
				typescript({tsconfig: 'tsconfig.pixim.json'}),
				buble(),
				terser({
					compress: {
						//drop_console: true,
						pure_funcs: ['console.log']
					}
				})
			]
		},
		{
			input: 'src/pixi/index.ts',
			output: [
				{
					banner: pixim_banner,
					file: 'dist/pixi-box2d.js',
					format: 'iife',
					name: 'PIXI.animate',
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
				typescript({tsconfig: 'tsconfig.pixi.json'}),
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
			input: 'src/pixi/index.ts',
			output: [
				{
					banner: pixim_banner,
					file: 'dist/pixi-box2d.min.js',
					format: 'iife',
					name: 'PIXI.animate',
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
				typescript({tsconfig: 'tsconfig.pixi.json'}),
				buble(),
				terser({
					compress: {
						//drop_console: true,
						pure_funcs: ['console.log']
					}
				})
			]
		}*/
	]
})();
// @ts-check
import { visit } from 'unist-util-visit';

// 阅读速度基准（文献）：
// - 中文默读约 390–400 字/分钟（Pan & Yan 2024，与 Brysbaert 2019 中文元分析一致）
// - 英文默读（非虚构）约 238 词/分钟（Brysbaert 2019，190 项研究元分析）
const CJK_CHARS_PER_MIN = 400;
const LATIN_WORDS_PER_MIN = 238;
// 代码/公式无通行基准，按正文一半的速率估算扫读+理解时间
const CODE_CHARS_PER_MIN = 200;
// 图片停留时间采用 Medium 模型：首张 12s，逐张递减 1s，最低 3s
const IMAGE_FIRST_SECONDS = 12;
const IMAGE_MIN_SECONDS = 3;

const CJK = /[぀-ヿ㐀-䶿一-鿿豈-﫿ﬀ-￯]/g;

/** 统计 AST 中除代码外的纯文本，拆分为 CJK 字符数与拉丁词数 */
function countText(tree) {
	let text = '';
	visit(tree, 'text', (node) => {
		text += `${node.value} `;
	});
	const cjkChars = (text.match(CJK) ?? []).length;
	const latinWords = text.replace(CJK, ' ').split(/\s+/).filter(Boolean).length;
	return { cjkChars, latinWords };
}

/** 代码块、行内代码与数学公式按字符数计量 */
function countCodeChars(tree) {
	let chars = 0;
	visit(tree, (node) => {
		if (
			(node.type === 'code' ||
				node.type === 'inlineCode' ||
				node.type === 'math' ||
				node.type === 'inlineMath') &&
			typeof node.value === 'string'
		) {
			chars += node.value.length;
		}
	});
	return chars;
}

/** Medium 模型：图片总停留秒数 */
function imageSeconds(tree) {
	let count = 0;
	visit(tree, (node) => {
		if (node.type === 'image' || node.type === 'imageReference') count++;
	});
	let total = 0;
	for (let i = 0; i < count; i++) {
		total += Math.max(IMAGE_MIN_SECONDS, IMAGE_FIRST_SECONDS - i);
	}
	return total;
}

/** 把阅读时长（分钟）写入 frontmatter 的 minutesRead 字段 */
export function remarkReadingTime() {
	return (tree, { data }) => {
		const { cjkChars, latinWords } = countText(tree);
		const minutes =
			cjkChars / CJK_CHARS_PER_MIN +
			latinWords / LATIN_WORDS_PER_MIN +
			countCodeChars(tree) / CODE_CHARS_PER_MIN +
			imageSeconds(tree) / 60;
		data.astro.frontmatter.minutesRead = Math.max(1, Math.ceil(minutes));
	};
}

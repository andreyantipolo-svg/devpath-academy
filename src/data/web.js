// HTML & CSS tasks are graded by DOM assertions that run inside a sandboxed iframe.
const q = (sel) => `document.querySelector('${sel}')`;
const cs = (sel, prop) => `getComputedStyle(${q(sel)}).${prop}`;

export default {
  id: 'web',
  title: 'HTML & CSS',
  hue: '#E879C6',
  icon: 'layout',
  langs: ['html'],
  blurb: 'Build and style web pages. See a live preview as you type and get checked against real browser rules.',
  levels: [
    {
      id: 'beginner',
      lessons: [
        {
          id: 'web-tags',
          title: 'HTML structure',
          xp: 50,
          theory: `HTML describes the **structure** of a page with nested **elements**. An element is an opening tag, content, and a closing tag: \`<p>Hello</p>\`.

- \`<h1>\` to \`<h6>\`: headings, \`<h1>\` being the most important
- \`<p>\`: a paragraph
- Elements nest inside each other and close in reverse order of opening.`,
          example: '<h1>DevPath Academy</h1>\n<p>Welcome to learning.</p>',
          quiz: [
            { q: 'Which tag is the top-level heading of a page?', o: ['<h6>', '<head>', '<h1>', '<header>'], a: 2, why: '`<h1>` is the most important heading.' },
            { q: 'Which tag makes a paragraph?', o: ['<p>', '<para>', '<text>', '<pg>'], a: 0, why: '`<p>` wraps a paragraph of text.' },
          ],
          task: {
            text: 'Add an `<h1>` that says `My Trail`, followed by a `<p>` that says `Learning to code.`',
            starter: '<!-- Write your HTML below -->\n',
            dom: [
              { desc: 'There is an <h1> reading "My Trail"', test: `${q('h1')} && ${q('h1')}.textContent.trim() === 'My Trail'` },
              { desc: 'There is a <p> reading "Learning to code."', test: `${q('p')} && ${q('p')}.textContent.trim() === 'Learning to code.'` },
              { desc: 'The heading comes before the paragraph', test: `${q('h1')} && ${q('p')} && (${q('h1')}.compareDocumentPosition(${q('p')}) & Node.DOCUMENT_POSITION_FOLLOWING) > 0` },
            ],
            hints: ['Open with <h1> and close with </h1>.', 'Put the paragraph on the next line with <p> … </p>.', '<h1>My Trail</h1>\n<p>Learning to code.</p>'],
            solution: '<h1>My Trail</h1>\n<p>Learning to code.</p>',
          },
        },
        {
          id: 'web-lists-links',
          title: 'Lists & links',
          xp: 75,
          theory: `Lists group related items: \`<ul>\` is a bulleted list, \`<ol>\` is numbered, and each item is an \`<li>\`.

Links use the anchor tag: \`<a href="https://example.com">Visit</a>\`. The \`href\` attribute holds the destination and the text between the tags is what people click.

Images use \`<img src="..." alt="description">\`. Always write an \`alt\` so screen readers can describe the picture.`,
          example: '<ul>\n  <li>HTML</li>\n  <li>CSS</li>\n</ul>\n<a href="https://example.com">Visit</a>',
          quiz: [
            { q: 'Which tag creates one bullet inside a list?', o: ['<item>', '<li>', '<bullet>', '<ul>'], a: 1, why: '`<li>` is a list item and lives inside `<ul>` or `<ol>`.' },
            { q: 'Which attribute holds the destination of a link?', o: ['src', 'link', 'href', 'url'], a: 2, why: '`href` (hypertext reference) is the link target.' },
          ],
          task: {
            text: 'Build a `<ul>` with exactly three `<li>` items, then a link to `https://example.com` with the text `Visit`.',
            starter: '<!-- a list with three items and a link -->\n',
            dom: [
              { desc: 'A <ul> exists', test: `!!${q('ul')}` },
              { desc: 'The list has exactly 3 items', test: `document.querySelectorAll('ul > li').length === 3` },
              { desc: 'A link points to https://example.com', test: `!!${q('a')} && ${q('a')}.getAttribute('href') === 'https://example.com'` },
              { desc: 'The link text is "Visit"', test: `!!${q('a')} && ${q('a')}.textContent.trim() === 'Visit'` },
            ],
            hints: ['Each bullet is <li>text</li> inside <ul> … </ul>.', 'The link is <a href="...">text</a>.', '<ul><li>One</li><li>Two</li><li>Three</li></ul>\n<a href="https://example.com">Visit</a>'],
            solution: '<ul>\n  <li>One</li>\n  <li>Two</li>\n  <li>Three</li>\n</ul>\n<a href="https://example.com">Visit</a>',
          },
        },
        {
          id: 'web-css',
          title: 'Styling with CSS',
          xp: 75,
          theory: `CSS controls how elements look. A rule has a **selector** and **declarations**:

\`\`\`
h1 { color: tomato; }
.note { font-size: 20px; }
\`\`\`

- \`h1\` selects every heading; \`.note\` selects elements with \`class="note"\`
- Put CSS in a \`<style>\` tag inside your HTML.
- Every declaration is \`property: value;\``,
          example: '<style>\n  h1 { color: teal; }\n</style>\n<h1>Styled</h1>',
          quiz: [
            { q: 'How do you select elements with class="note" in CSS?', o: ['note { }', '.note { }', '#note { }', '*note { }'], a: 1, why: 'A dot selects by class; a hash selects by id.' },
            { q: 'Which CSS property changes text colour?', o: ['font-color', 'text-color', 'color', 'foreground'], a: 2, why: 'Just `color`. `background-color` is the one for backgrounds.' },
          ],
          task: {
            text: 'Add a `<style>` block so the `h1` is `tomato` and the paragraph with class `note` has a `font-size` of `20px`.',
            starter: '<style>\n  /* your CSS here */\n</style>\n\n<h1>Trail notes</h1>\n<p class="note">Remember to practise daily.</p>\n',
            dom: [
              { desc: 'The h1 colour is tomato', test: `${cs('h1', 'color')} === 'rgb(255, 99, 71)'` },
              { desc: 'The .note font size is 20px', test: `${cs('.note', 'fontSize')} === '20px'` },
            ],
            hints: ['Two rules: one for h1, one for .note.', 'h1 { color: tomato; }', '.note { font-size: 20px; }'],
            solution: '<style>\n  h1 { color: tomato; }\n  .note { font-size: 20px; }\n</style>\n\n<h1>Trail notes</h1>\n<p class="note">Remember to practise daily.</p>',
          },
        },
      ],
      capstone: {
        id: 'web-cap-1',
        title: 'Capstone: Profile card',
        summary: 'Structure and styling combined into a small, real component.',
        task: {
          text: 'Build a profile card: a `<div class="card">` containing an `<h2>` with a name and a `<p>` with a short bio. Style `.card` with `16px` padding, a `12px` border radius, and a `#f0f4ff` background.',
          starter: '<style>\n  /* style .card */\n</style>\n\n<!-- the card goes here -->\n',
          dom: [
            { desc: 'A .card contains an <h2> with text', test: `!!${q('.card h2')} && ${q('.card h2')}.textContent.trim().length > 0` },
            { desc: 'A .card contains a <p> with text', test: `!!${q('.card p')} && ${q('.card p')}.textContent.trim().length > 0` },
            { desc: '.card has 16px padding', test: `${cs('.card', 'paddingTop')} === '16px' && ${cs('.card', 'paddingLeft')} === '16px'` },
            { desc: '.card has a 12px border radius', test: `${cs('.card', 'borderTopLeftRadius')} === '12px'` },
            { desc: '.card background is #f0f4ff', test: `${cs('.card', 'backgroundColor')} === 'rgb(240, 244, 255)'` },
          ],
          hints: ['Build the HTML first, then style it.', 'Padding, border-radius and background-color are the three properties.', '.card { padding: 16px; border-radius: 12px; background: #f0f4ff; }'],
          solution: '<style>\n  .card { padding: 16px; border-radius: 12px; background: #f0f4ff; }\n</style>\n\n<div class="card">\n  <h2>Ana Reyes</h2>\n  <p>Front-end learner who loves coffee and CSS.</p>\n</div>',
        },
      },
    },
    {
      id: 'intermediate',
      lessons: [
        {
          id: 'web-flex',
          title: 'Flexbox layout',
          xp: 100,
          theory: `Flexbox lays children out in a row (or column) and handles spacing for you. Turn it on for the **container**:

\`\`\`
.row { display: flex; gap: 16px; }
\`\`\`

- \`gap\`: space between children
- \`justify-content\`: distribution along the main axis (\`space-between\`, \`center\`, \`flex-end\`)
- \`align-items\`: alignment on the cross axis (\`center\`, \`stretch\`)`,
          example: '<style>\n  .row { display: flex; gap: 8px; }\n</style>\n<div class="row"><div>A</div><div>B</div></div>',
          quiz: [
            { q: 'Which declaration turns an element into a flex container?', o: ['flex: on;', 'display: flex;', 'layout: flex;', 'position: flex;'], a: 1, why: 'Flexbox is activated with `display: flex`.' },
            { q: 'Which property spaces items along the main axis?', o: ['align-items', 'justify-content', 'flex-wrap', 'gap-x'], a: 1, why: '`justify-content` controls distribution along the main axis.' },
          ],
          task: {
            text: 'Make `.row` a flex container with a `16px` gap, items centred vertically (`align-items: center`) and spread apart with `justify-content: space-between`.',
            starter: '<style>\n  .row { /* your flex rules */ }\n  .box { padding: 12px; background: #dde3ff; }\n</style>\n\n<div class="row">\n  <div class="box">One</div>\n  <div class="box">Two</div>\n  <div class="box">Three</div>\n</div>\n',
            dom: [
              { desc: '.row is display: flex', test: `${cs('.row', 'display')} === 'flex'` },
              { desc: 'The gap is 16px', test: `${cs('.row', 'columnGap')} === '16px'` },
              { desc: 'align-items is center', test: `${cs('.row', 'alignItems')} === 'center'` },
              { desc: 'justify-content is space-between', test: `${cs('.row', 'justifyContent')} === 'space-between'` },
            ],
            hints: ['All four declarations go inside the .row rule.', 'display: flex; comes first.', '.row { display: flex; gap: 16px; align-items: center; justify-content: space-between; }'],
            solution: '<style>\n  .row { display: flex; gap: 16px; align-items: center; justify-content: space-between; }\n  .box { padding: 12px; background: #dde3ff; }\n</style>\n\n<div class="row">\n  <div class="box">One</div>\n  <div class="box">Two</div>\n  <div class="box">Three</div>\n</div>',
          },
        },
        {
          id: 'web-responsive',
          title: 'Responsive design',
          xp: 125,
          theory: `Pages must work on phones and desktops. **Media queries** apply rules only when a condition is true:

\`\`\`
.box { width: 100%; }
@media (min-width: 600px) {
  .box { width: 50%; }
}
\`\`\`

Design **mobile first**: write the small-screen style as the default, then add \`min-width\` queries to enhance larger screens. Percentages and \`max-width\` help content flex without breaking.`,
          example: '<style>\n  .box { width: 100%; }\n  @media (min-width: 600px) { .box { width: 50%; } }\n</style>\n<div class="box">Hi</div>',
          quiz: [
            { q: 'What does `@media (min-width: 600px)` mean?', o: ['Apply when the screen is at least 600px wide', 'Apply when the screen is at most 600px wide', 'Make the element 600px wide', 'Hide content below 600px'], a: 0, why: '`min-width` means "this wide or wider".' },
            { q: 'What does "mobile first" mean?', o: ['Only design for phones', 'Write the small-screen styles first, then add rules for larger screens', 'Use pixel units only', 'Hide the desktop layout'], a: 1, why: 'The base CSS targets small screens; media queries layer on top.' },
          ],
          task: {
            text: 'Make `.box` full width by default, but exactly half of its parent when the viewport is at least `600px` wide (the test frame is 800px wide). Use a media query.',
            starter: '<style>\n  .box { background: #dde3ff; padding: 12px; box-sizing: border-box; }\n  /* width rules + media query */\n</style>\n\n<div class="box">Resize me</div>\n',
            dom: [
              { desc: 'The CSS contains a @media rule', test: `[...document.styleSheets].some(s => [...s.cssRules].some(r => r.type === CSSRule.MEDIA_RULE))` },
              { desc: 'At 800px wide, .box is half of its parent', test: `Math.abs(${q('.box')}.getBoundingClientRect().width - ${q('.box')}.parentElement.getBoundingClientRect().width * 0.5) < 2` },
            ],
            hints: ['Set the default width first: width: 100%;', 'Add @media (min-width: 600px) { … } after it.', '@media (min-width: 600px) { .box { width: 50%; } }'],
            solution: '<style>\n  .box { background: #dde3ff; padding: 12px; box-sizing: border-box; width: 100%; }\n  @media (min-width: 600px) { .box { width: 50%; } }\n</style>\n\n<div class="box">Resize me</div>',
          },
        },
      ],
      capstone: {
        id: 'web-cap-2',
        title: 'Capstone: Pricing plans',
        summary: 'A three-column pricing row with a highlighted plan, the classic landing page section.',
        task: {
          text: 'Build `<div class="plans">` holding three `<div class="plan">` cards. Each has an `<h3>` and a `<p class="price">`. Make `.plans` a flex row with a `16px` gap, and give exactly one plan the extra class `featured` with a `2px solid` border in `#4f46e5`.',
          starter: '<style>\n  /* .plans, .plan, .featured */\n</style>\n\n<!-- three plan cards -->\n',
          dom: [
            { desc: 'There are exactly 3 .plan cards inside .plans', test: `document.querySelectorAll('.plans > .plan').length === 3` },
            { desc: 'Every plan has an <h3> and a .price', test: `[...document.querySelectorAll('.plan')].every(p => p.querySelector('h3') && p.querySelector('.price'))` },
            { desc: '.plans is a flex row with a 16px gap', test: `${cs('.plans', 'display')} === 'flex' && ${cs('.plans', 'columnGap')} === '16px'` },
            { desc: 'Exactly one plan is .featured', test: `document.querySelectorAll('.plan.featured').length === 1` },
            { desc: 'The featured plan has a 2px #4f46e5 border', test: `${cs('.featured', 'borderTopWidth')} === '2px' && ${cs('.featured', 'borderTopStyle')} === 'solid' && ${cs('.featured', 'borderTopColor')} === 'rgb(79, 70, 229)'` },
          ],
          hints: ['Write the HTML for one card, then copy it twice.', 'Put display: flex and gap on .plans, not on .plan.', '.featured { border: 2px solid #4f46e5; }'],
          solution: '<style>\n  .plans { display: flex; gap: 16px; }\n  .plan { flex: 1; padding: 16px; border: 1px solid #ccc; }\n  .featured { border: 2px solid #4f46e5; }\n</style>\n\n<div class="plans">\n  <div class="plan"><h3>Free</h3><p class="price">$0</p></div>\n  <div class="plan featured"><h3>Pro</h3><p class="price">$9</p></div>\n  <div class="plan"><h3>Team</h3><p class="price">$29</p></div>\n</div>',
        },
      },
    },
  ],
};

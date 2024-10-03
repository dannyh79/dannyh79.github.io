---
title: 'How to Write Resilient CSS'
createdAt: 2020-04-11 17:45:38 +0800
publishedAt: 2020-04-11
categories: [css]
---

This is my summary for a YouTube series, [Resilient CSS](https://www.youtube.com/watch?v=u00FY9vADfQ&list=PLbSquHt1VCf1kpv9WRGMCA9_Nn4vCLZ9Y).

## TLDR

- Look up the stats of browser usage by region to define your device/browser support
  - Consult [caniuse.com](https://caniuse.com/), [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS), [Bugzilla](https://www.bugzilla.org/), etc.
  - Browser usage can be measured by country in caniuse.com
- "What will happen if I were to cross out that line of CSS?"
- Use well-supported property/value as fallback
- I am not sure if the principles can be applied to Atomic CSS

### "How Browsers Handle Errors in CSS"

Mindset for writing CSS that supports every browser

> "What happens if I were to cross out that line of CSS?"

Since unsupported/misspelled CSS properties are just NOT applied, comment the code out to mimic the experience when the property is not supported by the browser.

### "Unlocking the Power of CSS Overrides - Small Tweaks"

> The important thing here is to be able to read the article and get some of the feeling of graphics of the article. And every user is going to get that with this code.

```html
<header>
  <h1>Some Header</h1>
</header>
```

```scss
// Comment out the code
// to see the layout when some properties are not supported
header {
  display: flex; // <-
  height: 100vh; // <-
}

// Also center elements vertically once `flex` is applied!
h1 {
  margin: auto;
}
```

#### Use Well-Supported Property/Value as Fallback

```scss
header {
  display: flex;

  // Serves as fallback support for ALL browser
  height: 500px;

  height: 100vh;
}
```

#### If the Browser Supports One Property but not the Other

```scss
// If flexbox is not supported, we can still apply
// to deliver slightly-different experience
h1 {
  padding: 2em 0;
  margin: auto;
}
```

### "Feature Queries"

#### Syntax

```scss
// Syntax
@supports (foo: value) {
  // some code
}

// Using "or"
@supports (foo: value) or (bar: value) {
  // some code
}

// Using "and"
@supports (foo: value) and (bar: value) {
  // some code
}

// Using "not" (not suggested)
// The code block could be skipped,
// as not all browsers understand feature queries
@supports not (foo: value) {
  // some code
}
```

#### Example

```scss
@supports (initial-letter: 4) or (-webkit-initial-letter: 4) {
  p::first-letter {
    color: rgba(255, 190, 150, 0, 0.9);
    font-weight: bold;
    margin-right: 0.5em;
    -webkit-initial-letter: 4;
    initial-letter: 4;
  }
}
```

#### One Way to Use Feature Query

Take `display: grid;{:css}` for Example:

1. Figure out how HTML content will be should there be no CSS at all. This is to make sure HTML markup is solid in the first place.
2. Write CSS without grid layout
3. Write CSS with grid layout in feature query, knowing that your CSS will be awesome ;)

### "Making Your CSS Fail Excellently"

```html
<h1>Some Title</h1>
<img />
```

#### Example 1 - Might Explode

When fails, it delivers completely different experience.

```scss
h1 {
  // Not well-supported
  writing-mode: sideways-lr;
}
```

#### Example 2 - Use Fallback Properties

If fails, it gives a some-what different experience.

```scss
h1 {
  // Supported in most browsers
  writing-mode: vertical-rl;

  // Not well-supported
  writing-mode: sideways-lr;
}
```

#### Example 3 - Use Well-Supported Properties Only

Maybe the failure isn't worth it. Use properties that are well-supported to achieve the same goal.

```scss
h1 {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  text-align: right;
  text-orientation: sideways;
}
```

## References

- [Resilient CSS: 7-part Series](https://www.youtube.com/watch?v=u00FY9vADfQ&list=PLbSquHt1VCf1kpv9WRGMCA9_Nn4vCLZ9Y) on [Layout Land](https://www.youtube.com/channel/UC7TizprGknbDalbHplROtag)

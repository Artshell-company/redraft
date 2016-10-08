
# Redraft
Renders the result of Draft.js convertToRaw using provided callbacks, works well with React

[![Version](https://img.shields.io/npm/v/redraft.svg?style=flat-square)](https://www.npmjs.com/package/redraft)
[![Build Status](https://img.shields.io/travis/lokiuz/redraft/master.svg?style=flat-square)](https://travis-ci.org/lokiuz/redraft)
[![David](https://img.shields.io/david/lokiuz/redraft.svg?style=flat-square)](https://david-dm.org/lokiuz/redraft)

## What does it do?
It can convert whole raw state or just specific parts to desired output like React components or an html string.

Additionally you could just parse the raw using provided RawPraser to get a nested structure for a specific block.

## Install
``` sh
$ npm install --save redraft
```

## Example rendering to React

Define all the extra bits:
``` js
/**
 *  You can use inline styles or classNames inside your callbacks
 */
const styles = {
  code: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
  codeBlock: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 20,
  },
};


// just a helper to add a <br /> after a block
const addBreaklines = (children) => children.map(child => [child, <br />]);


/**
 * Define the renderers
 */
const renderers = {
  /**
   * Those callbacks will be called recursively to render a nested structure
   */
  inline: {
    BOLD: (children) => <strong>{children}</strong>,
    ITALIC: (children) => <em>{children}</em>,
    UNDERLINE: (children) => <u>{children}</u>,
    CODE: (children) => <span style={styles.code}>{children}</span>,
  },
  /**
   * Blocks receive children and depth
   * Note that children are an array of blocks with same styling,
   */
  blocks: {
    unstyled: (children) => children.map(child => <p>{child}</p>),
    blockquote: (children) => <blockquote >{addBreaklines(children)}</blockquote>,
    'header-one': (children) => children.map(child => <h1>{child}</h1>),
    'header-two': (children) => children.map(child => <h2>{child}</h2>),
    // You can also access the original keys of the blocks
    'code-block': (children, depth, { keys }) => <pre style={styles.codeBlock} key={keys[0]} >{addBreaklines(children)}</pre>,
    'unordered-list-item': (children, depth, { keys }) => <ul key={keys[keys.length - 1]} class={`ul-level-${depth}`}>{children.map(child => <li>{child}</li>)}</ul>,
    'ordered-list-item': (children, depth, { keys }) => <ol key={keys.join('|')} class={`ol-level-${depth}`}>{children.map((child, index)=> <li key={keys[index]}>{child}</li>)}</ol>,
    // If your blocks use meta data it can also be accessed like keys
    atomic: (children, depth, { keys, data }) => children.map((child, i) => <Atomic key={keys[i] {...data[i]} />),
  },
  /**
   * Entities receive children and the entity data
   */
  entities: {
    LINK: (children, data) => <Link to={data.url}>{children}/>,
  },
}

```

Now what is needed is a simple renderer component to wrap it all.
```js
export default class Renderer extends Component {

  static propTypes = {
    raw: PropTypes.object
  }

  renderWarning() {
    return <div>Nothing to render.</div>;
  }

  render() {
    const { raw } = this.props;
    if (!raw) {
      return this.renderWarning();
    }
    const rendered = redraft(raw, renderers);
    // redraft returns a null if there's nothing to render
    if (!rendered) {
      return this.renderWarning();
    }
    return (
      <div>
        {rendered}
      </div>
    );
  }
}
```

## API changes in 0.3.0
Redraft now exports a default function - this is the recommended way to import the render method.
Additionally renderers should now be passed as a single object containing `inline`, `blocks` and `entities`

Previous api is deprecated and will log warnings if `NODE_ENV` is not set to `production`, and will be removed in next minor version.

## API
```js
redraft(Object:raw, Object:renderers)
```
Returns an array of rendered blocks.
- raw - result of the Draft.js convertToRaw
- renderers - object with 3 groups of renders inline, blocks and entities refer to example for more info

```js
RawParser.parse(block)
```
Parses the provided block and returns an ContentNode object

```js
renderNode(Object:node, Object:inlineRendrers, Object:entityRenderers, Object:entityMap)
```
Returns an rendered single block.
- node - ContentNode from `RawParser.parse(block)` method
- inlineRendrers, entityRenderers - callbacks
- entityMap - the entityMap from raw state `raw.entityMap`

## Changelog
The changelog is avalible here [CHANGELOG](CHANGELOG.md)


## Credits
- [backdraft-js](https://github.com/evanc/backdraft-js) - For providing a general method of parsing raw state
- [Draft.js](https://facebook.github.io/draft-js) - Well for Draft

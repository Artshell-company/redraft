import React, { PropTypes } from 'react';
import redraft from '../../../lib';
import AtomicBlock from '../AtomicBlock/AtomicBlock';
import List from '../List/List';

import './Preview.css';

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

const inline = {
  BOLD: children => <strong>{children}</strong>,
  ITALIC: children => <em>{children}</em>,
  UNDERLINE: children => <u>{children}</u>,
  CODE: children => <span style={styles.code}>{children}</span>,
};


const addBreaklines = children => children.map(child => [child, <br />]);

const getList = ordered =>
  (children, depth, { keys }) => (
    <List key={keys[0]} keys={keys} depth={depth} ordered={ordered}>
      {children.map((child, i) => <li key={keys[i]} >{child}</li>)}
    </List>
  );

const getAtomic = (children, _, { data, keys }) => data.map(
  (item, i) => <AtomicBlock key={keys[i]} {...data[i]} />
);

/**
 * Note that children can be maped to render a list or do other cool stuff
 */
const blocks = {
  unstyled: (children, _, { keys }) => <p key={keys[0]}>{addBreaklines(children)}</p>,
  atomic: getAtomic,
  blockquote:
    (children, _, { keys }) => <blockquote key={keys[0]} >{addBreaklines(children)}</blockquote>,
  'header-one': (children, _, { keys }) => children.map((child, i) => <h1 key={keys[i]}>{child}</h1>),
  'header-two': (children, _, { keys }) => children.map((child, i) => <h2 key={keys[i]}>{child}</h2>),
  'header-three': (children, _, { keys }) => children.map((child, i) => <h3 key={keys[i]}>{child}</h3>),
  'header-four': (children, _, { keys }) => children.map((child, i) => <h4 key={keys[i]}>{child}</h4>),
  'header-five': (children, _, { keys }) => children.map((child, i) => <h5 key={keys[i]}>{child}</h5>),
  'header-six': (children, _, { keys }) => children.map((child, i) => <h6 key={keys[i]}>{child}</h6>),
  'code-block': (children, _, { keys }) => <pre key={keys[0]} style={styles.codeBlock}>{addBreaklines(children)}</pre>,
  'unordered-list-item': getList(),
  'ordered-list-item': getList(true),
};

const entities = {
  LINK: (children, entity) => <a href={entity.url}>{children}</a>,
};


const isEmptyRaw = raw => (!raw || !raw.blocks || (raw.blocks.length === 1 && raw.blocks[0].text === ''));

const Preview = ({ raw }) => {
  const isEmpty = isEmptyRaw(raw);

  return (
    <div className="Preview">
      {isEmpty && <div className="Preview-empty">There's nothing to render...</div>}
      {!isEmpty && redraft(raw, { inline, blocks, entities })}
    </div>
  );
};

Preview.propTypes = {
  raw: PropTypes.shape({
    blocks: PropTypes.array.isRequired, // eslint-disable-line react/no-unused-prop-types
    entityMap: PropTypes.object.isRequired, // eslint-disable-line react/no-unused-prop-types
  }).isRequired,
};

export default Preview;

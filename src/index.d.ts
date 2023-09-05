export type InlineRenderer = (
  children: React.ReactNode[],
  params: { key: string; },
) => JSX.Element | null;

export type BlockRenderer = (
  children: React.ReactNode[],
  params: { depth: number; keys: string[], data?: {} },
) => Array<JSX.Element | null>;

export type EntityRenderer = (
  children: React.ReactNode[],
  data: any,
  params: { key: string },
) => JSX.Element | null;

export interface Renderers {
  styles?: {
    [styleName: string]: {};
  };
  inline?: {
    [inlineType: string]: InlineRenderer;
  };
  blocks?: {
    [blockType: string]: BlockRenderer;
  };
  entities?: {
    [entityName: string]: EntityRenderer;
  }
}

export interface Options {
  cleanup?: {
    after?: 'all' | string[];
    types?: 'all' | string[];
    except?: string[];
    trim?: boolean;
    split?: boolean;
  };
  joinOutput?: boolean;
  blockFallback?: string;
}

export default function redraft(
  raw: {},
  renderers: Renderers,
  options?: Options
): JSX.Element | null;
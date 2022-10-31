/**
 * Find text that match regular expression and transform it to md link with modifirers
 */
export default function remarkLinkifyModifier(options: Options | RegExp): any;

export type Options = {
  /** RegExp pattern */
  regex: RegExp;
  /** Mached text modifirer */
  modifier?: Modifier;
};

export type Modifier = {
  /** Modify text */
  modifyText?: (text: string) => string;
  /** Modify link */
  modifyLink?: (link: string) => string;
};

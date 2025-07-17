import { RichTextItemResponse } from "../../../notion-sdk/core/types/notion-api.types";

export const getNameProperty = ({ text }: {
  // TODO: Obviously these types aren't being used, but TBH I can't tell
  // from the types what *should* be used, so I'll have to see how the
  // output looks.
  text: string | undefined;
  links: (string | null)[];
  title: RichTextItemResponse[];
}): string => text || '(Undefined)';

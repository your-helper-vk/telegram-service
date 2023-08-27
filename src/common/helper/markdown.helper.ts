
export class MarkDownHelper {
    /**
     * The function "wrapTextWithUrl" takes a text and a URL as input and returns the text wrapped in a
     * Markdown link with the given URL.
     * @param {string} text - The `text` parameter is a string that represents the text that you want
     * to wrap with a URL. This can be any text that you want to display as a clickable link.
     * @param {string} url - The `url` parameter is a string that represents the URL or link that you
     * want to wrap around the `text` parameter.
     * @returns a string that wraps the given text with a markdown link syntax, using the given URL.
     */
    public static wrapTextWithUrl(text: string, url: string): string {
        return `[${text}](${url})`;
    }
}

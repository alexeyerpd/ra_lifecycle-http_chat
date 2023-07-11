declare module '*.svg' {
    const content: SVGIconData;

    export default content;
}

declare module '*.png' {
    export default string;
}

declare module '*.jpg' {
    export default string;
}

declare module '*.jpeg' {
    export default string;
}

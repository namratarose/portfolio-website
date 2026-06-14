// Allow importing CSS files as side-effects in TypeScript
declare module '*.css' {
  const styles: Record<string, string>
  export default styles
}

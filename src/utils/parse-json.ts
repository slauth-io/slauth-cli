export default function parseJson<T>(data: string) {
  try {
    const json: T = JSON.parse(data);
    return json;
  } catch (err) {
    throw new Error(`Error parsing JSON: ${(err as Error).message}`);
  }
}

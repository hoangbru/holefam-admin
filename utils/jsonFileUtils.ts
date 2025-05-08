import path from "path";
import { promises as fs } from "fs";

const getFilePath = (fileName: string): string => {
  return path.join(process.cwd(), "data", fileName);
};

export async function readJsonFile<T>(fileName: string): Promise<T> {
  try {
    const filePath = getFilePath(fileName);
    const fileContent = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileContent) as T;
  } catch (error) {
    console.error(`Error reading JSON file ${fileName}:`, error);
    return [] as T;
  }
}

export async function writeJsonFile<T>(
  fileName: string,
  data: T
): Promise<void> {
  try {
    const filePath = getFilePath(fileName);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error(`Error writing JSON file ${fileName}:`, error);
    throw new Error(`Failed to write JSON file ${fileName}`);
  }
}

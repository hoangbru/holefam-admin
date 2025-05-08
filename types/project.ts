import { Technology } from "./technology";

export interface Project {
  id: string;
  name: string;
  image: string;
  description: string;
  link: string;
  githubLink?: string;
  technologies: Technology[];
  createdAt?: Date;
  updatedAt?: Date;
}

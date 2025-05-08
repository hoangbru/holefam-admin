"use client";

import { Project } from "@/types/project";
import { useEffect, useState } from "react";

const ProjectsList = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/projects");
        const data = await response.json();
        setProjects(data);
      } catch {
        setError("Failed to fetch projects");
      }
    }
    fetchProjects();
  }, []);
  return (
    <div>
      <div></div>
    </div>
  );
};

export default ProjectsList;

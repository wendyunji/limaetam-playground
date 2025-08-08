import { Octokit } from "@octokit/rest";

export function getOctokit() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN missing");
  return new Octokit({ auth: token });
}

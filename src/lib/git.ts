import { Octokit } from '@octokit/rest';
import fs from 'fs';
import path from 'path';

interface GitConfig {
  owner: string;
  repo: string;
  token: string;
}

export class GitManager {
  private octokit: Octokit;
  private config: GitConfig;

  constructor(config: GitConfig) {
    this.config = config;
    this.octokit = new Octokit({
      auth: config.token,
    });
  }

  async commitPost(slug: string, title: string) {
    const filePath = `content/posts/${slug}.md`;
    const content = fs.readFileSync(path.join(process.cwd(), filePath), 'utf8');
    
    try {
      // Get current file SHA if it exists
      let sha: string | undefined;
      try {
        const { data } = await this.octokit.rest.repos.getContent({
          owner: this.config.owner,
          repo: this.config.repo,
          path: filePath,
        });
        if ('sha' in data) {
          sha = data.sha;
        }
      } catch (error) {
        // File doesn't exist, that's ok
      }

      // Create or update the file
      await this.octokit.rest.repos.createOrUpdateFileContents({
        owner: this.config.owner,
        repo: this.config.repo,
        path: filePath,
        message: `Add post: ${title}`,
        content: Buffer.from(content).toString('base64'),
        sha,
      });

      return { success: true };
    } catch (error) {
      console.error('Git commit failed:', error);
      return { success: false, error };
    }
  }
}
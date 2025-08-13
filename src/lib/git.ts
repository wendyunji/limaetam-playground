import { Octokit } from '@octokit/rest';

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

  async commitPost(slug: string, title: string, content: string, author?: string) {
    const filePath = `content/posts/${slug}.md`;
    
    try {
      // Check if repo exists and user has write access
      try {
        await this.octokit.rest.repos.get({
          owner: this.config.owner,
          repo: this.config.repo,
        });
      } catch (error) {
        return { 
          success: false, 
          error: 'Repository not found or insufficient permissions' 
        };
      }

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

      // Create commit message
      const commitMessage = sha 
        ? `Update post: ${title}` 
        : `Add new post: ${title}`;

      // Create or update the file
      const result = await this.octokit.rest.repos.createOrUpdateFileContents({
        owner: this.config.owner,
        repo: this.config.repo,
        path: filePath,
        message: commitMessage,
        content: Buffer.from(content).toString('base64'),
        sha,
        author: author ? {
          name: author,
          email: `${author}@users.noreply.github.com`
        } : undefined,
      });

      return { 
        success: true, 
        commitUrl: result.data.commit.html_url,
        sha: result.data.commit.sha 
      };
    } catch (error: any) {
      console.error('Git commit failed:', error);
      return { 
        success: false, 
        error: error.message || 'Unknown error occurred' 
      };
    }
  }

  async getRepositoryInfo() {
    try {
      const { data } = await this.octokit.rest.repos.get({
        owner: this.config.owner,
        repo: this.config.repo,
      });
      
      return {
        success: true,
        data: {
          name: data.name,
          full_name: data.full_name,
          private: data.private,
          permissions: data.permissions
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get repository info'
      };
    }
  }
}
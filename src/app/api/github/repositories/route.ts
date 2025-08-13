import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

export async function GET(request: NextRequest) {
  const authorization = request.headers.get('authorization');
  
  if (!authorization) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authorization.replace('Bearer ', '');
  
  try {
    const octokit = new Octokit({ auth: token });
    
    const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
      visibility: 'all',
      sort: 'updated',
      per_page: 100
    });

    const repositoriesWithPermissions = repos.filter(repo => repo.permissions?.push);

    return NextResponse.json(repositoriesWithPermissions);
  } catch (error) {
    console.error('Failed to fetch repositories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch repositories' },
      { status: 500 }
    );
  }
}
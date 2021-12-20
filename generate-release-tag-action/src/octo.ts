import github from "@actions/github";
import { getValidLabelName } from "./utils";

export const getLatestReleaseTag = async (token: string): Promise<string> => {
  const octokit = github.getOctokit(token);

  const release = await octokit.rest.repos.getLatestRelease({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
  });

  return release.data.tag_name;
};

export const getRelatedPullRequestLabel = async (token: string): Promise<string> => {
  const octokit = github.getOctokit(token);

  const pullRequests = await octokit.rest.pulls.list({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    sort: "updated",
    direction: "desc",
    state: "closed",
    per_page: 100,
  });

  const pull = pullRequests.data.find((p) => p.merge_commit_sha === github.context.sha);

  if (!pull) return "";

  return getValidLabelName(pull.labels);
};

export const pushTag = async (token: string, tag: string) => {
  const octokit = github.getOctokit(token);

  await octokit.rest.git.createTag({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    tag,
    type: "commit",
    object: github.context.sha,
    message: `Release ${tag}`,
  });

  await octokit.rest.git.createRef({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    ref: `refs/tags/${tag}`,
    sha: github.context.sha,
  });
};

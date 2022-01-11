import * as core from "@actions/core";
import { bumpReleaseTag, getVersioningScheme } from "./utils";
import { getLatestReleaseTag, getRelatedPullRequestLabel, pushTag } from "./octo";

const run = async () => {
  try {
    const token = core.getInput("github_token");
    const prefix = core.getInput("prefix");

    const [currentReleaseTag, labelName] = await Promise.all([
      getLatestReleaseTag(token),
      getRelatedPullRequestLabel(token),
    ]);

    core.info(`Found current release tag: ${currentReleaseTag}`);
    core.info(`Found label name: ${labelName}`);

    if (labelName.length === 0) return;

    const newReleaseTag = bumpReleaseTag(currentReleaseTag, getVersioningScheme(labelName), prefix);

    core.info(`Create new release tag: ${newReleaseTag}`);

    await pushTag(token, newReleaseTag);

    core.setOutput("new_tag", newReleaseTag);
  } catch (error: any) {
    core.setFailed(error.message);
  }
};

run();

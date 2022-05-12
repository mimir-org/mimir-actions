import * as core from "@actions/core";
import { pushTag } from "./lib/octo";
import { generateNewReleaseTag, getReleaseTagAndVersioningScheme, processInputs } from "./lib";
import { getTagWithPrefix } from "./lib/utils";

try {
  const input = processInputs();

  const [currentReleaseTag, versioningScheme] = await getReleaseTagAndVersioningScheme(input);

  core.info(`Current release: ${currentReleaseTag}`);
  core.info(`Versioning scheme: ${versioningScheme}`);

  const newReleaseTagRaw = await generateNewReleaseTag(input, currentReleaseTag, versioningScheme);
  const newReleaseTag = getTagWithPrefix(newReleaseTagRaw, input.prefix) as string;

  core.info(`Create new release tag: ${newReleaseTag}, raw tag: ${newReleaseTagRaw}`);

  if (input.shouldPushNewTag) await pushTag(input.token, newReleaseTag);

  core.setOutput("new_tag", newReleaseTag);
  core.setOutput("raw_tag", newReleaseTagRaw);
} catch (error: any) {
  core.setFailed(error.message);
  process.exit(1);
}

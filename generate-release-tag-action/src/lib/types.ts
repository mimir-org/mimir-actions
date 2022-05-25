import { ReleaseType } from "semver";

export type Input = {
  token: string;
  target?: Target;
  prefix: string;
  suffix: string;
  shouldPushNewTag: boolean;
};

export type Target = "major" | "minor" | "patch";

export type ReleaseTypeDict = { [key: string]: ReleaseType };

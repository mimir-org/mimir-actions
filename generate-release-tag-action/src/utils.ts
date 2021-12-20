import semver, { ReleaseType } from "semver";

export const RELEASE_TYPES = {
  Major: "major",
  Minor: "minor",
  Patch: "patch",
};

type Labels = {
  name?: string;
}[];

export const getValidLabelName = (labels: Labels): string => {
  const labelNames = labels
    .map((label) => label.name)
    .filter((labelName): labelName is string => !!labelName)
    .filter((labelName) => labelName.includes("release:"));

  return labelNames[0] ?? "";
};

export const bumpReleaseTag = (prevReleaseTag: string, versioningScheme: string, prefix: string) => {
  if (!versioningScheme || !isReleaseType(versioningScheme)) return "";

  return prefix + semver.inc(prevReleaseTag, versioningScheme);
};

export const getVersioningScheme = (labelName: string | undefined): string => labelName?.split(":")[1] ?? "";

const isReleaseType = (versioningScheme: string): versioningScheme is ReleaseType =>
  Object.values(RELEASE_TYPES).includes(versioningScheme);

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

export const bumpReleaseTag = (prevReleaseTag: string, versioningScheme: string): string => {
  if (!versioningScheme || !isReleaseType(versioningScheme)) return "";

  const tag = semver.inc(prevReleaseTag, versioningScheme);

  if (tag === null) return "";

  return tag;
};

export const getTagWithPrefix = (tag: string, prefix: string): string => {
  if (!tag) return "";

  return prefix + tag;
};

export const getVersioningScheme = (labelName: string | undefined): string => labelName?.split(":")[1] ?? "";

const isReleaseType = (versioningScheme: string): versioningScheme is ReleaseType =>
  Object.values(RELEASE_TYPES).includes(versioningScheme);

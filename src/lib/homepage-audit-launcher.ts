export const legacyHomepageAuditStorageKeys = [
  "upskillusa.homepageAuditReport.v1",
  "upskillusa.homepageAuditReport.v2",
] as const;

export const legacyHomepageAuditCleanupScript = `try{${JSON.stringify(
  legacyHomepageAuditStorageKeys,
)}.forEach(function(key){window.localStorage.removeItem(key)})}catch{}`;

type RemovableStorage = Pick<Storage, "removeItem">;

export function isValidHomepageCompanyUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed || /\s/.test(trimmed)) return false;

  try {
    const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const url = new URL(candidate);
    const labels = url.hostname.replace(/^www\./i, "").split(".");

    return (
      ["http:", "https:"].includes(url.protocol) &&
      !url.username &&
      !url.password &&
      labels.length >= 2 &&
      labels.every((label) => /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(label))
    );
  } catch {
    return false;
  }
}

export function createHomepageImplementDraft<T extends object>(defaultImplement: T, companyUrl: string) {
  return {
    ...defaultImplement,
    audience: "business",
    companyUrl: companyUrl.trim(),
    email: "",
  };
}

export function clearLegacyHomepageAuditStorage(storage: RemovableStorage) {
  for (const key of legacyHomepageAuditStorageKeys) {
    try {
      storage.removeItem(key);
    } catch {
      // Cleanup is best effort so browser privacy settings never block the launcher.
    }
  }
}

import { Sentinel, SentinelDecision } from '@riven/schemas';

export class MockSentinel extends Sentinel {
  override async reportActivity(activity: unknown) {
    return [SentinelDecision.Allowed, Date.now()] as const;
  }
}
